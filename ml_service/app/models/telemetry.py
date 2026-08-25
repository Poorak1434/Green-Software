from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

class SensorReadingBase(BaseModel):
    device_id: str = Field(..., description="UUID of the IoT device")
    value: float = Field(..., description="Sensor reading numerical value")
    unit: str = Field(..., description="Unit of measurement (e.g., liters, kWh)")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional context info")

class SensorReadingCreate(SensorReadingBase):
    ts: Optional[datetime] = Field(default_factory=datetime.utcnow, description="Timestamp of the reading")

class TelemetryBatchIngest(BaseModel):
    readings: List[SensorReadingCreate]
