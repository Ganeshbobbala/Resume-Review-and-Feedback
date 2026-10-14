import re
from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from services.skill_extractor import extract_skills, SKILL_PATTERNS
from services.text_processor import preprocess_text

# Common English stop words to filter out during keyword extraction
STOP_WORDS = {
    "the", "and", "or", "with", "for", "a", "an", "to", "of", "in", "on", "at", "by", "from",
    "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does",
    "did", "will", "would", "shall", "should", "can", "could", "may", "might", "must", "this",
    "that", "these", "those", "we", "you", "our", "your", "their", "he", "she", "it", "they",
    "as", "but", "if", "than", "so", "about", "into", "through", "during", "before", "after",
    "above", "below", "up", "down", "out", "off", "over", "under", "again", "further", "then",
    "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each",
    "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same",
    "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now", "looking",
    "work", "experience", "candidate", "team", "role", "position", "ability", "strong", "skills",
    "job", "description", "required", "requirements", "responsibilities"
}

def extract_keywords(text: str) -> List[str]:
    """
    Extracts meaningful keywords from text by filtering out stop words.
    """
    cleaned = preprocess_text(text)
    words = re.findall(r'\b[a-zA-Z0-9\+\#\.\-]{2,}\b', cleaned)
    keywords = [w.capitalize() for w in words if w.lower() not in STOP_WORDS]
    # Remove duplicates preserving order
    seen = set()
    result = []
    for kw in keywords:
        if kw.lower() not in seen:
            seen.add(kw.lower())
            result.append(kw)
    return result

def extract_years_experience(text: str) -> str:
    """
    Extracts experience requirements from text.
    """
    text_lower = text.lower()
    match = re.search(r'(\d+\+?\s*(?:-\s*\d+)?\s*(?:years?|yrs?))\s*(?:of\s*)?experience', text_lower)
    if match:
        return match.group(1)
    if "fresher" in text_lower or "entry level" in text_lower or "entry-level" in text_lower:
        return "Entry-level / Fresher"
    return "Not specified"

def analyze_job_match(resume_text: str, job_description: str) -> Dict[str, Any]:
    """
    Compares resume text with job description text and returns explainable match metrics.
    """
    if not job_description or len(job_description.strip()) < 20:
        raise ValueError("Job description is too short or empty. Please provide a detailed job description.")

    if len(job_description) > 10000:
        job_description = job_description[:10000]

    # 1. Skill Match (40%)
    jd_skills = extract_skills(job_description)
    resume_skills = extract_skills(resume_text)
    
    resume_skills_lower = {s.lower() for s in resume_skills}
    
    matched_skills = [s for s in jd_skills if s.lower() in resume_skills_lower or any(s.lower() in r for r in resume_skills_lower)]
    missing_skills = [s for s in jd_skills if s not in matched_skills]
    
    total_jd_skills = len(jd_skills)
    if total_jd_skills > 0:
        skill_match_score = min(100, round((len(matched_skills) / total_jd_skills) * 100))
    else:
        skill_match_score = 75

    # 2. Keyword Match (25%)
    jd_keywords = extract_keywords(job_description)
    resume_text_lower = resume_text.lower()
    
    matched_keywords = [kw for kw in jd_keywords if kw.lower() in resume_text_lower]
    missing_keywords = [kw for kw in jd_keywords if kw.lower() not in resume_text_lower]
    
    if len(jd_keywords) > 0:
        keyword_match_score = min(100, round((len(matched_keywords) / min(30, len(jd_keywords))) * 100))
    else:
        keyword_match_score = 70

    # 3. Experience Match (15%)
    jd_exp = extract_years_experience(job_description)
    resume_exp = extract_years_experience(resume_text)
    
    # Check compatibility
    has_exp = bool(re.search(r'\b(experience|worked|developed|engineer|developer|intern)\b', resume_text_lower))
    if jd_exp == "Not specified" or "fresher" in jd_exp.lower() or "entry" in jd_exp.lower():
        experience_match_score = 100
    elif has_exp:
        experience_match_score = 90
    else:
        experience_match_score = 65

    # 4. Education Match (10%)
    education_terms = ["bachelor", "master", "degree", "b.tech", "m.tech", "computer science", "engineering", "bs", "ms"]
    jd_edu_required = any(term in job_description.lower() for term in education_terms)
    resume_edu_present = any(term in resume_text_lower for term in education_terms)
    
    if not jd_edu_required or resume_edu_present:
        education_match_score = 100
    else:
        education_match_score = 60

    # 5. Role Similarity via TF-IDF Cosine Similarity (10%)
    try:
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform([preprocess_text(resume_text), preprocess_text(job_description)])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        role_similarity_score = min(100, max(40, round(similarity * 100 + 40)))
    except Exception:
        role_similarity_score = 75

    # Final Job Match Score Formula
    final_match_score = round(
        (skill_match_score * 0.40) +
        (keyword_match_score * 0.25) +
        (experience_match_score * 0.15) +
        (education_match_score * 0.10) +
        (role_similarity_score * 0.10)
    )

    # Recommendations
    recommendations = []
    if missing_skills:
        missing_str = ", ".join(missing_skills[:4])
        recommendations.append(f"Consider learning or highlighting these skills if you have genuine experience with them: {missing_str}.")
    
    if missing_keywords:
        missing_kw_str = ", ".join(missing_keywords[:4])
        recommendations.append(f"Optimize your resume by naturally incorporating key terms: {missing_kw_str}.")

    if not re.search(r'\b\d+(?:%|\+|\s*k|\s*m)?\b', resume_text_lower):
        recommendations.append("Add measurable outcomes to your projects (e.g. 'Improved response time by 30%').")

    if not recommendations:
        recommendations.append("Your resume aligns well with the job description! Ensure your contact details are up to date.")

    return {
        "match_score": final_match_score,
        "skill_match": skill_match_score,
        "keyword_match": keyword_match_score,
        "experience_match": experience_match_score,
        "education_match": education_match_score,
        "role_similarity": role_similarity_score,
        "matched_skills": matched_skills[:12],
        "missing_skills": missing_skills[:12],
        "matched_keywords": matched_keywords[:15],
        "missing_keywords": missing_keywords[:15],
        "recommendations": recommendations
    }

