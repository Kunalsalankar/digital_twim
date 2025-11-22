import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import SimulationControls from './components/SimulationControls';
import PanelGrid from './components/PanelGrid';
import MetricsPanel from './components/MetricsPanel';

function App() {
  const [solarData, setSolarData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [simulationStatus, setSimulationStatus] = useState({
    isRunning: false,
    currentIndex: 0,
    totalDataPoints: 0
  });
  const [dataHistory, setDataHistory] = useState([]);
  const [panelData, setPanelData] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [viewMode, setViewMode] = useState('panels'); // 'panels' or 'dashboard'

  useEffect(() => {
    // Connect to Server-Sent Events stream
    const eventSource = new EventSource('http://localhost:3001/api/solar/stream');

    eventSource.onopen = () => {
      console.log('Connected to solar panel stream');
      setConnectionStatus('connected');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'connected') {
          console.log('Stream connected:', data.message);
          setSimulationStatus(prev => ({
            ...prev,
            totalDataPoints: data.totalDataPoints,
            isRunning: data.isRunning
          }));
        } else if (data.type === 'data' || data.type === 'combined') {
          // Update current data
          setSolarData(data);
          setSimulationStatus(prev => ({
            ...prev,
            currentIndex: data.currentIndex,
            totalDataPoints: data.totalPoints,
            isRunning: true
          }));

          // Update panel data if available
          if (data.panels) {
            setPanelData(data.panels);
          }
          
          // Update metrics if available
          if (data.metrics) {
            setMetrics(data.metrics);
          }

          // Add to history (keep last 60 data points for charts)
          setDataHistory(prev => {
            const newHistory = [...prev, data];
            return newHistory.slice(-60); // Keep only last 60 points
          });
        } else if (data.type === 'panels') {
          // Panel-only data (no CSV data)
          if (data.panels) {
            setPanelData(data.panels);
          }
          
          if (data.metrics) {
            setMetrics(data.metrics);
          }
          
          setSimulationStatus(prev => ({ ...prev, isRunning: true }));
        } else if (data.type === 'stopped') {
          console.log('Simulation stopped:', data.message);
          setSimulationStatus(prev => ({ ...prev, isRunning: false }));
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      setConnectionStatus('error');
    };

    // Cleanup on component unmount
    return () => {
      eventSource.close();
    };
  }, []);

  const handleStartSimulation = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/solar/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      console.log('Start simulation:', result);
    } catch (error) {
      console.error('Error starting simulation:', error);
    }
  };

  const handleStopSimulation = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/solar/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      console.log('Stop simulation:', result);
    } catch (error) {
      console.error('Error stopping simulation:', error);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🌞 Solar Panel Digital Twin</h1>
        <div className="header-controls">
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'panels' ? 'active' : ''}`}
              onClick={() => setViewMode('panels')}
            >
              Panel Grid
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'dashboard' ? 'active' : ''}`}
              onClick={() => setViewMode('dashboard')}
            >
              Dashboard
            </button>
          </div>
          <div className="connection-status">
            <span className={`status-indicator ${connectionStatus}`}></span>
            <span>{connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <SimulationControls
          simulationStatus={simulationStatus}
          onStart={handleStartSimulation}
          onStop={handleStopSimulation}
        />
        
        {viewMode === 'panels' ? (
          <>
            <MetricsPanel 
              metrics={metrics}
              solarData={solarData}
            />
            <PanelGrid 
              panels={panelData}
              metrics={metrics}
            />
          </>
        ) : (
          <Dashboard 
            solarData={solarData}
            dataHistory={dataHistory}
            connectionStatus={connectionStatus}
          />
        )}
      </main>
    </div>
  );
}

export default App;
