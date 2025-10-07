@echo off
echo 🎨 Visual Codex Gallery Server
echo ========================================
echo.

cd /d "C:\Users\millz\visual_codex"

echo 📁 Serving from: %CD%
echo.

echo 🚀 Starting Python HTTP Server...
echo 🌐 Gallery will open at: http://localhost:8080/gallery.html
echo.
echo ⏹️  Press Ctrl+C to stop the server
echo ========================================

python -m http.server 8080

pause