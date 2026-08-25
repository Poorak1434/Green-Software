import numpy as np
import pandas as pd
from typing import List, Dict, Any

class AnomalyDetectionService:
    @staticmethod
    def detect_anomalies_zscore(telemetry_data: List[Dict[str, Any]], threshold: float = 2.5) -> List[Dict[str, Any]]:
        """
        Uses Z-Score to detect anomalies in a time-series window.
        Useful for detecting sudden spikes in flow rate (leaks) or energy.
        """
        if not telemetry_data:
            return []

        df = pd.DataFrame(telemetry_data)
        df['ts'] = pd.to_datetime(df['ts'])
        df['value'] = pd.to_numeric(df['value'])

        # Calculate Z-scores
        mean_val = df['value'].mean()
        std_val = df['value'].std()

        # Handle edge case where standard deviation is 0 (flatline data)
        if std_val == 0:
            return []

        df['z_score'] = (df['value'] - mean_val) / std_val

        # Flag rows where absolute z-score exceeds threshold
        anomalies_df = df[np.abs(df['z_score']) > threshold]

        results = []
        for _, row in anomalies_df.iterrows():
            severity = "high" if abs(row['z_score']) > 3.5 else "medium"
            results.append({
                "timestamp": row['ts'].isoformat(),
                "device_id": row.get('device_id', 'unknown'),
                "value_recorded": row['value'],
                "expected_mean": round(mean_val, 2),
                "z_score": round(row['z_score'], 2),
                "severity": severity,
                "alert_type": "Usage Spike" if row['z_score'] > 0 else "Unexpected Drop"
            })

        return results
