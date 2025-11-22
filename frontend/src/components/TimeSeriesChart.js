import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TimeSeriesChart = ({ data, dataKey, color, yAxisLabel }) => {
  // Format data for the chart with time labels
  const chartData = data.map((item, index) => ({
    ...item,
    timeIndex: index,
    timeLabel: `${index}s ago`
  }));

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          border: `1px solid ${color}`,
          borderRadius: '8px',
          padding: '10px',
          color: 'white'
        }}>
          <p style={{ margin: 0, marginBottom: '5px' }}>
            <strong>{`${yAxisLabel}: ${payload[0].value?.toFixed(2)}`}</strong>
          </p>
          <p style={{ margin: 0, fontSize: '0.9em', opacity: 0.8 }}>
            {`Point ${data.currentIndex} of ${data.totalPoints}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Show message if no data
  if (!data || data.length === 0) {
    return (
      <div style={{
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.9rem'
      }}>
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis 
          dataKey="timeIndex"
          tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
          axisLine={{ stroke: 'rgba(255, 255, 255, 0.3)' }}
          tickLine={{ stroke: 'rgba(255, 255, 255, 0.3)' }}
          domain={['dataMin', 'dataMax']}
        />
        <YAxis 
          tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
          axisLine={{ stroke: 'rgba(255, 255, 255, 0.3)' }}
          tickLine={{ stroke: 'rgba(255, 255, 255, 0.3)' }}
          domain={['auto', 'auto']}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: color, stroke: 'white', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TimeSeriesChart;
