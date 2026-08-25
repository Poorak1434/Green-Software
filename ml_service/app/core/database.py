import asyncpg
from typing import Optional
from app.core.config import settings

class Database:
    def __init__(self):
        self.pool: Optional[asyncpg.Pool] = None

    async def connect_to_database(self):
        print("Connecting to PostgreSQL/TimescaleDB...")
        # Strip the +asyncpg part if it exists in the URL just in case, though asyncpg handles standard postgres urls
        url = settings.DATABASE_URL.replace("postgresql+asyncpg", "postgresql")
        self.pool = await asyncpg.create_pool(dsn=url)
        print("Connected to database.")

    async def close_database_connection(self):
        print("Closing database connection...")
        if self.pool:
            await self.pool.close()
        print("Database connection closed.")

db = Database()
