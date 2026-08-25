from fastapi import APIRouter
from app.api.endpoints import anomalies, forecast, telemetry, green_api, admin

api_router = APIRouter()
api_router.include_router(telemetry.router, prefix="/telemetry", tags=["telemetry"])
api_router.include_router(forecast.router, prefix="/forecast", tags=["ml_forecasting"])
api_router.include_router(anomalies.router, prefix="/anomalies", tags=["ml_anomalies"])
api_router.include_router(green_api.router, prefix="/green", tags=["dashboard_api"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
