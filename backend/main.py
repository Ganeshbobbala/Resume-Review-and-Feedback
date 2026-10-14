from typing import Optional
from pydantic import BaseModel
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from services.resume_parser import extract_text_from_pdf
from services.predictor import predictor_service
from services.skill_extractor import extract_skills
from services.scorer import calculate_scores, ROLE_SKILLS
from services.feedback import generate_feedback, generate_bullet_rewrites
from services.job_matcher import analyze_job_match
from services.format_analyzer import analyze_resume_format

app = FastAPI(
    title="Resume Reviewer API",
    description="AI-Powered Resume Analysis, Job Matcher, and Format Verification Engine",
    version="1.1.0"
)

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

def detect_best_fit_role(detected_skills: list, raw_text: str, predicted_category: str) -> str:
    """
    Automatically detects the best matching tech role from the 15 supported tracks
    based on detected skills, keyword occurrences, and ML category prediction.
    """
    detected_set = {s.lower() for s in detected_skills}
    text_lower = raw_text.lower()
    
    role_scores = {}
    for role, skills in ROLE_SKILLS.items():
        match_count = sum(1 for s in skills if s in detected_set or any(s in d for d in detected_set))
        kw_count = sum(1 for s in skills if s in text_lower)
        score = (match_count * 3) + kw_count
        
        cat_lower = predicted_category.lower()
        if any(term in cat_lower for term in ["data", "science", "ai", "machine"]):
            if role in ["Data Scientist", "ML Engineer", "Data Engineer"]:
                score += 3
        elif any(term in cat_lower for term in ["design", "art", "creative"]):
            if role == "UI/UX Designer":
                score += 3
        elif any(term in cat_lower for term in ["engineer", "technology", "information", "it"]):
            if role in ["Frontend Developer", "Backend Developer", "Full Stack Developer", "DevOps Engineer"]:
                score += 1
                
        role_scores[role] = score
        
    best_role = max(role_scores, key=role_scores.get)
    if role_scores[best_role] == 0:
        if "design" in predicted_category.lower():
            return "UI/UX Designer"
        elif "data" in predicted_category.lower():
            return "Data Scientist"
        return "Full Stack Developer"
        
    return best_role

@app.get("/")
def read_root():
    return {"status": "online", "message": "Resume Reviewer API is running."}

# =========================================================================
# ENDPOINT 1: /analyze-resume (With Target Role or Without Target Role)
# =========================================================================
@app.post("/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...),
    target_role: Optional[str] = Form(None)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only PDF files are supported."
        )

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum limit of 10 MB."
        )

    valid_roles = list(ROLE_SKILLS.keys())
    
    is_auto_role = False
    if not target_role or target_role.strip().lower() in ["", "none", "auto", "null", "undefined", "auto-detect", "without"]:
        is_auto_role = True
    elif target_role not in valid_roles:
        target_role = valid_roles[0]

    extracted_text, parse_error = extract_text_from_pdf(contents)
    if parse_error:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"error": parse_error}
        )

    predicted_category = predictor_service.predict(extracted_text)
    detected_skills = extract_skills(extracted_text)
    
    if is_auto_role:
        target_role_to_use = detect_best_fit_role(detected_skills, extracted_text, predicted_category)
    else:
        target_role_to_use = target_role

    scores = calculate_scores(detected_skills, extracted_text, target_role_to_use)
    feedback = generate_feedback(
        raw_text=extracted_text,
        target_role=target_role_to_use,
        detected_skills=detected_skills,
        matched_skills=scores["matched_skills"],
        missing_skills=scores["missing_skills"],
        sections=scores["sections"],
        scores=scores
    )

    return {
        "extracted_text": extracted_text,
        "predicted_category": predicted_category,
        "target_role": target_role_to_use,
        "is_auto_role": is_auto_role,
        "analysis_mode": "without_target_role" if is_auto_role else "with_target_role",
        "resume_score": scores["resume_score"],
        "skill_score": scores["skill_score"],
        "section_score": scores["section_score"],
        "job_match_score": scores["job_match_score"],
        "keyword_score": scores["keyword_score"],
        "detected_skills": detected_skills,
        "matched_skills": scores["matched_skills"],
        "missing_skills": scores["missing_skills"],
        "sections": scores["sections"],
        "strengths": feedback["strengths"],
        "weaknesses": feedback["weaknesses"],
        "recommendations": feedback["recommendations"],
        "detailed_feedback": feedback.get("detailed_feedback", {})
    }

