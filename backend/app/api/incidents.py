"""
API endpoints for incident management
"""
from fastapi import APIRouter, HTTPException
from typing import List

from app.models.incident import IncidentResponse
from app.storage.memory_store import memory_store

router = APIRouter()

@router.get("/incidents", response_model=List[IncidentResponse])
async def get_incidents():
    """
    Get all incidents for the dashboard
    """
    incidents = memory_store.get_all_incidents()
    return incidents

@router.get("/incidents/{incident_id}", response_model=IncidentResponse)
async def get_incident(incident_id: str):
    """
    Get a specific incident by ID
    """
    incident = memory_store.get_incident(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident

@router.delete("/incidents")
async def clear_incidents():
    """
    Clear all incidents (for demo purposes)
    """
    memory_store.clear_all()
    return {"message": "All incidents cleared"}

@router.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    incident_count = len(memory_store.get_all_incidents())
    return {
        "status": "healthy",
        "incident_count": incident_count
    }
