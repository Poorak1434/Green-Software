from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
import uuid

router = APIRouter()

# In-memory store for registered smart devices & IoT telemetry nodes
REGISTERED_SMART_DEVICES: Dict[str, Dict[str, Any]] = {
    "dev-meter-01": {
        "id": "dev-meter-01",
        "name": "Main Home Energy Meter",
        "device_type": "SMART_METER",
        "protocol": "HTTP_WEBHOOK",
        "ip_address": "192.168.1.120",
        "mac_address": "AA:BB:CC:11:22:33",
        "status": "online",
        "last_ping": datetime.now(timezone.utc).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "latest_reading": {"value": 4.25, "unit": "kW", "voltage": 230.2, "current_a": 18.5}
    },
    "dev-tank-01": {
        "id": "dev-tank-01",
        "name": "Ultrasonic Water Tank Sensor",
        "device_type": "WATER_SENSOR",
        "protocol": "LOCAL_WIFI",
        "ip_address": "192.168.1.145",
        "mac_address": "AA:BB:CC:44:55:66",
        "status": "online",
        "last_ping": datetime.now(timezone.utc).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "latest_reading": {"value": 82.5, "unit": "%", "level_liters": 825}
    },
    "dev-relay-01": {
        "id": "dev-relay-01",
        "name": "Main Water Pump Relay",
        "device_type": "ACTUATOR",
        "protocol": "MQTT",
        "ip_address": "192.168.1.160",
        "mac_address": "AA:BB:CC:77:88:99",
        "status": "offline",
        "last_ping": datetime.now(timezone.utc).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "latest_reading": {"state": "OFF", "power_w": 0}
    }
}


class SmartDeviceRegisterPayload(BaseModel):
    name: str = Field(..., example="Living Room Smart Energy Plug")
    device_type: str = Field(..., example="SMART_PLUG") # SMART_METER, WATER_SENSOR, ACTUATOR, SOLAR_INVERTER, CLIMATE
    protocol: str = Field(default="HTTP_WEBHOOK", example="HTTP_WEBHOOK")
    ip_address: Optional[str] = Field(default="192.168.1.X")
    mac_address: Optional[str] = Field(default="00:00:00:00:00:00")
    metadata: Optional[Dict[str, Any]] = None


class TelemetryIngestPayload(BaseModel):
    device_id: str
    metric_name: str = Field(default="power_usage")
    value: float
    unit: str = Field(default="W")
    metadata: Optional[Dict[str, Any]] = None


@router.get("/list")
async def list_smart_devices():
    """Get all connected smart devices."""
    return list(REGISTERED_SMART_DEVICES.values())


@router.post("/register")
async def register_smart_device(payload: SmartDeviceRegisterPayload):
    """Register a new Wi-Fi or IoT Smart Device."""
    device_id = f"dev-{uuid.uuid4().hex[:8]}"
    device_data = {
        "id": device_id,
        "name": payload.name,
        "device_type": payload.device_type,
        "protocol": payload.protocol,
        "ip_address": payload.ip_address or "192.168.1.X",
        "mac_address": payload.mac_address or "00:00:00:00:00:00",
        "status": "online",
        "last_ping": datetime.now(timezone.utc).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "metadata": payload.metadata or {},
        "latest_reading": {"value": 0.0, "unit": "W"}
    }
    REGISTERED_SMART_DEVICES[device_id] = device_data
    return {"status": "success", "message": "Smart Device Registered Successfully", "device": device_data}


@router.post("/telemetry")
async def ingest_device_telemetry(payload: TelemetryIngestPayload):
    """Ingest time-series telemetry reading from any smart device via webhook or REST."""
    device_id = payload.device_id
    now_str = datetime.now(timezone.utc).isoformat()

    if device_id in REGISTERED_SMART_DEVICES:
        REGISTERED_SMART_DEVICES[device_id]["status"] = "online"
        REGISTERED_SMART_DEVICES[device_id]["last_ping"] = now_str
        REGISTERED_SMART_DEVICES[device_id]["latest_reading"] = {
            "metric": payload.metric_name,
            "value": payload.value,
            "unit": payload.unit,
            "timestamp": now_str
        }
    else:
        # Auto-create if new hardware node
        REGISTERED_SMART_DEVICES[device_id] = {
            "id": device_id,
            "name": f"Smart Node ({device_id})",
            "device_type": "IOT_SENSOR",
            "protocol": "HTTP_WEBHOOK",
            "ip_address": "192.168.1.X",
            "status": "online",
            "last_ping": now_str,
            "created_at": now_str,
            "latest_reading": {
                "metric": payload.metric_name,
                "value": payload.value,
                "unit": payload.unit,
                "timestamp": now_str
            }
        }

    return {"status": "success", "device_id": device_id, "timestamp": now_str}


@router.delete("/{device_id}")
async def delete_smart_device(device_id: str):
    """Remove a connected smart device."""
    if device_id in REGISTERED_SMART_DEVICES:
        del REGISTERED_SMART_DEVICES[device_id]
        return {"status": "deleted", "device_id": device_id}
    raise HTTPException(status_code=404, detail="Device not found")
