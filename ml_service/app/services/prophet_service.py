import pandas as pd
from typing import List, Dict, Any
from datetime import datetime, timedelta
import numpy as np

# In a true production environment, Prophet from `prophet` would be used.
# For the sake of this MVP Phase, we will simulate the Prophet interface behavior
# utilizing Pandas Dataframes to output the forecast JSON structure safely.

class UsagePredictionService:
    @staticmethod
    def generate_prophet_forecast(historical_data: List[Dict[str, Any]], days_ahead: int = 7) -> List[Dict[str, Any]]:
        """
        Takes historical sensor data and returns a forecasted trend using mock ML.
        """
        if not historical_data:
            return []

        # Convert to Pandas DataFrame
        df = pd.DataFrame(historical_data)
        
        # Ensure we have datetime and numerical values
        df['ds'] = pd.to_datetime(df['ds'])
        df['y'] = pd.to_numeric(df['y'])
        
        # Calculate a simple rolling mean as our "learned trend"
        recent_trend_value = df['y'].mean() if not df.empty else 100.0
        
        last_date = df['ds'].max()
        
        forecast = []
        # Generate future predictions based on trend + slight daily noise
        for i in range(1, days_ahead + 1):
            future_date = last_date + timedelta(days=i)
            # Add synthetic noise/seasonality simulating a Prophet output
            seasonality_modifier = np.sin(i) * 5.0
            predicted_y = recent_trend_value + seasonality_modifier
            
            forecast.append({
                "ds": future_date.isoformat(),
                "yhat": round(predicted_y, 2),
                "yhat_lower": round(predicted_y * 0.9, 2),
                "yhat_upper": round(predicted_y * 1.1, 2)
            })
            
        return forecast
