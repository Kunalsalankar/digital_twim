import fs from 'fs';
import path from 'path';

// Global variables for panel simulation
let panelData = [];
const TOTAL_PANELS = 30;
let csvData = [];
let csvIndex = 0;
let csvLoaded = false;

const CSV_FILE_NAME = 'final.csv';

function loadCsvData() {
    if (csvLoaded) {
        return;
    }

    const csvPath = path.join(process.cwd(), CSV_FILE_NAME);

    try {
        if (!fs.existsSync(csvPath)) {
            console.error(`⚠️ CSV file ${CSV_FILE_NAME} not found at ${csvPath}`);
            csvData = [];
            csvLoaded = true;
            return;
        }

        const fileContents = fs.readFileSync(csvPath, 'utf8');
        const lines = fileContents.split(/\r?\n/).filter(Boolean);

        if (lines.length <= 1) {
            console.error('⚠️ CSV file has no data rows.');
            csvData = [];
            csvLoaded = true;
            return;
        }

        const headers = lines[0].split(',').map(h => h.trim());
        const normalizeNumber = value => {
            const parsed = parseFloat(value);
            return Number.isFinite(parsed) ? parsed : 0;
        };

        csvData = lines.slice(1).map((line, index) => {
            const values = line.split(',').map(v => v.trim());
            const row = {};
            headers.forEach((header, i) => {
                row[header] = values[i] ?? '';
            });

            return {
                id: index + 1,
                timestamp: row.timestamp || new Date().toISOString(),
                ActivePowerL3: normalizeNumber(row.ActivePowerL3),
                CurrentL3: normalizeNumber(row.CurrentL3),
                VoltageL3: normalizeNumber(row.VoltageL3),
                IRRADIATION: normalizeNumber(row.IRRADIATION),
                temp: normalizeNumber(row.temp)
            };
        });

        csvLoaded = true;
        console.log(`✅ Loaded ${csvData.length} rows from ${CSV_FILE_NAME}`);
    } catch (error) {
        console.error('❌ Error reading CSV file on Vercel function:', error);
        csvData = [];
        csvLoaded = true;
    }
}

function getNextSolarDataPoint() {
    loadCsvData();

    if (csvData.length === 0) {
        return null;
    }

    if (csvIndex >= csvData.length) {
        csvIndex = 0;
    }

    const base = csvData[csvIndex];
    csvIndex += 1;

    return {
        ...base,
        currentIndex: csvIndex,
        totalPoints: csvData.length
    };
}

// Initialize panel data
function initializePanels() {
    if (panelData.length === 0) {
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

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Initialize panels if not done
    initializePanels();
    
    // Simulate changes
    simulatePanelChanges();
    
    const metrics = getAggregatedMetrics();
    const currentSolarData = getNextSolarDataPoint();
    
    res.status(200).json({
        panels: panelData,
        metrics: metrics,
        currentSolarData,
        timestamp: new Date().toISOString()
    });
}
