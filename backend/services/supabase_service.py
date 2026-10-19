import os
import logging
from typing import Optional, Dict, Any, List
import httpx

logger = logging.getLogger("supabase_service")

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://hbvycfvvmstsnivalbqi.supabase.co").rstrip("/")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "sb_publishable_9YhkbU2PruXzVdhKLhAw-Q_373M20G7")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

def save_resume_review(review_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Saves resume analysis details and feedback into Supabase 'resume_reviews' table.
    """
    if not SUPABASE_URL or not SUPABASE_KEY:
        logger.warning("Supabase URL or Key not set. Skipping database store.")
        return None

    endpoint = f"{SUPABASE_URL}/rest/v1/resume_reviews"

    payload = {
        "filename": review_data.get("filename", "resume.pdf"),
        "target_role": review_data.get("target_role"),
        "predicted_category": review_data.get("predicted_category"),
        "overall_score": review_data.get("overall_score"),
        "detected_skills": review_data.get("detected_skills", []),
        "missing_skills": review_data.get("missing_skills", []),
        "strengths": review_data.get("strengths", []),
        "weaknesses": review_data.get("weaknesses", []),
        "recommendations": review_data.get("recommendations", []),
        "bullet_rewrites": review_data.get("bullet_rewrites", []),
        "format_analysis": review_data.get("format_analysis", {}),
        "raw_text": review_data.get("raw_text", "")
    }

    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.post(endpoint, json=payload, headers=HEADERS)
            if response.status_code in (200, 201):
                records = response.json()
                if records and isinstance(records, list):
                    return records[0]
                return {"status": "saved"}
            elif response.status_code == 404:
                logger.warning("Supabase table 'resume_reviews' does not exist yet. Please run the SQL schema migration in Supabase SQL Editor.")
                return None
            else:
                logger.error(f"Failed to store in Supabase: {response.status_code} - {response.text}")
                return None
    except Exception as e:
        logger.error(f"Error connecting to Supabase: {e}")
        return None

def get_recent_reviews(limit: int = 20) -> List[Dict[str, Any]]:
    """
    Fetches the latest stored reviews from Supabase.
    """
    if not SUPABASE_URL or not SUPABASE_KEY:
        return []

    endpoint = f"{SUPABASE_URL}/rest/v1/resume_reviews?select=id,created_at,filename,target_role,predicted_category,overall_score,detected_skills&order=created_at.desc&limit={limit}"

    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.get(endpoint, headers=HEADERS)
            if response.status_code == 200:
                return response.json()
            return []
    except Exception as e:
        logger.error(f"Error fetching reviews from Supabase: {e}")
        return []

def get_review_by_id(review_id: str) -> Optional[Dict[str, Any]]:
    """
    Fetches full review details by ID from Supabase.
    """
    if not SUPABASE_URL or not SUPABASE_KEY:
        return None

    endpoint = f"{SUPABASE_URL}/rest/v1/resume_reviews?id=eq.{review_id}&select=*"

    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.get(endpoint, headers=HEADERS)
            if response.status_code == 200:
                results = response.json()
                return results[0] if results else None
            return None
    except Exception as e:
        logger.error(f"Error fetching review {review_id} from Supabase: {e}")
        return None
