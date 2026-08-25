from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

# Users
class UserBase(BaseModel):
    id: UUID
    email: EmailStr
    is_premium: bool = False

class User(UserBase):
    created_at: datetime

# Homes
class HomeBase(BaseModel):
    name: str
    address: Optional[str] = None
    timezone: str = "UTC"

class HomeCreate(HomeBase):
    user_id: UUID

class Home(HomeBase):
    id: UUID
    user_id: UUID
    created_at: datetime

# Devices / Appliances
class DeviceBase(BaseModel):
    name: str
    device_type: str

class DeviceCreate(DeviceBase):
    home_id: UUID

class Device(DeviceBase):
    id: UUID
    home_id: UUID
    is_online: bool
    last_ping: Optional[datetime] = None
    created_at: datetime
    
# Automation Rules
class AutomationRuleBase(BaseModel):
    rule_type: str
    is_enabled: bool = True
    parameters: Dict[str, Any]

class AutomationRuleCreate(AutomationRuleBase):
    device_id: UUID

class AutomationRule(AutomationRuleBase):
    id: UUID
    device_id: UUID
    created_at: datetime
    updated_at: datetime

# Anomalies and Alerts
class AnomalyBase(BaseModel):
    anomaly_type: str
    severity: str
    description: Optional[str] = None

class SensorReadingCreate(BaseModel):
    device_id: UUID
    value: float
    unit: str
    ts: datetime


class AnomalyCreate(AnomalyBase):
    device_id: UUID

class Anomaly(AnomalyBase):
    id: UUID
    device_id: UUID
    is_resolved: bool
    detected_at: datetime
