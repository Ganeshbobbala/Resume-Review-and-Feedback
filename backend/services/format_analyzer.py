import re
import fitz  # PyMuPDF
from typing import Dict, Any, List, Tuple

WEAK_PHRASES = [
    r'\bworked\s+on\b',
    r'\bhelped\s+with\b',
    r'\bresponsible\s+for\b',
    r'\bdid\b',
    r'\bmade\b',
    r'\bassisted\s+in\b',
    r'\bhandled\b'
]

STRONG_VERBS = [
    r'\bdeveloped\b', r'\bimplemented\b', r'\bdesigned\b', r'\bbuilt\b',
    r'\bcreated\b', r'\boptimized\b', r'\banalyzed\b', r'\bautomated\b',
    r'\bintegrated\b', r'\bled\b', r'\bimproved\b', r'\bengineered\b',
    r'\barchitected\b', r'\borchestrated\b'
]

def analyze_resume_format(file_bytes: bytes) -> Dict[str, Any]:
    """
    Parses PDF bytes and returns heuristic structure, bullet, contact, and readability metrics.
    """
    if not file_bytes:
        raise ValueError("Uploaded file is empty.")

    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        page_count = doc.page_count
        
        text_content = []
        for page in doc:
            t = page.get_text("text")
            if t:
                text_content.append(t)
        full_text = "\n".join(text_content).strip()
        doc.close()
    except Exception as e:
        raise ValueError(f"Failed to read PDF document: {str(e)}")

    if not full_text:
        raise ValueError("Could not extract readable text from PDF.")

    text_lower = full_text.lower()
    lines = [line.strip() for line in full_text.split("\n") if line.strip()]

    # 1. Contact Info Analysis
    email_found = bool(re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b', text_lower))
    phone_found = bool(re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text_lower))
    linkedin_found = bool(re.search(r'linkedin\.com', text_lower))
    github_found = bool(re.search(r'github\.com', text_lower))
    portfolio_found = bool(re.search(r'\b(portfolio|website|http|https)\b', text_lower))

    contact_dict = {
        "email": email_found,
        "phone": phone_found,
        "linkedin": linkedin_found,
        "github": github_found,
        "portfolio": portfolio_found
    }

    # 2. Section Analysis
    sections_dict = {
        "contact": email_found or phone_found,
        "summary": bool(re.search(r'\b(summary|profile|about\s+me)\b', text_lower)),
        "objective": bool(re.search(r'\bobjective\b', text_lower)),
        "education": bool(re.search(r'\b(education|academic|degree|university|college)\b', text_lower)),
        "skills": bool(re.search(r'\b(skills|technologies|expertise)\b', text_lower)),
        "experience": bool(re.search(r'\b(experience|employment|work\s+history)\b', text_lower)),
        "internships": bool(re.search(r'\binternships?\b', text_lower)),
        "projects": bool(re.search(r'\bprojects?\b', text_lower)),
        "certifications": bool(re.search(r'\b(certifications?|certificates?|licensed?)\b', text_lower)),
        "achievements": bool(re.search(r'\b(achievements?|awards?|honors?)\b', text_lower)),
        "languages": bool(re.search(r'\blanguages?\b', text_lower))
    }

    # 3. Bullet Point Quality & Action Verbs
    bullet_lines = [
        line for line in lines
        if line.startswith(('•', '-', '*', '1.', '2.', '3.')) or (len(line) > 30 and any(re.search(v, line.lower()) for v in STRONG_VERBS + WEAK_PHRASES))
    ]

    if not bullet_lines:
        bullet_lines = [line for line in lines if len(line) > 40]

    total_bullets = len(bullet_lines)
    strong_bullets = 0
    needs_improvement = 0
    long_bullets = 0
    quantified_bullets = 0

    for b in bullet_lines:
        b_lower = b.lower()
        has_number = bool(re.search(r'\b\d+(?:%|\+|\s*k|\s*m)?\b', b_lower))
        has_strong_verb = any(re.search(v, b_lower) for v in STRONG_VERBS)
        has_weak_phrase = any(re.search(w, b_lower) for w in WEAK_PHRASES)

        if has_number:
            quantified_bullets += 1

        if len(b) > 250:
            long_bullets += 1

        if has_strong_verb and (has_number or len(b) > 50):
            strong_bullets += 1
        elif has_weak_phrase or len(b) < 25:
            needs_improvement += 1
        else:
            strong_bullets += 1

    unquantified_bullets = max(0, total_bullets - quantified_bullets)

    # 4. Readability Metrics (Heuristics)
    avg_line_len = sum(len(l) for l in lines) / len(lines) if lines else 50
    sentence_clarity = min(100, max(50, round(100 - abs(avg_line_len - 65) * 0.8)))
    content_density = 85 if 200 < len(full_text.split()) < 900 else 72
    section_clarity = min(100, round((sum(1 for s in sections_dict.values() if s) / len(sections_dict)) * 100 + 25))

    # 5. Format Score Calculation
    contact_score = (sum(1 for c in contact_dict.values() if c) / len(contact_dict)) * 100
    sections_score = (sum(1 for s in ["contact", "education", "skills", "experience", "projects"] if sections_dict.get(s)) / 5) * 100
    bullet_score = (strong_bullets / total_bullets * 100) if total_bullets > 0 else 70
    quant_score = (quantified_bullets / total_bullets * 100) if total_bullets > 0 else 50

    format_score = round(
        (sections_score * 0.35) +
        (bullet_score * 0.25) +
        (contact_score * 0.20) +
        (quant_score * 0.20)
    )

    # Warnings & Recommendations
    warnings = []
    recommendations = []

    if long_bullets > 0:
        warnings.append(f"{long_bullets} bullet point(s) are too long (over 250 characters). Break them down for better readability.")

    if unquantified_bullets > (total_bullets // 2):
        warnings.append(f"{unquantified_bullets} out of {total_bullets} bullet points lack measurable numbers or statistics.")

    if not sections_dict.get("certifications"):
        warnings.append("Certifications section not detected.")

    if not contact_dict.get("linkedin"):
        warnings.append("LinkedIn profile link not detected in contact details.")

    # Recommendations
    if unquantified_bullets > 0:
        recommendations.append("Add measurable outcomes (e.g. 'Improved API response speed by 35%') to your experience bullets.")

    if any(re.search(w, text_lower) for w in WEAK_PHRASES):
        recommendations.append("Replace passive phrases like 'worked on' or 'responsible for' with active verbs like 'Implemented', 'Architected', 'Optimized'.")

    if page_count > 2:
        recommendations.append("Your resume is over 2 pages long. Consider condensing key achievements to 1-2 pages.")
    else:
        recommendations.append("Resume page length is well-structured and easy to skim.")

    return {
        "format_score": format_score,
        "pages": page_count,
        "sections": sections_dict,
        "contact": contact_dict,
        "bullet_analysis": {
            "total": total_bullets,
            "strong": strong_bullets,
            "needs_improvement": needs_improvement,
            "long": long_bullets
        },
        "quantification": {
            "quantified": quantified_bullets,
            "unquantified": unquantified_bullets
        },
        "readability": {
            "sentence_clarity": sentence_clarity,
            "content_density": content_density,
            "section_clarity": section_clarity
        },
        "warnings": warnings,
        "recommendations": recommendations
    }

