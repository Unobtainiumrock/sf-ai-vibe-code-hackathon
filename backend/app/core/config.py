"""
Configuration management using Pydantic settings
"""
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # LangSmith Configuration
    langsmith_api_key: str
    langsmith_project: str = "aha-demo"
    langsmith_webhook_secret: Optional[str] = None
    
    # LLM Configuration
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    
    # GitHub Configuration
    github_token: str
    github_repo_owner: str
    github_repo_name: str = "aha-incidents"
    
    # AHA Configuration
    webhook_port: int = 8000
    frontend_port: int = 3000
    debug_mode: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = False

    def validate_llm_config(self) -> bool:
        """Ensure at least one LLM provider is configured"""
        return bool(self.openai_api_key or self.anthropic_api_key)

# Global settings instance
settings = Settings()
