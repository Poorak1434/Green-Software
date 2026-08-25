import asyncio
import os
from pydantic_settings import BaseSettings, SettingsConfigDict
import asyncpg

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

async def init_db():
    dsn = settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
    
    print(f"Connecting to database to execute schema...")
    try:
        # Connect to Supabase
        conn = await asyncpg.connect(dsn)
        print("✅ Connected!")
        
        # Read the schema file
        with open("schema.sql", "r") as f:
            sql = f.read()
            
        print("🔨 Executing schema creation script...")
        await conn.execute(sql)
        print("🎉 Database successfully initialized with GreenSoftware tables!")
        
        # Verify tables creation
        tables = await conn.fetch('''
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public'
        ''')
        
        print("\nCreated Tables in 'public' schema:")
        for table in tables:
            print(f"- {table['tablename']}")
            
        await conn.close()
        
    except Exception as e:
        print(f"\n❌ Error initializing database: {e}")

if __name__ == "__main__":
    asyncio.run(init_db())
