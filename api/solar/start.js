export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        res.status(200).json({
            message: 'Simulation started',
            isRunning: true,
            timestamp: new Date().toISOString()
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
