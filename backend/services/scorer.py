import re
from typing import List, Dict, Any

ROLE_SKILLS: Dict[str, List[str]] = {
    "Frontend Developer": [
        "html",
        "css",
        "javascript",
        "react",
        "typescript",
        "git"
    ],

    "Backend Developer": [
        "python",
        "node.js",
        "express",
        "sql",
        "mongodb",
        "rest api",
        "git"
    ],

    "Full Stack Developer": [
        "html",
        "css",
        "javascript",
        "react",
        "node.js",
        "express",
        "sql",
        "git"
    ],

    "Java Developer": [
        "java",
        "spring",
        "spring boot",
        "sql",
        "jdbc",
        "hibernate",
        "git"
    ],

    "Data Scientist": [
        "python",
        "pandas",
        "numpy",
        "scikit-learn",
        "machine learning",
        "statistics",
        "sql"
    ],

    "ML Engineer": [
        "python",
        "machine learning",
        "tensorflow",
        "pytorch",
        "scikit-learn",
        "numpy",
        "pandas"
    ],

    "Data Engineer": [
        "python",
        "sql",
        "pandas",
        "spark",
        "hadoop",
        "cloud",
        "git"
    ],

    "DevOps Engineer": [
        "docker",
        "kubernetes",
        "aws",
        "ci/cd",
        "linux",
        "python",
        "git"
    ],

    "Cloud Architect": [
        "aws",
        "cloud",
        "docker",
        "kubernetes",
        "microservices",
        "networking",
        "git"
    ],

    "Android Developer": [
        "kotlin",
        "java",
        "android",
        "rest api",
        "git"
    ],

    "iOS Developer": [
        "swift",
        "ios",
        "rest api",
        "git"
    ],

    "Cybersecurity Analyst": [
        "cybersecurity",
        "networking",
        "linux",
        "python",
        "sql"
    ],

    "QA / Automation Engineer": [
        "selenium",
        "testing",
        "python",
        "javascript",
        "git"
    ],

    "UI/UX Designer": [
        "figma",
        "ui/ux",
        "prototyping",
        "html",
        "css"
    ],

    "Product Manager": [
        "agile",
        "scrum",
        "jira",
        "product management",
        "data analysis"
    ]
}

# Display names for canonical formatting
CANONICAL_ROLE_SKILL_NAMES = {
    "html": "HTML",
    "css": "CSS",
    "javascript": "JavaScript",
    "react": "React",
    "typescript": "TypeScript",
    "git": "Git",
    "python": "Python",
    "node.js": "Node.js",
    "express": "Express",
    "sql": "SQL",
    "mongodb": "MongoDB",
    "rest api": "REST API",
    "java": "Java",
    "spring": "Spring",
    "spring boot": "Spring Boot",
    "jdbc": "JDBC",
    "hibernate": "Hibernate",
    "pandas": "Pandas",
    "numpy": "NumPy",
    "scikit-learn": "Scikit-learn",
    "machine learning": "Machine Learning",
    "statistics": "Statistics",
    "tensorflow": "TensorFlow",
    "pytorch": "PyTorch",
    "docker": "Docker",
    "kubernetes": "Kubernetes",
    "aws": "AWS",
    "cloud": "Cloud (AWS/GCP/Azure)",
    "ci/cd": "CI/CD",
    "linux": "Linux",
    "spark": "Apache Spark",
    "hadoop": "Hadoop",
    "kotlin": "Kotlin",
    "swift": "Swift",
    "android": "Android SDK",
    "ios": "iOS / Xcode",
    "cybersecurity": "Cybersecurity",
    "networking": "Networking",
    "selenium": "Selenium",
    "testing": "Software Testing / QA",
    "figma": "Figma",
    "ui/ux": "UI/UX Design",
    "prototyping": "Prototyping",
    "agile": "Agile Methodology",
    "scrum": "Scrum Framework",
    "jira": "Jira",
    "product management": "Product Management",
    "data analysis": "Data Analysis",
    "microservices": "Microservices"
}

