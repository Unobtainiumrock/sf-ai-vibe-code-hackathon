"""
Simple in-memory storage for demo purposes
"""
from typing import Dict, List, Optional
from datetime import datetime
import uuid

from app.models.incident import IncidentResponse

class MemoryStore:
    """In-memory incident storage"""
    
    def __init__(self):
        self._incidents: Dict[str, IncidentResponse] = {}
    
    def create_incident(
        self, 
        trace_id: str, 
        error_type: str, 
        error_message: str,
        langsmith_trace_url: Optional[str] = None
    ) -> IncidentResponse:
        """Create a new incident"""
        incident_id = str(uuid.uuid4())
        incident = IncidentResponse(
            id=incident_id,
            trace_id=trace_id,
            error_type=error_type,
            error_message=error_message,
            langsmith_trace_url=langsmith_trace_url,
            created_at=datetime.utcnow(),
            status="detected"
        )
        self._incidents[incident_id] = incident
        return incident
    
    def update_incident(
        self, 
        incident_id: str, 
        diagnosis: Optional[str] = None,
        confidence_score: Optional[float] = None,
        github_issue_url: Optional[str] = None,
        status: Optional[str] = None
    ) -> Optional[IncidentResponse]:
        """Update an existing incident"""
        if incident_id not in self._incidents:
            return None
        
        incident = self._incidents[incident_id]
        if diagnosis is not None:
            incident.diagnosis = diagnosis
        if confidence_score is not None:
            incident.confidence_score = confidence_score
        if github_issue_url is not None:
            incident.github_issue_url = github_issue_url
        if status is not None:
            incident.status = status
        
        return incident
    
    def get_incident(self, incident_id: str) -> Optional[IncidentResponse]:
        """Get an incident by ID"""
        return self._incidents.get(incident_id)
    
    def get_all_incidents(self) -> List[IncidentResponse]:
        """Get all incidents, sorted by creation time (newest first)"""
        return sorted(
            self._incidents.values(), 
            key=lambda x: x.created_at, 
            reverse=True
        )
    
    def clear_all(self) -> None:
        """Clear all incidents (for demo reset)"""
        self._incidents.clear()

# Global memory store instance
memory_store = MemoryStore()
