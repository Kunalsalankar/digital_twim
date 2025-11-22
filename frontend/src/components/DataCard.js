import React from 'react';
import './DataCard.css';

const DataCard = ({ title, value, unit, icon, color }) => {
  // Format the value to show appropriate decimal places
  const formatValue = (val) => {
    if (val === null || val === undefined) return '--';
    if (typeof val === 'number') {
      return val.toFixed(2);
    }
    return val;
  };

  return (
    <div className="data-card" style={{ '--accent-color': color }}>
      <div className="data-card-header">
        <span className="data-card-icon">{icon}</span>
        <h3 className="data-card-title">{title}</h3>
      </div>
      
      <div className="data-card-content">
        <div className="data-card-value">
          {formatValue(value)}
        </div>
        <div className="data-card-unit">
          {unit}
        </div>
      </div>
      
      <div className="data-card-indicator">
        <div className="indicator-bar"></div>
      </div>
    </div>
  );
};

export default DataCard;