SECTION_PATTERNS = {
    "contact": [
        r'\bcontact\b', r'\bemail\b', r'\bphone\b', r'\blinkedin\b', r'\bgithub\b', r'\baddress\b', r'\b\S+@\S+\.\S+\b'
    ],
    "summary": [
        r'\b(?:professional\s+)?summary\b', r'\bprofile\b', r'\bobjective\b', r'\babout\s+me\b', r'\boverview\b'
    ],
    "education": [
        r'\beducation\b', r'\bacademics?\b', r'\bdegree\b', r'\buniversity\b', r'\bcollege\b', r'\bbachelor\b', r'\bmaster\b', r'\bb\.?tech\b', r'\bm\.?tech\b', r'\bb\.?s\.?\b'
    ],
    "skills": [
        r'\bskills?\b', r'\btechnical\s+skills?\b', r'\btechnologies\b', r'\bcompetencies\b', r'\bexpertise\b'
    ],
    "projects": [
        r'\bprojects?\b', r'\bpersonal\s+projects?\b', r'\bkey\s+projects?\b', r'\bacademics?\s+projects?\b'
    ],
    "experience": [
        r'\b(?:work\s+)?experience\b', r'\bemployment\b', r'\bwork\s+history\b', r'\binternships?\b', r'\bcareer\b'
    ],
    "certifications": [
        r'\bcertifications?\b', r'\bcertificates?\b', r'\blicenses?\b', r'\bcertified\b'
    ],
    "achievements": [
        r'\bachievements?\b', r'\bawards?\b', r'\bhonors?\b', r'\baccomplishments?\b'
    ]
}

def analyze_resume_sections(raw_text: str) -> Dict[str, bool]:
    """
    Detects presence of key resume sections in the text.
    """
    text_lower = raw_text.lower()
    sections = {}
    for section_key, patterns in SECTION_PATTERNS.items():
        found = any(re.search(pattern, text_lower) for pattern in patterns)
        sections[section_key] = found
    return sections

def calculate_scores(detected_skills: List[str], raw_text: str, target_role: str) -> Dict[str, Any]:
    """
    Computes explainable scores:
      - Skill Score (40%)
      - Section Score (30%)
      - Job Match Score (20%)
      - Keyword Score (10%)
    Calculates final_score = (skill_score * 0.40) + (section_score * 0.30) + (job_match_score * 0.20) + (keyword_score * 0.10)
    """
    # Normalize detected skills to lower case set for lookup
    detected_set = {s.lower() for s in detected_skills}
    
    # Get target role required skills
    role_skills_lower = ROLE_SKILLS.get(target_role, ROLE_SKILLS["Frontend Developer"])
    
    matched_skills = []
    missing_skills = []
    
    for s_lower in role_skills_lower:
        canonical_name = CANONICAL_ROLE_SKILL_NAMES.get(s_lower, s_lower.title())
        # Check direct or partial match
        if s_lower in detected_set or any(s_lower in d for d in detected_set):
            matched_skills.append(canonical_name)
        else:
            missing_skills.append(canonical_name)
            
    # Job match percentage
    total_req = len(role_skills_lower)
    job_match_score = round((len(matched_skills) / total_req) * 100) if total_req > 0 else 50

    # Skill score (based on ratio of matched skills + total richness of skills detected)
    base_skill_ratio = len(matched_skills) / total_req if total_req > 0 else 0.5
    extra_skills_bonus = min(0.2, len(detected_skills) * 0.02)
    skill_score = min(100, round((base_skill_ratio * 0.8 + extra_skills_bonus) * 100))
    
    # Section score
    sections = analyze_resume_sections(raw_text)
    # Give higher weight to critical sections (contact, education, skills, experience, projects)
    core_sections = ["contact", "education", "skills", "experience", "projects"]
    optional_sections = ["summary", "certifications", "achievements"]
    
    core_count = sum(1 for sec in core_sections if sections.get(sec))
    opt_count = sum(1 for sec in optional_sections if sections.get(sec))
    
    section_score = round(((core_count / len(core_sections)) * 80) + ((opt_count / len(optional_sections)) * 20))

    # Keyword score (keyword density & presence of action verbs, impact numbers, tools)
    text_lower = raw_text.lower()
    keyword_matches = sum(1 for kw in role_skills_lower if kw in text_lower)
    has_numbers = bool(re.search(r'\b\d+(?:%|\+|\s*k|\s*m)?\b', text_lower))
    has_action_verbs = bool(re.search(r'\b(developed|built|managed|led|created|designed|implemented|optimized|increased|reduced)\b', text_lower))
    
    kw_ratio = keyword_matches / total_req if total_req > 0 else 0.5
    kw_base = kw_ratio * 70
    if has_numbers:
        kw_base += 15
    if has_action_verbs:
        kw_base += 15
    keyword_score = min(100, round(kw_base))

    # Final Score Formula (Section 15)
    final_score = round(
        (skill_score * 0.40) +
        (section_score * 0.30) +
        (job_match_score * 0.20) +
        (keyword_score * 0.10)
    )

    return {
        "resume_score": final_score,
        "skill_score": skill_score,
        "section_score": section_score,
        "job_match_score": job_match_score,
        "keyword_score": keyword_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "sections": sections
    }
