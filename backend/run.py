import uvicorn
import os
import sys

# Ensure current directory is on the python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "127.0.0.1")
    print(f"🏛️ Starting HeritageAI Backend Server on http://{host}:{port}...")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
