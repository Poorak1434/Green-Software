from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.services.prophet_service import UsagePredictionService

router = APIRouter()

@router.get("/{home_id}")
async def get_usage_forecast(home_id: str, days_ahead: int = 7):
    """
    Returns AI-driven forecasts for water and energy consumption
    based on historical usage patterns for the specified home.
    """
    # 1. Fetch historical data from TimescaleDB (Mocked for this endpoint)
    # real code would be: 
    # records = await db.pool.fetch("SELECT date_trunc('day', ts) as ds, sum(value) as y FROM sensor_readings ...")
    
    mock_historical_data = []
    base_date = datetime.utcnow() - timedelta(days=30)
    
    for i in range(30):
        # Format required by Facebook Prophet
        mock_historical_data.append({
            "ds": (base_date + timedelta(days=i)).isoformat(),
            "y": 120 + (i % 7) * 5  # arbitrary pattern
        })
        
    # 2. Feed into Prophet ML model
    forecast_results = UsagePredictionService.generate_prophet_forecast(
        historical_data=mock_historical_data, 
        days_ahead=days_ahead
    )
    
    return {
        "home_id": home_id,
        "forecast": forecast_results,
        "model_type": "Prophet (Mock)",
        "confidence_interval": "90%"
    }
