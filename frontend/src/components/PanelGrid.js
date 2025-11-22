import React from 'react';
import PanelCard from './PanelCard';
import './PanelGrid.css';

const PanelGrid = ({ panels, metrics }) => {
  if (!panels || panels.length === 0) {
    return (
      <div className="panel-grid-loading">
        <div className="loading-spinner"></div>
        <p>Loading solar panels...</p>
      </div>
    );
  }

  return (
    <div className="panel-grid-container">
      <div className="panel-grid-header">
        <h2>🌞 Solar Panels</h2>
        <div className="panel-summary">
          <div className="summary-item">
            <span className="summary-label">Total:</span>
            <span className="summary-value">{metrics?.panelCount?.total || 0}</span>
          </div>
          <div className="summary-item normal">
            <span className="summary-label">Normal:</span>
            <span className="summary-value">{metrics?.panelCount?.normal || 0}</span>
          </div>
          <div className="summary-item warning">
            <span className="summary-label">Warning:</span>
            <span className="summary-value">{metrics?.panelCount?.warning || 0}</span>
          </div>
          <div className="summary-item fault">
            <span className="summary-label">Fault:</span>
            <span className="summary-value">{metrics?.panelCount?.fault || 0}</span>
          </div>
        </div>
      </div>
      
      <div className="panel-grid">
        {panels.map(panel => (
          <PanelCard 
            key={panel.id} 
            panel={panel}
          />
        ))}
      </div>
    </div>
  );
};

export default PanelGrid;
