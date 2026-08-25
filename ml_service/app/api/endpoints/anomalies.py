from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.services.anomaly_service import AnomalyDetectionService

router = APIRouter()

@router.get("/{home_id}")
async def get_recent_anomalies(home_id: str, minutes_back: int = 1440):
    """
    Scans the recent time window (default 24h) for statistical anomalies 
    in sensor readings that might indicate leaks or excessive power draw.
    """
    
    # 1. Fetch recent telemetry data
    # Real query: "SELECT ts, device_id, value FROM sensor_readings WHERE ts > NOW() - INTERVAL '1 minute' * $1"
    
    # Mocking standard usage with a few artificial spikes for testing
    import random
    mock_telemetry = []
    base_time = datetime.utcnow() - timedelta(minutes=minutes_back)
    
    for i in range(100):
        val = random.gauss(5.0, 0.5) # Normal distribution around 5 liters/min
        
        # Inject artificial anomalies
        if i == 45:
            val = 28.5 # Sudden burst (pipe burst/leak)
        elif i == 88:
            val = 19.2 # High usage
            
        mock_telemetry.append({
            "ts": (base_time + timedelta(minutes=i * (minutes_back/100))).isoformat(),
            "device_id": "flow_meter_01",
            "value": val
        })
        
    # 2. Run statistical anomaly detection
    anomalies = AnomalyDetectionService.detect_anomalies_zscore(
        telemetry_data=mock_telemetry,
        threshold=2.5
    )
    
    return {
        "home_id": home_id,
        "window_minutes": minutes_back,
        "total_readings_analyzed": len(mock_telemetry),
        "anomalies_detected": len(anomalies),
        "anomalies": anomalies
    }
