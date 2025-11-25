import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import SimulationControls from './components/SimulationControls';
import PanelGrid from './components/PanelGrid';
import MetricsPanel from './components/MetricsPanel';
import { API_URL } from './config';

const UPDATE_INTERVAL_MS = 10000;

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
    // Use polling instead of SSE for Vercel compatibility
    const fetchPanelData = async () => {
      try {
        console.log('🔄 Fetching panel data from:', `${API_URL}/api/solar/live-panels`);
        const response = await fetch(`${API_URL}/api/solar/live-panels`);
        console.log('📡 Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('📊 Received data:', data);
          
          // Update panel data
          setPanelData(data.panels);
          setMetrics(data.metrics);
          setConnectionStatus('connected');

          if (data.currentSolarData) {
            setSolarData(data.currentSolarData);

            setDataHistory(prev => {
              const newHistory = [...prev, data.currentSolarData];
              return newHistory.slice(-60);
            });

            setSimulationStatus(prev => ({
              ...prev,
              isRunning: true,
              currentIndex: data.currentSolarData.currentIndex || prev.currentIndex,
              totalDataPoints: data.currentSolarData.totalPoints || prev.totalDataPoints
            }));
          } else {
            console.warn('⚠️ currentSolarData missing from API response');
          }
          
        } else {
          console.error('❌ API response not ok:', response.status, response.statusText);
          setConnectionStatus('error');
        }
      } catch (error) {
        console.error('❌ Error fetching panel data:', error);
        setConnectionStatus('error');
      }
    };

    // Initial fetch
    fetchPanelData();
    setConnectionStatus('connected');

    // Set up polling interval
    const interval = setInterval(fetchPanelData, UPDATE_INTERVAL_MS);

    // Cleanup on component unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleStartSimulation = async () => {
    try {
      const response = await fetch(`${API_URL}/api/solar/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      console.log('Start simulation:', result);
      setSimulationStatus(prev => ({
        ...prev,
        isRunning: result.isRunning ?? true
      }));
    } catch (error) {
      console.error('Error starting simulation:', error);
    }
  };

  const handleStopSimulation = async () => {
    try {
      const response = await fetch(`${API_URL}/api/solar/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      console.log('Stop simulation:', result);
      setSimulationStatus(prev => ({
        ...prev,
        isRunning: result.isRunning ?? false
      }));
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
          updateIntervalMs={UPDATE_INTERVAL_MS}
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
