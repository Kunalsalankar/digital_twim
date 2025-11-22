const express = require('express');
const cors = require('cors');
const csv = require('csv-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Global variables for data management
let solarData = [];
let currentIndex = 0;
let isSimulationRunning = false;
let clients = []; // Store SSE clients
let simulationInterval = null;

// Panel simulation data
let panelData = [];
const TOTAL_PANELS = 30;

// Initialize panel data
function initializePanels() {
    panelData = [];
    for (let i = 1; i <= TOTAL_PANELS; i++) {
        const panelId = `P${i.toString().padStart(2, '0')}`;
        panelData.push({
            id: panelId,
            power: Math.floor(Math.random() * 50), // Random initial power 0-50W
            voltage: 30 + Math.random() * 10, // 30-40V
            current: 1 + Math.random() * 5, // 1-6A
            temperature: 20 + Math.random() * 30, // 20-50°C
            status: 'normal',
            lastUpdate: new Date().toISOString()
        });
    }
}

// Load CSV data on server start
function loadCSVData() {
    try {
        // Look specifically for final1.csv file
        const csvFile = 'final.csv';
        const csvPath = path.join(__dirname, csvFile);
        
        if (!fs.existsSync(csvPath)) {
            console.log('⚠️  final.csv file not found. Please place your solar data CSV file named "final.csv" in the project directory.');
            console.log('   Expected columns: timestamp, ActivePowerL3, CurrentL3, VoltageL3, IRRADIATION, temp');
            return;
        }

        console.log(`📊 Loading data from: ${csvFile}`);
        
        const rawData = [];
        
        // Read CSV file using csv-parser
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (row) => {
                rawData.push(row);
            })
            .on('end', () => {
                // Process the data with proper data types
                solarData = rawData.map((row, index) => ({
                    id: index + 1,
                    timestamp: row.timestamp || new Date().toISOString(),
                    ActivePowerL3: parseFloat(row.ActivePowerL3) || 0,
                    CurrentL3: parseFloat(row.CurrentL3) || 0,
                    VoltageL3: parseFloat(row.VoltageL3) || 0,
                    IRRADIATION: parseFloat(row.IRRADIATION) || 0,
                    temp: parseFloat(row.temp) || 0
                }));

                console.log(`✅ Loaded ${solarData.length} data points from CSV file`);
                console.log('📋 Sample data point:', solarData[0]);
            })
            .on('error', (error) => {
                console.error('❌ Error reading CSV file:', error.message);
                console.log('💡 Make sure your CSV file has columns: timestamp, ActivePowerL3, CurrentL3, VoltageL3, IRRADIATION, temp');
            });
        
    } catch (error) {
        console.error('❌ Error loading CSV file:', error.message);
        console.log('💡 Make sure your CSV file named "final.csv" has columns: timestamp, ActivePowerL3, CurrentL3, VoltageL3, IRRADIATION, temp');
    }
}

// Simulate panel data changes
function simulatePanelChanges() {
    panelData.forEach(panel => {
        // Simulate realistic power fluctuations
        const baseChange = (Math.random() - 0.5) * 10; // -5 to +5W change
        panel.power = Math.max(0, Math.min(60, panel.power + baseChange));
        
        // Simulate faults (5% chance per panel per update)
        if (Math.random() < 0.05) {
            panel.power = 0; // Fault condition
            panel.status = 'fault';
        } else if (panel.power < 10) {
            panel.status = 'warning';
        } else {
            panel.status = 'normal';
        }
        
        // Update other parameters
        panel.voltage = 30 + Math.random() * 10;
        panel.current = panel.power > 0 ? panel.power / panel.voltage : 0;
        panel.temperature = 20 + Math.random() * 30;
        panel.lastUpdate = new Date().toISOString();
    });
}

// Calculate aggregated metrics
function getAggregatedMetrics() {
    const totalPower = panelData.reduce((sum, panel) => sum + panel.power, 0);
    const avgVoltage = panelData.reduce((sum, panel) => sum + panel.voltage, 0) / panelData.length;
    const avgCurrent = panelData.reduce((sum, panel) => sum + panel.current, 0) / panelData.length;
    const avgTemperature = panelData.reduce((sum, panel) => sum + panel.temperature, 0) / panelData.length;
    
    const normalPanels = panelData.filter(p => p.status === 'normal').length;
    const warningPanels = panelData.filter(p => p.status === 'warning').length;
    const faultPanels = panelData.filter(p => p.status === 'fault').length;
    
    return {
        totalPower: totalPower.toFixed(2),
        avgVoltage: avgVoltage.toFixed(1),
        avgCurrent: avgCurrent.toFixed(1),
        avgTemperature: avgTemperature.toFixed(1),
        panelCount: {
            total: TOTAL_PANELS,
            normal: normalPanels,
            warning: warningPanels,
            fault: faultPanels
        }
    };
}

// API endpoint for live panel data
app.get('/api/solar/live-panels', (req, res) => {
    const metrics = getAggregatedMetrics();
    res.json({
        panels: panelData,
        metrics: metrics,
        timestamp: new Date().toISOString()
    });
});