# =========================================================================
# ENDPOINT: /analyze-text (Real-Time Live Resume Text Update & Optimization)
# =========================================================================
class ResumeTextPayload(BaseModel):
    resume_text: str
    target_role: Optional[str] = None

@app.post("/analyze-text")
async def analyze_resume_text(payload: ResumeTextPayload):
    extracted_text = payload.resume_text
    target_role = payload.target_role

    if not extracted_text or len(extracted_text.strip()) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume text is too short. Please provide at least 10 characters."
        )

    valid_roles = list(ROLE_SKILLS.keys())
    
    is_auto_role = False
    if not target_role or target_role.strip().lower() in ["", "none", "auto", "null", "undefined", "auto-detect", "without"]:
        is_auto_role = True
    elif target_role not in valid_roles:
        target_role = valid_roles[0]

    predicted_category = predictor_service.predict(extracted_text)
    detected_skills = extract_skills(extracted_text)
    
    if is_auto_role:
        target_role_to_use = detect_best_fit_role(detected_skills, extracted_text, predicted_category)
    else:
        target_role_to_use = target_role

    scores = calculate_scores(detected_skills, extracted_text, target_role_to_use)
    feedback = generate_feedback(
        raw_text=extracted_text,
        target_role=target_role_to_use,
        detected_skills=detected_skills,
        matched_skills=scores["matched_skills"],
        missing_skills=scores["missing_skills"],
        sections=scores["sections"],
        scores=scores
    )

    return {
        "extracted_text": extracted_text,
        "predicted_category": predicted_category,
        "target_role": target_role_to_use,
        "is_auto_role": is_auto_role,
        "analysis_mode": "without_target_role" if is_auto_role else "with_target_role",
        "resume_score": scores["resume_score"],
        "skill_score": scores["skill_score"],
        "section_score": scores["section_score"],
        "job_match_score": scores["job_match_score"],
        "keyword_score": scores["keyword_score"],
        "detected_skills": detected_skills,
        "matched_skills": scores["matched_skills"],
        "missing_skills": scores["missing_skills"],
        "sections": scores["sections"],
        "strengths": feedback["strengths"],
        "weaknesses": feedback["weaknesses"],
        "recommendations": feedback["recommendations"],
        "detailed_feedback": feedback.get("detailed_feedback", {})
    }

# =========================================================================
# ENDPOINT: /rewrite-bullet (Interactive AI Bullet Point Improver)
# =========================================================================
class RewriteBulletPayload(BaseModel):
    bullet: str
    target_role: Optional[str] = "Frontend Developer"

@app.post("/rewrite-bullet")
async def rewrite_bullet_endpoint(payload: RewriteBulletPayload):
    if not payload.bullet or len(payload.bullet.strip()) < 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bullet point text is too short. Please provide at least 5 characters."
        )
    variations = generate_bullet_rewrites(payload.bullet, payload.target_role or "Frontend Developer")
    return {"original": payload.bullet, "variations": variations}

# =========================================================================
# ENDPOINT 2: /match-job (New Feature: Job Description Matcher)
# =========================================================================
@app.post("/match-job")
async def match_job_description(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only PDF files are supported."
        )

    if not job_description or len(job_description.strip()) < 15:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description is too short or empty. Please paste a full job description."
        )

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    extracted_text, parse_error = extract_text_from_pdf(contents)
    if parse_error:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"error": parse_error}
        )

    try:
        match_result = analyze_job_match(extracted_text, job_description)
        return match_result
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Job matching failed: {str(e)}")

# =========================================================================
# ENDPOINT 3: /analyze-format (New Feature: Resume Format Analyzer)
# =========================================================================
@app.post("/analyze-format")
async def analyze_format(
    file: UploadFile = File(...)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only PDF files are supported."
        )

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    try:
        format_result = analyze_resume_format(contents)
        return format_result
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Format analysis failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
