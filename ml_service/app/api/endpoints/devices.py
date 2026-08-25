from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
import uuid

router = APIRouter()

# In-memory device store & telemetry cache for live hardware nodes (e.g. Galaxy S24 Ultra)
REGISTERED_DEVICES: Dict[str, Dict[str, Any]] = {
    "galaxy-s24-ultra": {
        "id": "galaxy-s24-ultra",
        "name": "Samsung Galaxy S24 Ultra",
        "device_type": "SMARTPHONE",
        "model": "SM-S928B (Snapdragon 8 Gen 3)",
        "os": "Android 14 / One UI 6.1",
        "ip_address": "192.168.1.105",
        "status": "online",
        "last_seen": datetime.now(timezone.utc).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "metadata": {
            "mac": "3A:4B:5C:6D:7E:8F",
            "wifi_standard": "Wi-Fi 7 (802.11be)",
            "screen_refresh_rate": "120Hz LTPO"
        }
    }
}

TELEMETRY_CACHE: Dict[str, List[Dict[str, Any]]] = {
    "galaxy-s24-ultra": [
        {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "battery_level": 88,
            "is_charging": True,
            "charging_time": 1800,
            "discharging_time": None,
            "power_draw_w": 4.5,
            "cpu_usage_pct": 14.2,
            "memory_usage_pct": 42.1,
            "temperature_c": 32.4,
            "network_type": "Wi-Fi (5GHz / 802.11ax)",
            "rtt_ms": 12,
            "downlink_mbps": 450.0
        }
    ]
}


class SmartphoneTelemetryPayload(BaseModel):
    device_id: str = Field(default="galaxy-s24-ultra")
    battery_level: float = Field(..., description="Battery level 0 to 100")
    is_charging: bool = Field(default=False)
    charging_time: Optional[float] = None
    discharging_time: Optional[float] = None
    power_draw_w: Optional[float] = Field(default=3.8)
    cpu_usage_pct: Optional[float] = Field(default=15.0)
    memory_usage_pct: Optional[float] = Field(default=40.0)
    temperature_c: Optional[float] = Field(default=33.0)
    network_type: Optional[str] = Field(default="Wi-Fi")
    rtt_ms: Optional[float] = Field(default=15.0)
    downlink_mbps: Optional[float] = Field(default=300.0)


class DeviceRegisterPayload(BaseModel):
    name: str = Field(..., example="Samsung Galaxy S24 Ultra")
    device_type: str = Field(..., example="SMARTPHONE")
    ip_address: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


@router.get("/list")
async def list_devices():
    """List all registered Wi-Fi hardware and smartphones."""
    return list(REGISTERED_DEVICES.values())


@router.post("/register")
async def register_device(payload: DeviceRegisterPayload):
    """Register a new smart device or mobile phone."""
    device_id = str(uuid.uuid4())
    device_data = {
        "id": device_id,
        "name": payload.name,
        "device_type": payload.device_type,
        "ip_address": payload.ip_address or "192.168.1.X",
        "status": "online",
        "last_seen": datetime.now(timezone.utc).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "metadata": payload.metadata or {}
    }
    REGISTERED_DEVICES[device_id] = device_data
    if device_id not in TELEMETRY_CACHE:
        TELEMETRY_CACHE[device_id] = []
    return {"status": "registered", "device": device_data}


@router.post("/telemetry")
async def ingest_smartphone_telemetry(payload: SmartphoneTelemetryPayload):
    """Ingest live telemetry from Samsung Galaxy S24 Ultra or mobile agent."""
    device_id = payload.device_id
    now_str = datetime.now(timezone.utc).isoformat()

    # Update status
    if device_id in REGISTERED_DEVICES:
        REGISTERED_DEVICES[device_id]["status"] = "online"
        REGISTERED_DEVICES[device_id]["last_seen"] = now_str
    else:
        # Auto-register if unknown
        REGISTERED_DEVICES[device_id] = {
            "id": device_id,
            "name": "Samsung Galaxy S24 Ultra",
            "device_type": "SMARTPHONE",
            "ip_address": "Wi-Fi Client",
            "status": "online",
            "last_seen": now_str,
            "created_at": now_str,
            "metadata": {}
        }

    reading = {
        "timestamp": now_str,
        "battery_level": payload.battery_level,
        "is_charging": payload.is_charging,
        "charging_time": payload.charging_time,
        "discharging_time": payload.discharging_time,
        "power_draw_w": payload.power_draw_w,
        "cpu_usage_pct": payload.cpu_usage_pct,
        "memory_usage_pct": payload.memory_usage_pct,
        "temperature_c": payload.temperature_c,
        "network_type": payload.network_type,
        "rtt_ms": payload.rtt_ms,
        "downlink_mbps": payload.downlink_mbps
    }

    if device_id not in TELEMETRY_CACHE:
        TELEMETRY_CACHE[device_id] = []

    # Store last 50 readings
    TELEMETRY_CACHE[device_id].append(reading)
    if len(TELEMETRY_CACHE[device_id]) > 50:
        TELEMETRY_CACHE[device_id].pop(0)

    return {"status": "success", "device_id": device_id, "reading": reading}


@router.get("/telemetry/{device_id}")
async def get_device_telemetry(device_id: str):
    """Fetch live & historical telemetry for a specific device."""
    if device_id not in TELEMETRY_CACHE or not TELEMETRY_CACHE[device_id]:
        # Return fallback latest
        return {
            "device_id": device_id,
            "history": [
                {
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "battery_level": 85.0,
                    "is_charging": True,
                    "power_draw_w": 4.2,
                    "cpu_usage_pct": 12.5,
                    "temperature_c": 31.8,
                    "rtt_ms": 10.0,
                    "downlink_mbps": 500.0
                }
            ],
            "latest": {
                "battery_level": 85.0,
                "is_charging": True,
                "power_draw_w": 4.2,
                "cpu_usage_pct": 12.5,
                "temperature_c": 31.8,
                "rtt_ms": 10.0,
                "downlink_mbps": 500.0
            }
        }
    
    history = TELEMETRY_CACHE[device_id]
    return {
        "device_id": device_id,
        "history": history,
        "latest": history[-1]
    }
