"""
Service for creating GitHub issues
"""
import logging
from typing import Optional
from github import Github
from github.GithubException import GithubException

from app.core.config import settings
from app.models.incident import DiagnosisResult

logger = logging.getLogger(__name__)

ISSUE_TEMPLATE = """
# Agent Failure Report

**Trace ID:** {trace_id}
**Timestamp:** {timestamp}
**Confidence Score:** {confidence_score:.2f}

## Diagnosis
{diagnosis}

## Root Cause Analysis
{root_cause}

## Error Category
`{error_category}`

## Suggested Fix
{suggested_fix}

## Links
- [View Full Trace in LangSmith]({langsmith_url})

---
*This issue was automatically created by AHA (Autonomous AI Healing Agent)*
"""

class GitHubService:
    """Service for GitHub API interactions"""
    
    def __init__(self):
        self.github = None
        self.repo = None
        
        try:
            if settings.github_token and settings.github_token != "ghp_your_actual_token_here":
                self.github = Github(settings.github_token)
                self.repo = self.github.get_repo(
                    f"{settings.github_repo_owner}/{settings.github_repo_name}"
                )
                logger.info("GitHub service initialized successfully")
            else:
                logger.warning("GitHub token not configured - issues will not be created")
        except Exception as e:
            logger.warning(f"GitHub service initialization failed: {e}")
    
    async def create_issue(
        self,
        title: str,
        trace_id: str,
        diagnosis_result: DiagnosisResult,
        langsmith_url: str
    ) -> Optional[str]:
        """
        Create a GitHub issue for the incident
        """
        if not self.repo:
            logger.warning("GitHub repository not configured - skipping issue creation")
            return None
            
        try:
            logger.info(f"Creating GitHub issue for trace: {trace_id}")
            
            # Format the issue body
            body = ISSUE_TEMPLATE.format(
                trace_id=trace_id,
                timestamp="Auto-generated",
                confidence_score=diagnosis_result.confidence_score,
                diagnosis=diagnosis_result.diagnosis,
                root_cause=diagnosis_result.root_cause,
                error_category=diagnosis_result.error_category,
                suggested_fix=diagnosis_result.suggested_fix,
                langsmith_url=langsmith_url
            )
            
            # Create the issue
            issue = self.repo.create_issue(
                title=title,
                body=body,
                labels=["aha-generated", "bug", diagnosis_result.error_category]
            )
            
            logger.info(f"Created GitHub issue: {issue.html_url}")
            return issue.html_url
            
        except GithubException as e:
            logger.error(f"GitHub API error: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error creating GitHub issue: {str(e)}")
            return None

# Global service instance
github_service = GitHubService()