// SSE endpoint for real-time data streaming
app.get('/api/solar/stream', (req, res) => {
    // Set headers for Server-Sent Events
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Add client to the list
    const clientId = Date.now();
    const client = { id: clientId, response: res };
    clients.push(client);

    console.log(`🔌 New client connected: ${clientId}`);

    // Send initial connection message
    res.write(`data: ${JSON.stringify({ 
        type: 'connected', 
        message: 'Connected to solar panel stream',
        totalDataPoints: solarData.length,
        isRunning: isSimulationRunning
    })}\n\n`);

    // Handle client disconnect
    req.on('close', () => {
        clients = clients.filter(c => c.id !== clientId);
        console.log(`🔌 Client disconnected: ${clientId}`);
    });
});

// Start simulation endpoint
app.post('/api/solar/start', (req, res) => {
    if (solarData.length === 0) {
        return res.status(400).json({ 
            error: 'No data loaded. Please ensure final.csv file is in the project directory.' 
        });
    }

    if (isSimulationRunning) {
        return res.json({ message: 'Simulation already running', isRunning: true });
    }

    isSimulationRunning = true;
    console.log('▶️  Starting solar panel simulation...');

    // Start streaming data every second
    simulationInterval = setInterval(() => {
        // Update panel data
        simulatePanelChanges();
        
        // Update CSV data if available
        if (solarData.length > 0) {
            if (currentIndex >= solarData.length) {
                // Loop back to start when end is reached
                currentIndex = 0;
                console.log('🔄 Reached end of data, looping back to start');
            }

            const currentData = {
                ...solarData[currentIndex],
                currentIndex: currentIndex + 1,
                totalPoints: solarData.length,
                timestamp: new Date().toISOString(), // Use current time for real-time feel
                type: 'data'
            };

            // Send combined data to all connected clients
            const combinedData = {
                ...currentData,
                panels: panelData,
                metrics: getAggregatedMetrics(),
                type: 'combined'
            };

            clients.forEach(client => {
                try {
                    client.response.write(`data: ${JSON.stringify(combinedData)}\n\n`);
                } catch (error) {
                    console.log('Error sending data to client:', error.message);
                }
            });

            currentIndex++;
        } else {
            // Send only panel data if no CSV data
            const panelOnlyData = {
                panels: panelData,
                metrics: getAggregatedMetrics(),
                timestamp: new Date().toISOString(),
                type: 'panels'
            };

            clients.forEach(client => {
                try {
                    client.response.write(`data: ${JSON.stringify(panelOnlyData)}\n\n`);
                } catch (error) {
                    console.log('Error sending data to client:', error.message);
                }
            });
        }
    }, 1000); // Send data every second

    res.json({ message: 'Simulation started', isRunning: true });
});

// Stop simulation endpoint
app.post('/api/solar/stop', (req, res) => {
    if (!isSimulationRunning) {
        return res.json({ message: 'Simulation not running', isRunning: false });
    }

    isSimulationRunning = false;
    
    if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
    }

    // Notify all clients that simulation stopped
    clients.forEach(client => {
        try {
            client.response.write(`data: ${JSON.stringify({ 
                type: 'stopped', 
                message: 'Simulation stopped' 
            })}\n\n`);
        } catch (error) {
            console.log('Error sending stop message to client:', error.message);
        }
    });

    console.log('⏹️  Solar panel simulation stopped');
    res.json({ message: 'Simulation stopped', isRunning: false });
});

// Get current simulation status
app.get('/api/solar/status', (req, res) => {
    res.json({
        isRunning: isSimulationRunning,
        currentIndex,
        totalDataPoints: solarData.length,
        hasData: solarData.length > 0
    });
});

// Get sample data (for testing)
app.get('/api/solar/sample', (req, res) => {
    if (solarData.length === 0) {
        return res.status(404).json({ error: 'No data loaded' });
    }
    
    res.json({
        sampleData: solarData.slice(0, 5),
        totalPoints: solarData.length
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        dataLoaded: solarData.length > 0,
        dataPoints: solarData.length
    });
});

// Load data when server starts
loadCSVData();
initializePanels();

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Solar Panel Digital Twin Server running on port ${PORT}`);
    console.log(`📡 Stream endpoint: http://localhost:${PORT}/api/solar/stream`);
    console.log(`🔧 Control endpoints:`);
    console.log(`   POST http://localhost:${PORT}/api/solar/start`);
    console.log(`   POST http://localhost:${PORT}/api/solar/stop`);
    console.log(`   GET  http://localhost:${PORT}/api/solar/status`);
    
    if (solarData.length === 0) {
        console.log('\n⚠️  SETUP REQUIRED:');
        console.log('   1. Place your CSV file named "final.csv" in this directory');
        console.log('   2. Restart the server');
        console.log('   3. CSV should have columns: timestamp, ActivePowerL3, CurrentL3, VoltageL3, IRRADIATION, temp');
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    if (simulationInterval) {
        clearInterval(simulationInterval);
    }
    process.exit(0);
});
