// Global variables for panel simulation
let panelData = [];
const TOTAL_PANELS = 30;

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
    
    res.status(200).json({
        panels: panelData,
        metrics: metrics,
        timestamp: new Date().toISOString()
    });
}
