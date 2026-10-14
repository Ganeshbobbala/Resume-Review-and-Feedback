import os
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_frontend_resume_analysis():
    sample_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "sample_resumes", "sample_frontend_resume.pdf"))
    with open(sample_path, "rb") as f:
        response = client.post(
            "/analyze-resume",
            files={"file": ("sample_frontend_resume.pdf", f, "application/pdf")},
            data={"target_role": "Frontend Developer"}
        )
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    print("\n--- FRONTEND RESUME TEST (WITH TARGET ROLE) ---")
    print(f"Target Role: {data['target_role']} (Mode: {data['analysis_mode']})")
    print(f"Predicted Category: {data['predicted_category']}")
    print(f"Resume Score: {data['resume_score']} / 100")

def test_without_target_role_analysis():
    sample_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "sample_resumes", "sample_frontend_resume.pdf"))
    with open(sample_path, "rb") as f:
        response = client.post(
            "/analyze-resume",
            files={"file": ("sample_frontend_resume.pdf", f, "application/pdf")},
            data={"target_role": ""}
        )
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    print("\n--- RESUME TEST (WITHOUT TARGET ROLE / AUTO-DETECT) ---")
    print(f"Auto-Detected Role: {data['target_role']} (Mode: {data['analysis_mode']})")
    print(f"Resume Score: {data['resume_score']} / 100")

def test_job_description_matcher():
    sample_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "sample_resumes", "sample_frontend_resume.pdf"))
    jd_text = """
    We are looking for a Senior React Frontend Developer with experience in JavaScript, HTML5, CSS3,
    TypeScript, Tailwind CSS, Docker, AWS, and Git. You will build high performance web dashboards
    and integrate REST APIs.
    """
    with open(sample_path, "rb") as f:
        response = client.post(
            "/match-job",
            files={"file": ("sample_frontend_resume.pdf", f, "application/pdf")},
            data={"job_description": jd_text}
        )
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    print("\n--- JOB DESCRIPTION MATCHER TEST ---")
    print(f"Job Match Score: {data['match_score']}%")
    print(f"Skill Match: {data['skill_match']}%")
    print(f"Keyword Match: {data['keyword_match']}%")
    print(f"Matched Skills: {data['matched_skills']}")
    print(f"Missing Skills: {data['missing_skills']}")

def test_format_analyzer():
    sample_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "sample_resumes", "sample_frontend_resume.pdf"))
    with open(sample_path, "rb") as f:
        response = client.post(
            "/analyze-format",
            files={"file": ("sample_frontend_resume.pdf", f, "application/pdf")}
        )
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    print("\n--- RESUME FORMAT ANALYZER TEST ---")
    print(f"Format Score: {data['format_score']} / 100")
    print(f"Pages: {data['pages']}")
    print(f"Contact Info: {data['contact']}")
    print(f"Bullet Analysis: {data['bullet_analysis']}")
    print(f"Quantification: {data['quantification']}")

if __name__ == "__main__":
    test_frontend_resume_analysis()
    test_without_target_role_analysis()
    test_job_description_matcher()
    test_format_analyzer()
    print("\n[SUCCESS] All API Integration Tests (Analysis with/without role, Job Matcher, Format Analyzer) Passed Successfully!")
