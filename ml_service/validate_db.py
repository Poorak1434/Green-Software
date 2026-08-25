import asyncio
import os
from pydantic_settings import BaseSettings, SettingsConfigDict
import asyncpg

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/postgres")
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

async def verify_connection():
    # Remove the +asyncpg part from the SQLAlchemy URL to use directly with asyncpg
    dsn = settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
    
    print(f"Attempting to connect using DSN prefix: {dsn.split('@')[1][:15]}...")
    
    if "[YOUR-PASSWORD]" in dsn:
        print("\n❌ Error: Please replace [YOUR-PASSWORD] in the .env file with your actual Supabase password!")
        return

    try:
        # Attempt connection
        conn = await asyncpg.connect(dsn)
        print("\n✅ Successfully connected to Supabase PostgreSQL!")
        
        # Test a simple query to ensure full access
        version = await conn.fetchval('SELECT version();')
        print(f"📊 PostgreSQL Version: {version.split(' ')[1]}")
        
        await conn.close()
        
    except asyncpg.exceptions.InvalidPasswordError:
        print("\n❌ Error: Invalid password. Please check your password in the .env file.")
    except Exception as e:
        print(f"\n❌ Connection failed: {e}")
        print("This might be due to IPv4 restrictions. Try testing the Option 2: Session Pooler connection string in your .env file.")

if __name__ == "__main__":
    asyncio.run(verify_connection())
