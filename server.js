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

        // Send data to all connected clients
        clients.forEach(client => {
            try {
                client.response.write(`data: ${JSON.stringify(currentData)}\n\n`);
            } catch (error) {
                console.log('Error sending data to client:', error.message);
            }
        });

        currentIndex++;
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
