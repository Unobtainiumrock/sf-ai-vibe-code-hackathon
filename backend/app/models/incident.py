"""
Pydantic models for incident data
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class IncidentCreate(BaseModel):
    """Model for creating a new incident"""
    trace_id: str
    error_type: str
    error_message: str
    trace_data: Dict[str, Any]

class IncidentResponse(BaseModel):
    """Model for incident API responses"""
    id: str
    trace_id: str
    error_type: str
    error_message: str
    diagnosis: Optional[str] = None
    confidence_score: Optional[float] = None
    github_issue_url: Optional[str] = None
    langsmith_trace_url: Optional[str] = None
    created_at: datetime
    status: str = "detected"  # detected, analyzed, resolved

class LangSmithWebhookPayload(BaseModel):
    """Model for LangSmith webhook payload"""
    trace_id: str
    run_id: str
    project_name: str
    status: str
    error: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None

class DiagnosisResult(BaseModel):
    """Model for LLM diagnosis results"""
    diagnosis: str
    confidence_score: float
    suggested_fix: str
    error_category: str
    root_cause: str
