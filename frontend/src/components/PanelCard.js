import React from 'react';
import './PanelCard.css';

const PanelCard = ({ panel }) => {
  const { id, power, voltage, current, temperature, status } = panel;

  const getStatusColor = (status, power) => {
    if (status === 'fault' || power === 0) return 'fault';
    if (status === 'warning' || power < 10) return 'warning';
    return 'normal';
  };

  const statusColor = getStatusColor(status, power);

  return (
    <div className={`panel-card ${statusColor}`}>
      <div className="panel-header">
        <h3 className="panel-id">{id}</h3>
        <div className={`status-indicator ${statusColor}`}></div>
      </div>
      
      <div className="panel-metrics">
        <div className="primary-metric">
          <span className="power-value">{power.toFixed(0)}</span>
          <span className="power-unit">W</span>
        </div>
        
        <div className="secondary-metrics">
          <div className="metric">
            <span className="metric-label">V:</span>
            <span className="metric-value">{voltage.toFixed(1)}V</span>
          </div>
          <div className="metric">
            <span className="metric-label">A:</span>
            <span className="metric-value">{current.toFixed(1)}A</span>
          </div>
        </div>
      </div>
      
      <div className="panel-footer">
        <span className="temperature">{temperature.toFixed(0)}°C</span>
      </div>
    </div>
  );
};

export default PanelCard;
