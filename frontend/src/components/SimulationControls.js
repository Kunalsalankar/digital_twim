import React from 'react';
import './SimulationControls.css';

const SimulationControls = ({ simulationStatus, onStart, onStop }) => {
  const { isRunning, currentIndex, totalDataPoints } = simulationStatus;

  const progressPercentage = totalDataPoints > 0 
    ? ((currentIndex / totalDataPoints) * 100).toFixed(1)
    : 0;

  return (
    <div className="simulation-controls">
      <div className="controls-header">
        <h2>🎮 Simulation Controls</h2>
        <div className="simulation-status">
          <span className={`status-badge ${isRunning ? 'running' : 'stopped'}`}>
            {isRunning ? '▶️ Running' : '⏹️ Stopped'}
          </span>
        </div>
      </div>

      <div className="controls-content">
        <div className="control-buttons">
          <button 
            className="control-btn start-btn"
            onClick={onStart}
            disabled={isRunning}
          >
            <span className="btn-icon">▶️</span>
            Start Simulation
          </button>
          
          <button 
            className="control-btn stop-btn"
            onClick={onStop}
            disabled={!isRunning}
          >
            <span className="btn-icon">⏹️</span>
            Stop Simulation
          </button>
        </div>

        <div className="progress-section">
          <div className="progress-info">
            <div className="progress-text">
              <span className="progress-label">Progress:</span>
              <span className="progress-value">
                {currentIndex} / {totalDataPoints} ({progressPercentage}%)
              </span>
            </div>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="info-cards">
          <div className="info-card">
            <div className="info-icon">📊</div>
            <div className="info-content">
              <div className="info-label">Total Data Points</div>
              <div className="info-value">{totalDataPoints.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="info-card">
            <div className="info-icon">⏱️</div>
            <div className="info-content">
              <div className="info-label">Update Interval</div>
              <div className="info-value">1 second</div>
            </div>
          </div>
          
          <div className="info-card">
            <div className="info-icon">🔄</div>
            <div className="info-content">
              <div className="info-label">Loop Mode</div>
              <div className="info-value">Enabled</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationControls;
