import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def main():
    try:
        url = os.getenv("DATABASE_URL").replace("postgresql+asyncpg", "postgresql")
        conn = await asyncpg.connect(url)
        print("Successfully connected!")
        await conn.close()
    except Exception as e:
        print(f"Error: {repr(e)}")

asyncio.run(main())
