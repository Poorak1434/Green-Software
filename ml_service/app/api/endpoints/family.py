from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
import uuid

router = APIRouter()

# In-memory store for Family Member Profiles
FAMILY_PROFILES: Dict[str, Dict[str, Any]] = {
    "fam-01": {
        "id": "fam-01",
        "name": "Poorak Pandey",
        "role": "Primary Resident",
        "avatar_color": "from-emerald-400 to-teal-600",
        "preferred_temp_c": 22.0,
        "lighting_mood": "Warm Day (75%)",
        "assigned_room": "Home Office",
        "typical_arrival_time": "17:30",
        "eco_mode_enabled": True,
        "current_presence": {"is_present": True, "room_id": "home-office", "last_detected": datetime.now(timezone.utc).isoformat()}
    },
    "fam-02": {
        "id": "fam-02",
        "name": "Ananya Pandey",
        "role": "Family Member",
        "avatar_color": "from-purple-400 to-indigo-600",
        "preferred_temp_c": 24.0,
        "lighting_mood": "Soft Cool (60%)",
        "assigned_room": "Master Bedroom",
        "typical_arrival_time": "18:15",
        "eco_mode_enabled": True,
        "current_presence": {"is_present": False, "room_id": None, "last_detected": datetime.now(timezone.utc).isoformat()}
    },
    "fam-03": {
        "id": "fam-03",
        "name": "Rajesh Pandey",
        "role": "Family Member",
        "avatar_color": "from-amber-400 to-orange-600",
        "preferred_temp_c": 23.5,
        "lighting_mood": "Daylight (90%)",
        "assigned_room": "Living Room",
        "typical_arrival_time": "19:00",
        "eco_mode_enabled": True,
        "current_presence": {"is_present": False, "room_id": None, "last_detected": datetime.now(timezone.utc).isoformat()}
    }
}

# Room Status & Active Devices State
ROOM_STATES: Dict[str, Dict[str, Any]] = {
    "home-office": {
        "id": "home-office",
        "name": "Home Office",
        "occupied_by": ["fam-01"],
        "ac_status": "ON",
        "ac_setpoint_c": 22.0,
        "ambient_temp_c": 22.5,
        "lights_status": "ON",
        "lights_brightness": 75,
        "power_draw_w": 650
    },
    "master-bedroom": {
        "id": "master-bedroom",
        "name": "Master Bedroom",
        "occupied_by": [],
        "ac_status": "OFF (Pre-Cooling Scheduled)",
        "ac_setpoint_c": 24.0,
        "ambient_temp_c": 27.0,
        "lights_status": "OFF",
        "lights_brightness": 0,
        "power_draw_w": 0
    },
    "living-room": {
        "id": "living-room",
        "name": "Living Room",
        "occupied_by": [],
        "ac_status": "OFF",
        "ac_setpoint_c": 23.5,
        "ambient_temp_c": 26.2,
        "lights_status": "OFF",
        "lights_brightness": 0,
        "power_draw_w": 0
    }
}


class ProfileUpdatePayload(BaseModel):
    name: str
    preferred_temp_c: float = Field(..., ge=16.0, le=30.0)
    lighting_mood: str
    assigned_room: str
    typical_arrival_time: str
    eco_mode_enabled: bool = True


class PresenceEventPayload(BaseModel):
    person_id: str
    room_id: str
    action: str = Field(..., example="ENTER") # ENTER or LEAVE


@router.get("/profiles")
async def get_family_profiles():
    """Get all family member profiles and current presence status."""
    return {
        "profiles": list(FAMILY_PROFILES.values()),
        "rooms": list(ROOM_STATES.values())
    }


