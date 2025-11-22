# 🌞 Solar Panel Digital Twin

A real-time digital twin dashboard for solar panel monitoring using React frontend and Node.js backend with Server-Sent Events (SSE) for live data streaming.

## 📋 Features

- **Real-time Data Streaming**: Server-Sent Events (SSE) for live data updates every second
- **Modern Dashboard UI**: Clean, responsive design with glassmorphism effects
- **Time-Series Charts**: Interactive charts showing historical data trends
- **Simulation Controls**: Start/stop simulation with progress tracking
- **Data Cards**: Large, easy-to-read current value displays
- **CSV Data Source**: Reads solar panel data from CSV file named "finall.csv"
- **Loop Playback**: Automatically loops through data when reaching the end

## 🏗️ Project Structure

```
digital_twim/
├── server.js              # Node.js backend server
├── package.json           # Backend dependencies
├── finall.csv             # Place your CSV file here (exact name required)
├── frontend/
│   ├── package.json       # Frontend dependencies
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js         # Main React component
│       ├── App.css        # Main styles
│       ├── index.js       # React entry point
│       ├── index.css      # Global styles
│       └── components/
│           ├── Dashboard.js          # Main dashboard component
│           ├── Dashboard.css
│           ├── DataCard.js           # Individual metric cards
│           ├── DataCard.css
│           ├── TimeSeriesChart.js    # Chart component
│           ├── SimulationControls.js # Control panel
│           └── SimulationControls.css
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- CSV file with solar panel data named "finall.csv"

### 1. Setup Backend

```bash
# Navigate to project directory
cd digital_twim

# Install backend dependencies
npm install

# Place your CSV file named "finall.csv" in the project root directory
# File should have columns: timestamp, ActivePowerL3, CurrentL3, VoltageL3, IRRADIATION, temp

# Start the backend server
npm start
```

The backend server will start on `http://localhost:3001`

### 2. Setup Frontend

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start the React development server
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## 📊 CSV Data Format

Your CSV file named "finall.csv" should contain the following columns (exact names):

| Column Name   | Description                    | Unit  |
|---------------|--------------------------------|-------|
| timestamp     | ISO timestamp string           | -     |
| ActivePowerL3 | Active power measurement       | W     |
| CurrentL3     | Current measurement            | A     |
| VoltageL3     | Voltage measurement            | V     |
| IRRADIATION   | Solar irradiation level        | W/m²  |
| temp          | Temperature measurement        | °C    |

### Example CSV Data:
```
timestamp,ActivePowerL3,CurrentL3,VoltageL3,IRRADIATION,temp
2025-11-21T05:37:45.062Z,61.848423,0.501674,213.533,0,24
2025-11-21T05:37:50.063Z,61.755332,0.500325,213.655,0,24.06
```

## 🎮 How to Use

1. **Place CSV File**: Put your solar panel data CSV file named "finall.csv" in the project root directory
2. **Start Backend**: Run `npm start` in the root directory
3. **Start Frontend**: Run `npm start` in the `frontend` directory
4. **Open Dashboard**: Navigate to `http://localhost:3000`
5. **Start Simulation**: Click the "Start Simulation" button to begin streaming data
6. **Monitor Data**: Watch real-time updates on the dashboard
7. **Stop Simulation**: Click "Stop Simulation" to pause data streaming

## 🔧 API Endpoints

### Backend API (Port 3001)

- `GET /api/solar/stream` - Server-Sent Events stream for real-time data
- `POST /api/solar/start` - Start the simulation
- `POST /api/solar/stop` - Stop the simulation  
- `GET /api/solar/status` - Get current simulation status
- `GET /api/solar/sample` - Get sample data (first 5 points)
- `GET /api/health` - Health check endpoint

## 🎨 Dashboard Components

### Data Cards
- **Active Power**: Current power generation in Watts
- **Current**: Electrical current in Amperes  
- **Voltage**: Electrical voltage in Volts
- **Irradiation**: Solar irradiation in W/m²
- **Temperature**: Panel temperature in Celsius

### Time-Series Charts
- **Active Power Chart**: Power generation over time
- **Voltage Chart**: Voltage levels over time
- **Current Chart**: Current flow over time
- **Temperature Chart**: Temperature variations over time

### Simulation Controls
- Start/Stop buttons for simulation control
- Progress bar showing current position in dataset
- Status indicators and information cards

## 🔄 Data Flow

1. **Server Startup**: Backend reads Excel file and loads data into memory
2. **Client Connection**: Frontend connects to SSE stream endpoint
3. **Simulation Start**: User clicks start, server begins streaming data every second
4. **Real-time Updates**: Frontend receives data and updates dashboard
5. **Data Loop**: When reaching end of dataset, server loops back to beginning
6. **Charts Update**: Time-series charts maintain last 60 data points

## 🛠️ Customization

### Modify Update Interval
Change the interval in `server.js`:
```javascript
// Change from 1000ms (1 second) to desired interval
simulationInterval = setInterval(() => {
    // ... streaming logic
}, 2000); // 2 seconds
```

### Add New Metrics
1. Add column to Excel file
2. Update data parsing in `server.js`
3. Add new DataCard in `Dashboard.js`
4. Create new chart if needed

### Styling
- Modify CSS files in `frontend/src/components/`
- Change colors by updating CSS custom properties
- Adjust glassmorphism effects in component stylesheets

## 🐛 Troubleshooting

### Backend Issues
- **"No Excel file found"**: Place Excel file in project root directory
- **Port 3001 in use**: Change PORT in server.js or kill existing process
- **Data parsing errors**: Check Excel column names match exactly

### Frontend Issues  
- **Connection failed**: Ensure backend is running on port 3001
- **Charts not showing**: Check if data is being received in browser console
- **Styling issues**: Clear browser cache and restart development server

### Common Solutions
```bash
# Kill process on port 3001
npx kill-port 3001

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📝 Development Notes

- Backend uses Express.js with CORS enabled for cross-origin requests
- Frontend uses React functional components with hooks
- Charts implemented with Recharts library
- Real-time communication via Server-Sent Events (SSE)
- Data automatically loops when reaching end of dataset
- Responsive design works on desktop, tablet, and mobile devices

## 🚀 Production Deployment

For production deployment:

1. Build the React app: `cd frontend && npm run build`
2. Serve static files from Express server
3. Use environment variables for configuration
4. Add proper error handling and logging
5. Implement authentication if needed
6. Use a process manager like PM2 for the backend

## 📄 License

MIT License - feel free to use this project for your solar panel monitoring needs!
