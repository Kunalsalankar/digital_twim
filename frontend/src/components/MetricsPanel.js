import React from 'react';
import './MetricsPanel.css';

const MetricsPanel = ({ metrics, solarData }) => {
  if (!metrics) {
    return (
      <div className="metrics-panel">
        <div className="metrics-loading">
          <p>Loading metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="metrics-panel">
      <div className="metrics-header">
        <h2>📊 System Metrics</h2>
        <div className="last-updated">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <div className="metric-label">Total Power</div>
            <div className="metric-value">{metrics.totalPower}</div>
            <div className="metric-unit">kW</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">🔋</div>
          <div className="metric-content">
            <div className="metric-label">Avg Voltage</div>
            <div className="metric-value">{metrics.avgVoltage}</div>
            <div className="metric-unit">V</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">🔌</div>
          <div className="metric-content">
            <div className="metric-label">Avg Current</div>
            <div className="metric-value">{metrics.avgCurrent}</div>
            <div className="metric-unit">A</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">🌡️</div>
          <div className="metric-content">
            <div className="metric-label">Avg Temperature</div>
            <div className="metric-value">{metrics.avgTemperature}</div>
            <div className="metric-unit">°C</div>
          </div>
        </div>
        
        {solarData && (
          <div className="metric-card">
            <div className="metric-icon">☀️</div>
            <div className="metric-content">
              <div className="metric-label">Irradiation</div>
              <div className="metric-value">{solarData.IRRADIATION?.toFixed(0) || '0'}</div>
              <div className="metric-unit">W/m²</div>
            </div>
          </div>
        )}
      </div>
      
      <div className="system-status">
        <div className="status-section">
          <h3>System Status</h3>
          <div className="status-indicators">
            <div className="status-item">
              <div className="status-dot normal"></div>
              <span>Normal: {metrics.panelCount?.normal || 0} panels</span>
            </div>
            <div className="status-item">
              <div className="status-dot warning"></div>
              <span>Warning: {metrics.panelCount?.warning || 0} panels</span>
            </div>
            <div className="status-item">
              <div className="status-dot fault"></div>
              <span>Fault: {metrics.panelCount?.fault || 0} panels</span>
            </div>
          </div>
        </div>
        
        <div className="efficiency-section">
          <h3>Efficiency</h3>
          <div className="efficiency-bar">
            <div 
              className="efficiency-fill"
              style={{ 
                width: `${Math.min(100, (metrics.panelCount?.normal / metrics.panelCount?.total) * 100)}%` 
              }}
            ></div>
          </div>
          <div className="efficiency-text">
            {Math.round((metrics.panelCount?.normal / metrics.panelCount?.total) * 100)}% operational
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;
