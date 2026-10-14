import urllib.request
import urllib.parse
import json
import os

def test_live_api():
    url = "http://127.0.0.1:8000/analyze-resume"
    pdf_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "sample_resumes", "sample_frontend_resume.pdf"))
    
    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
    
    with open(pdf_path, "rb") as f:
        pdf_bytes = f.read()
        
    body = []
    # File part
    body.append(f"--{boundary}".encode())
    body.append(b'Content-Disposition: form-data; name="file"; filename="sample_frontend_resume.pdf"')
    body.append(b'Content-Type: application/pdf')
    body.append(b'')
    body.append(pdf_bytes)
    
    # Target role part
    body.append(f"--{boundary}".encode())
    body.append(b'Content-Disposition: form-data; name="target_role"')
    body.append(b'')
    body.append(b'Frontend Developer')
    body.append(f"--{boundary}--".encode())
    body.append(b'')
    
    payload = b"\r\n".join(body)
    
    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST"
    )
    
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        print("REAL-TIME RESPONSE RECEIVED FROM LIVE FASTAPI SERVER:")
        print(f"  - Target Role: {data['target_role']}")
        print(f"  - Predicted Category: {data['predicted_category']}")
        print(f"  - Resume Score: {data['resume_score']} / 100")
        print(f"  - Job Match Score: {data['job_match_score']}%")
        print(f"  - Skills Detected: {data['detected_skills']}")
        print(f"  - Matched Skills: {data['matched_skills']}")
        print(f"  - Missing Skills: {data['missing_skills']}")

if __name__ == "__main__":
    test_live_api()

