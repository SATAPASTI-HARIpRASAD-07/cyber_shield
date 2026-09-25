import sys
import os

# Ensure parent directory is in Python path for server module imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from server import app

# Vercel WSGI entrypoint
app = app
