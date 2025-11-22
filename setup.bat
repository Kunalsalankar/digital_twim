@echo off
echo 🌞 Solar Panel Digital Twin Setup
echo ================================

echo.
echo 📦 Installing backend dependencies...
call npm install

echo.
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo ✅ Setup complete!
echo.
echo 📋 Next steps:
echo 1. Place your CSV file named "finall.csv" in this directory
echo 2. Run 'npm start' to start the backend server
echo 3. In a new terminal, run 'cd frontend && npm start' to start the frontend
echo 4. Open http://localhost:3000 in your browser
echo.
echo 💡 Your CSV file should have columns: timestamp, ActivePowerL3, CurrentL3, VoltageL3, IRRADIATION, temp
echo.
pause
