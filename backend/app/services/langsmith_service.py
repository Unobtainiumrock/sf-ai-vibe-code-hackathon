"""
Service for interacting with LangSmith API
"""
import logging
from typing import Optional, Dict, Any
from langsmith import Client

from app.core.config import settings

logger = logging.getLogger(__name__)

class LangSmithService:
    """Service for LangSmith API interactions"""
    
    def __init__(self):
        self.client = Client(api_key=settings.langsmith_api_key)
    
    async def get_trace(self, trace_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetch full trace data from LangSmith
        """
        try:
            logger.info(f"Fetching trace data for: {trace_id}")
            
            # Get the run data from LangSmith
            runs = list(self.client.list_runs(trace_id=trace_id))
            
            if not runs:
                logger.warning(f"No runs found for trace: {trace_id}")
                return None
            
            # Structure the trace data for analysis
            trace_data = {
                "trace_id": trace_id,
                "runs": []
            }
            
            for run in runs:
                run_data = {
                    "id": str(run.id),
                    "name": run.name,
                    "run_type": run.run_type,
                    "inputs": run.inputs,
                    "outputs": run.outputs,
                    "error": run.error,
                    "start_time": run.start_time.isoformat() if run.start_time else None,
                    "end_time": run.end_time.isoformat() if run.end_time else None,
                    "parent_run_id": str(run.parent_run_id) if run.parent_run_id else None
                }
                trace_data["runs"].append(run_data)
            
            logger.info(f"Successfully fetched trace data with {len(runs)} runs")
            return trace_data
            
        except Exception as e:
            logger.error(f"Error fetching trace {trace_id}: {str(e)}")
            return None

# Global service instance
langsmith_service = LangSmithService()
