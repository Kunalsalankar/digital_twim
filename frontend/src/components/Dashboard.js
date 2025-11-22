import React from 'react';
import './Dashboard.css';
import DataCard from './DataCard';
import TimeSeriesChart from './TimeSeriesChart';

const Dashboard = ({ solarData, dataHistory, connectionStatus }) => {
  // Show loading state if no data
  if (!solarData && connectionStatus === 'connected') {
    return (
      <div className="dashboard">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Waiting for solar panel data...</p>
          <p className="loading-hint">Click "Start Simulation" to begin streaming data</p>
        </div>
      </div>
    );
  }

  // Show disconnected state
  if (connectionStatus !== 'connected') {
    return (
      <div className="dashboard">
        <div className="disconnected-state">
          <div className="disconnected-icon">⚠️</div>
          <h3>Connection Lost</h3>
          <p>Unable to connect to the solar panel data stream.</p>
          <p className="disconnected-hint">Please check if the backend server is running on port 3001</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Current Values Section */}
      <section className="current-values">
        <h2>Current Readings</h2>
        <div className="data-cards-grid">
          <DataCard
            title="Active Power"
            value={solarData?.ActivePowerL3}
            unit="W"
            icon="⚡"
            color="#22c55e"
          />
          <DataCard
            title="Current"
            value={solarData?.CurrentL3}
            unit="A"
            icon="🔌"
            color="#3b82f6"
          />
          <DataCard
            title="Voltage"
            value={solarData?.VoltageL3}
            unit="V"
            icon="🔋"
            color="#a855f7"
          />
          <DataCard
            title="Irradiation"
            value={solarData?.IRRADIATION}
            unit="W/m²"
            icon="☀️"
            color="#f59e0b"
          />
          <DataCard
            title="Temperature"
            value={solarData?.temp}
            unit="°C"
            icon="🌡️"
            color="#f97316"
          />
        </div>
      </section>

      {/* Status Information */}
      <section className="status-info">
        <div className="status-card">
          <h3>📊 Data Point</h3>
          <p>{solarData?.currentIndex || 0} of {solarData?.totalPoints || 0}</p>
        </div>
        <div className="status-card">
          <h3>🕒 Last Updated</h3>
          <p>{solarData?.timestamp ? new Date(solarData.timestamp).toLocaleTimeString() : 'N/A'}</p>
        </div>
        <div className="status-card">
          <h3>📈 History Points</h3>
          <p>{dataHistory.length} samples</p>
        </div>
      </section>

      {/* Time Series Charts */}
      <section className="charts-section">
        <h2>Time Series Data (Last 60 seconds)</h2>
        <div className="charts-grid">
          <div className="chart-container">
            <h3>Active Power (W)</h3>
            <TimeSeriesChart
              data={dataHistory}
              dataKey="ActivePowerL3"
              color="#22c55e"
              yAxisLabel="Power (W)"
            />
          </div>
          <div className="chart-container">
            <h3>Voltage (V)</h3>
            <TimeSeriesChart
              data={dataHistory}
              dataKey="VoltageL3"
              color="#a855f7"
              yAxisLabel="Voltage (V)"
            />
          </div>
        </div>
        
        <div className="charts-grid">
          <div className="chart-container">
            <h3>Current (A)</h3>
            <TimeSeriesChart
              data={dataHistory}
              dataKey="CurrentL3"
              color="#3b82f6"
              yAxisLabel="Current (A)"
            />
          </div>
          <div className="chart-container">
            <h3>Temperature (°C)</h3>
            <TimeSeriesChart
              data={dataHistory}
              dataKey="temp"
              color="#f97316"
              yAxisLabel="Temperature (°C)"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
