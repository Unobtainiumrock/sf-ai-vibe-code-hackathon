"""
FastAPI application entry point for AHA Backend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import webhooks, incidents
from app.core.config import settings

app = FastAPI(
    title="Autonomous AI Healing Agent (AHA)",
    description="Backend API for the AHA system",
    version="1.0.0",
)

# Add CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(webhooks.router, prefix="/webhook", tags=["webhooks"])
app.include_router(incidents.router, prefix="/api", tags=["incidents"])

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "AHA Backend is running",
        "version": "1.0.0",
        "debug_mode": settings.aha_debug_mode
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.aha_webhook_port,
        reload=settings.aha_debug_mode
    )
