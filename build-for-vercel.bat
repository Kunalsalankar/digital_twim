@echo off
echo 🚀 Building Solar Panel Twin for Vercel
echo ========================================

echo.
echo 📦 Installing root dependencies...
call npm install

echo.
echo 📦 Installing frontend dependencies...
cd frontend
call npm install

echo.
echo 🏗️ Building React frontend...
call npm run build
cd ..

echo.
echo ✅ Build complete! Ready for Vercel deployment.
echo.
echo 📋 Next steps:
echo 1. Run: vercel --prod
echo 2. Choose your project settings
echo 3. Your app will be live!
echo.
pause
