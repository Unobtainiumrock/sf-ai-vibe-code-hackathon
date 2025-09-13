"""
Webhook endpoints for receiving notifications from LangSmith
"""
from fastapi import APIRouter, HTTPException, BackgroundTasks
import logging

from app.models.incident import LangSmithWebhookPayload
from app.services.langsmith_service import langsmith_service
from app.services.diagnosis_service import diagnosis_service
from app.services.github_service import github_service
from app.storage.memory_store import memory_store

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/langsmith")
async def langsmith_webhook(
    payload: LangSmithWebhookPayload,
    background_tasks: BackgroundTasks
):
    """
    Receive webhook notifications from LangSmith when errors occur
    """
    logger.info(f"Received LangSmith webhook for trace: {payload.trace_id}")
    
    # Only process error events
    if payload.status != "error" or not payload.error:
        return {"status": "ignored", "reason": "not an error event"}
    
    # Add background task to process the incident
    background_tasks.add_task(
        process_incident,
        payload.trace_id,
        payload.error.get("type", "unknown"),
        payload.error.get("message", "No error message provided")
    )
    
    return {"status": "accepted", "trace_id": payload.trace_id}

async def process_incident(trace_id: str, error_type: str, error_message: str):
    """
    Background task to process an incident
    """
    try:
        logger.info(f"Processing incident for trace: {trace_id}")
        
        # 1. Create incident record
        langsmith_url = f"https://smith.langchain.com/trace/{trace_id}"
        incident = memory_store.create_incident(
            trace_id=trace_id,
            error_type=error_type,
            error_message=error_message,
            langsmith_trace_url=langsmith_url
        )
        
        # 2. Fetch full trace data from LangSmith
        trace_data = await langsmith_service.get_trace(trace_id)
        if not trace_data:
            logger.error(f"Failed to fetch trace data for {trace_id}")
            return
        
        # 3. Analyze with LLM
        diagnosis_result = await diagnosis_service.analyze_trace(trace_data)
        
        # 4. Create GitHub issue
        github_url = await github_service.create_issue(
            title=f"Agent Failure: {error_type}",
            trace_id=trace_id,
            diagnosis_result=diagnosis_result,
            langsmith_url=langsmith_url
        )
        
        # 5. Update incident with results
        memory_store.update_incident(
            incident.id,
            diagnosis=diagnosis_result.diagnosis,
            confidence_score=diagnosis_result.confidence_score,
            github_issue_url=github_url,
            status="analyzed"
        )
        
        logger.info(f"Successfully processed incident {incident.id}")
        
    except Exception as e:
        logger.error(f"Error processing incident for trace {trace_id}: {str(e)}")
