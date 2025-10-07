#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
import sys
import threading
import time

PORT = 8080

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers to allow iframe access
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Suppress most log messages except important ones
        if "GET /gallery.html" in str(args):
            print(f"📱 Gallery loaded: {args[0]}")
        elif "404" in str(args):
            print(f"❌ File not found: {args[0]}")

def start_server():
    # Change to the visual_codex directory
    visual_codex_dir = "/mnt/c/Users/millz/visual_codex"
    if os.path.exists(visual_codex_dir):
        os.chdir(visual_codex_dir)
        print(f"📁 Serving from: {visual_codex_dir}")
    else:
        print(f"❌ Directory not found: {visual_codex_dir}")
        sys.exit(1)
    
    # Try to start server
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            print(f"🚀 Visual Codex Gallery Server starting...")
            print(f"🌐 Server running at: http://localhost:{PORT}")
            print(f"🎨 Gallery URL: http://localhost:{PORT}/gallery.html")
            print(f"📊 Standalone Gallery: http://localhost:{PORT}/gallery-standalone.html")
            print(f"⚡ All effects will load properly through the server!")
            print()
            print("⏹️  Press Ctrl+C to stop the server")
            print("=" * 60)
            
            # Open browser after a brief delay
            def open_browser():
                time.sleep(2)
                try:
                    webbrowser.open(f'http://localhost:{PORT}/gallery.html')
                    print("🌐 Opening gallery in browser...")
                except:
                    print("💡 Manually open: http://localhost:8080/gallery.html")
            
            browser_thread = threading.Thread(target=open_browser)
            browser_thread.daemon = True
            browser_thread.start()
            
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"❌ Port {PORT} is already in use!")
            print(f"💡 Try: lsof -ti:{PORT} | xargs kill")
            print(f"💡 Or manually open: http://localhost:{PORT}/gallery.html")
        else:
            print(f"❌ Server error: {e}")

if __name__ == "__main__":
    print("🎨 Visual Codex Gallery Server")
    print("=" * 40)
    start_server()