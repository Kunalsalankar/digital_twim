@echo off
echo 🚀 Solar Panel Digital Twin - Deployment Script
echo ===============================================

echo.
echo 📦 Building React frontend...
cd frontend
call npm run build
cd ..

echo.
echo 📁 Copying build files...
if not exist "public" mkdir public
xcopy /E /Y "frontend\build\*" "public\"

echo.
echo ✅ Deployment preparation complete!
echo.
echo 📋 Next steps:
echo 1. Upload all files to your hosting provider
echo 2. Set NODE_ENV=production environment variable
echo 3. Install dependencies: npm install --production
echo 4. Start server: npm start
echo.
pause
