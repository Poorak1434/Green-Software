from fastapi import APIRouter, HTTPException, Depends
from app.models.telemetry import TelemetryBatchIngest
from app.core.database import db
import json

router = APIRouter()

@router.post("/ingest")
async def ingest_telemetry(payload: TelemetryBatchIngest):
    """
    High-velocity ingestion endpoint.
    Takes a batch of telemetry sensor readings and inserts them into TimescaleDB.
    """
    if not db.pool:
        raise HTTPException(status_code=500, detail="Database connection not initialized")
    
    query = """
    INSERT INTO sensor_readings (ts, device_id, value, unit, metadata)
    VALUES ($1, $2, $3, $4, $5)
    """
    
    # Prepare batch execution
    records = [
        (
            reading.ts,
            reading.device_id,
            reading.value,
            reading.unit,
            json.dumps(reading.metadata) if reading.metadata else None
        )
        for reading in payload.readings
    ]
    
    try:
        async with db.pool.acquire() as connection:
            await connection.executemany(query, records)
        return {"status": "success", "inserted_records": len(records)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database insert failed: {str(e)}")
