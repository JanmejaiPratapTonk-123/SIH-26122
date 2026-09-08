"""
Plan2Progress Backend — Application Settings.

Loads configuration from environment variables via pydantic-settings.
"""

from pathlib import Path
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application-wide settings loaded from .env / environment."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # --- Database ---
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/postgres"
    database_url_sync: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/postgres"

    # --- JWT Auth ---
    secret_key: str = "CHANGE-ME-IN-PRODUCTION"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440  # 24 hours

    # --- CORS ---
    frontend_url: str = "http://localhost:5173"

    # --- File Uploads ---
    upload_dir: str = "./uploads"
    max_upload_size_mb: int = 50

    # --- App ---
    app_name: str = "Plan2Progress"
    app_env: str = "development"
    debug: bool = True

    @property
    def environment(self) -> str:
        return self.app_env

    @property
    def cors_origins(self) -> list[str]:
        return [self.frontend_url, "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]

    @property
    def max_upload_size_bytes(self) -> int:
        return self.max_upload_size_mb * 1024 * 1024

    @property
    def upload_path(self) -> Path:
        p = Path(self.upload_dir)
        p.mkdir(parents=True, exist_ok=True)
        return p


@lru_cache()
def get_settings() -> Settings:
    """Cached singleton for settings."""
    return Settings()