@router.post("/profiles")
async def update_family_profile(person_id: str, payload: ProfileUpdatePayload):
    """Update profile preferences for a family member."""
    if person_id in FAMILY_PROFILES:
        FAMILY_PROFILES[person_id]["name"] = payload.name
        FAMILY_PROFILES[person_id]["preferred_temp_c"] = payload.preferred_temp_c
        FAMILY_PROFILES[person_id]["lighting_mood"] = payload.lighting_mood
        FAMILY_PROFILES[person_id]["assigned_room"] = payload.assigned_room
        FAMILY_PROFILES[person_id]["typical_arrival_time"] = payload.typical_arrival_time
        FAMILY_PROFILES[person_id]["eco_mode_enabled"] = payload.eco_mode_enabled
        return {"status": "updated", "profile": FAMILY_PROFILES[person_id]}
    raise HTTPException(status_code=404, detail="Family member profile not found")


@router.post("/presence")
async def process_presence_event(payload: PresenceEventPayload):
    """Process real-time room entry/exit presence event."""
    person_id = payload.person_id
    room_id = payload.room_id
    action = payload.action.upper()

    if person_id not in FAMILY_PROFILES:
        raise HTTPException(status_code=404, detail="Person profile not found")
    if room_id not in ROOM_STATES:
        raise HTTPException(status_code=404, detail="Room not found")

    person = FAMILY_PROFILES[person_id]
    room = ROOM_STATES[room_id]
    now_str = datetime.now(timezone.utc).isoformat()

    if action == "ENTER":
        person["current_presence"] = {"is_present": True, "room_id": room_id, "last_detected": now_str}
        if person_id not in room["occupied_by"]:
            room["occupied_by"].append(person_id)
        
        # Trigger devices based on person's profile
        room["ac_status"] = "ON"
        room["ac_setpoint_c"] = person["preferred_temp_c"]
        room["ambient_temp_c"] = person["preferred_temp_c"]
        room["lights_status"] = "ON"
        room["lights_brightness"] = 80
        room["power_draw_w"] = 720
        msg = f"Entered {room['name']}. AC set to {person['preferred_temp_c']}°C, Lights turned ON."
    else:
        # LEAVE
        person["current_presence"] = {"is_present": False, "room_id": None, "last_detected": now_str}
        if person_id in room["occupied_by"]:
            room["occupied_by"].remove(person_id)

        if len(room["occupied_by"]) == 0:
            room["ac_status"] = "OFF (Auto Cutoff)"
            room["lights_status"] = "OFF"
            room["lights_brightness"] = 0
            room["power_draw_w"] = 0
            msg = f"Left {room['name']}. Devices automatically turned OFF to save electricity."
        else:
            msg = f"Left {room['name']}. Room remains occupied."

    return {
        "status": "success",
        "message": msg,
        "person": person,
        "room": room
    }


@router.get("/weather-optimization")
async def get_weather_energy_optimization():
    """Fetch live weather metrics and AI electricity optimization recommendations."""
    return {
        "location": "New Delhi / Local Subnet",
        "outdoor_temperature_c": 34.2,
        "humidity_pct": 68,
        "weather_condition": "Partly Cloudy & Warm",
        "uv_index": 7.4,
        "ai_optimization": {
            "recommended_ac_temp_c": 24.5,
            "estimated_kwh_saved_daily": 4.8,
            "cost_savings_inr": 42.50,
            "active_strategy": "Dynamic Eco-Modulation (Optimizing outdoor 34°C to indoor 24.5°C)"
        },
        "predictive_pre_cooling": [
            {
                "person_name": "Ananya Pandey",
                "room_name": "Master Bedroom",
                "estimated_arrival": "18:15",
                "pre_cooling_start": "18:00 (In 1 hr 45 mins)",
                "target_temp_c": 24.0,
                "status": "Scheduled"
            },
            {
                "person_name": "Rajesh Pandey",
                "room_name": "Living Room",
                "estimated_arrival": "19:00",
                "pre_cooling_start": "18:45",
                "target_temp_c": 23.5,
                "status": "Scheduled"
            }
        ]
    }
