from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

from app.core.database import db

router = APIRouter()

@router.get("/users")
async def get_all_users():
    """
    Returns a list of all users from the database.
    """
    if not db.pool:
        raise HTTPException(status_code=503, detail="Database connection not available")
        
    async with db.pool.acquire() as conn:
        try:
            # We want to pull ID, email, created at, and premium status
            # from the users table
            users = await conn.fetch("SELECT id, email, created_at, is_premium FROM users ORDER BY created_at DESC")
            
            # Format the output into a list of dictionaries
            user_list = []
            for user in users:
                user_list.append({
                    "id": str(user['id']),
                    "email": user['email'],
                    "created_at": user['created_at'].isoformat() if user['created_at'] else None,
                    "is_premium": user['is_premium']
                })
            
            return {"users": user_list}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
