"""
Service for LLM-powered diagnosis of agent failures
"""
import logging
from typing import Dict, Any
import openai
import anthropic

from app.core.config import settings
from app.models.incident import DiagnosisResult

logger = logging.getLogger(__name__)

DIAGNOSIS_PROMPT = """
You are an expert AI system diagnostician specializing in multi-agent system failures. 
Analyze the following execution trace and provide a detailed diagnosis.

TRACE DATA:
{trace_data}

Please provide your analysis in the following format:

DIAGNOSIS: [Brief summary of what went wrong]
CONFIDENCE: [0.0-1.0 confidence score]
ROOT CAUSE: [Detailed explanation of the underlying issue]
ERROR CATEGORY: [Classification: parsing_error, api_failure, timeout, logic_error, etc.]
SUGGESTED FIX: [Specific actionable fix]

Focus on:
1. Agent interaction patterns
2. Data flow issues
3. API call failures
4. Parsing/validation errors
5. Timeout or performance issues

Be specific and actionable in your recommendations.
"""

class DiagnosisService:
    """Service for analyzing traces with LLM"""
    
    def __init__(self):
        self.openai_client = None
        self.anthropic_client = None
        
        if settings.openai_api_key:
            self.openai_client = openai.AsyncOpenAI(api_key=settings.openai_api_key)
        
        if settings.anthropic_api_key:
            self.anthropic_client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
    
    async def analyze_trace(self, trace_data: Dict[str, Any]) -> DiagnosisResult:
        """
        Analyze trace data using LLM and return structured diagnosis
        """
        try:
            logger.info(f"Analyzing trace: {trace_data.get('trace_id', 'unknown')}")
            
            # Format trace data for analysis
            formatted_trace = self._format_trace_for_analysis(trace_data)
            prompt = DIAGNOSIS_PROMPT.format(trace_data=formatted_trace)
            
            # Try OpenAI first, then Anthropic
            response = None
            if self.openai_client:
                response = await self._analyze_with_openai(prompt)
            elif self.anthropic_client:
                response = await self._analyze_with_anthropic(prompt)
            else:
                raise ValueError("No LLM provider configured")
            
            # Parse the response into structured format
            diagnosis_result = self._parse_diagnosis_response(response)
            
            logger.info(f"Analysis complete with confidence: {diagnosis_result.confidence_score}")
            return diagnosis_result
            
        except Exception as e:
            logger.error(f"Error analyzing trace: {str(e)}")
            # Return fallback diagnosis
            return DiagnosisResult(
                diagnosis="Failed to analyze trace - see raw error data",
                confidence_score=0.1,
                suggested_fix="Manual investigation required",
                error_category="analysis_failure",
                root_cause=f"LLM analysis failed: {str(e)}"
            )
    
    async def _analyze_with_openai(self, prompt: str) -> str:
        """Analyze with OpenAI GPT-4"""
        response = await self.openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=1000
        )
        return response.choices[0].message.content
    
    async def _analyze_with_anthropic(self, prompt: str) -> str:
        """Analyze with Anthropic Claude"""
        response = await self.anthropic_client.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=1000,
            temperature=0.1,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content[0].text
    
    def _format_trace_for_analysis(self, trace_data: Dict[str, Any]) -> str:
        """Format trace data for LLM analysis"""
        formatted = f"Trace ID: {trace_data.get('trace_id', 'unknown')}\n\n"
        
        for i, run in enumerate(trace_data.get('runs', [])):
            formatted += f"=== RUN {i+1}: {run.get('name', 'Unknown')} ===\n"
            formatted += f"Type: {run.get('run_type', 'unknown')}\n"
            formatted += f"Inputs: {run.get('inputs', {})}\n"
            formatted += f"Outputs: {run.get('outputs', {})}\n"
            
            if run.get('error'):
                formatted += f"ERROR: {run['error']}\n"
            
            formatted += f"Duration: {run.get('start_time', '')} to {run.get('end_time', '')}\n\n"
        
        return formatted
    
    def _parse_diagnosis_response(self, response: str) -> DiagnosisResult:
        """Parse LLM response into structured diagnosis"""
        lines = response.strip().split('\n')
        
        diagnosis = ""
        confidence_score = 0.5
        root_cause = ""
        error_category = "unknown"
        suggested_fix = ""
        
        for line in lines:
            line = line.strip()
            if line.startswith("DIAGNOSIS:"):
                diagnosis = line.replace("DIAGNOSIS:", "").strip()
            elif line.startswith("CONFIDENCE:"):
                try:
                    confidence_score = float(line.replace("CONFIDENCE:", "").strip())
                except ValueError:
                    confidence_score = 0.5
            elif line.startswith("ROOT CAUSE:"):
                root_cause = line.replace("ROOT CAUSE:", "").strip()
            elif line.startswith("ERROR CATEGORY:"):
                error_category = line.replace("ERROR CATEGORY:", "").strip()
            elif line.startswith("SUGGESTED FIX:"):
                suggested_fix = line.replace("SUGGESTED FIX:", "").strip()
        
        return DiagnosisResult(
            diagnosis=diagnosis or "Analysis completed",
            confidence_score=max(0.0, min(1.0, confidence_score)),
            suggested_fix=suggested_fix or "No specific fix suggested",
            error_category=error_category or "unknown",
            root_cause=root_cause or "Root cause analysis incomplete"
        )

# Global service instance
diagnosis_service = DiagnosisService()
