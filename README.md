# Resume Reviewer with AI-Powered Feedback — Full-Stack Dashboard

A production-quality full-stack web application designed to evaluate software engineering and data science resumes against target job roles. Features explainable scoring algorithms, machine learning role classification, skill extraction, ATS structural analysis, and dynamic actionable recommendations.

---

## 🚀 Features

- **PDF Resume Upload & Text Extraction**: High-performance text parsing using PyMuPDF (`pymupdf`/`fitz`).
- **Trained Machine Learning Model**: Machine Learning category predictor using TF-IDF vectorization and joblib artifacts (`resume_classifier.pkl` & `tfidf_vectorizer.pkl`).
- **Explainable Resume Scoring (0–100)**: Transparent scoring engine based on:
  - **Skill Score (40%)**: Coverage and richness of technical skills.
  - **Resume Structure (30%)**: Verification of core resume sections (Contact, Summary, Education, Skills, Projects, Experience, Certifications, Achievements).
  - **Job Match (20%)**: Target role specific skill requirements match.
  - **Keyword Coverage (10%)**: ATS keyword density, metric quantization, and action verbs.
- **Dynamic Feedback Generation**:
  - **Detected Skills**: Real-time extraction of technical skills.
  - **Job-Role Skill Matching**: Role-based matched vs. missing skills for 5 key technical tracks (Frontend Developer, Backend Developer, Java Developer, Data Scientist, ML Engineer).
  - **Strengths & Weaknesses**: Dynamic bulleted analysis.
  - **Actionable Recommendations**: Numbered improvement steps customized per candidate.
- **Modern SaaS Dashboard UI**: Built with React, Vite, Tailwind CSS, Lucide React icons, featuring circular score gauges, progress bars, and step-by-step loading state.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js 18 + Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend
- **Framework**: Python 3 + FastAPI
- **Web Server**: Uvicorn
- **PDF Extraction**: PyMuPDF (`fitz`)
- **Machine Learning**: Scikit-Learn, Joblib, NumPy, Pandas, NLTK

### Machine Learning Artifacts
- `models/resume_classifier.pkl`: Pre-trained classifier
- `models/tfidf_vectorizer.pkl`: Pre-trained TF-IDF vectorizer

---

## 📁 Project Structure

```text
Resume Reviewer/
├── models/
│   ├── resume_classifier.pkl
│   └── tfidf_vectorizer.pkl
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── train_initial_model.py
│   ├── test_api_endpoint.py
│   └── services/
│       ├── __init__.py
│       ├── resume_parser.py
│       ├── text_processor.py
│       ├── predictor.py
│       ├── skill_extractor.py
│       ├── scorer.py
│       └── feedback.py
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ResumeUpload.jsx
│       │   ├── RoleSelector.jsx
│       │   ├── ScoreCard.jsx
│       │   ├── SkillsCard.jsx
│       │   ├── JobMatchCard.jsx
│       │   ├── ResumeSectionsCard.jsx
│       │   ├── StrengthsCard.jsx
│       │   ├── WeaknessesCard.jsx
│       │   ├── RecommendationsCard.jsx
│       │   └── LoadingState.jsx
│       └── services/
│           └── api.js
│
└── README.md
```

---

## ⚙️ Running the Application

### 1. Backend Setup

```bash
cd backend

# Create virtual environment (if not already created)
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Install backend dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload --port 8000
```

FastAPI server runs at: `http://127.0.0.1:8000`  
Swagger API Docs available at: `http://127.0.0.1:8000/docs`

### 2. Frontend Setup

Open a new terminal tab/window:

```bash
cd frontend

# Install node dependencies
npm install

# Start Vite dev server
npm run dev
```

Frontend app runs at: `http://localhost:5173`

---

## 📊 API Specification

### `POST /analyze-resume`

**Request**:
- `file`: PDF document (Multipart Form Data, up to 10 MB)
- `target_role`: String (`Frontend Developer`, `Backend Developer`, `Java Developer`, `Data Scientist`, `ML Engineer`)

**Response**:
```json
{
  "predicted_category": "Frontend Developer",
  "target_role": "Frontend Developer",
  "resume_score": 85,
  "skill_score": 83,
  "section_score": 87,
  "job_match_score": 83,
  "keyword_score": 80,
  "detected_skills": ["CSS", "Git", "HTML", "JavaScript", "REST API", "React", "SQL", "Tailwind CSS"],
  "matched_skills": ["HTML", "CSS", "JavaScript", "React", "Git"],
  "missing_skills": ["TypeScript"],
  "sections": {
    "contact": true,
    "summary": true,
    "education": true,
    "skills": true,
    "projects": true,
    "experience": true,
    "certifications": false,
    "achievements": false
  },
  "strengths": [
    "Strong coverage for target role core skills (5 matched out of 6)",
    "Dedicated Projects section highlighting practical technical implementation",
    "Clear educational qualification details included"
  ],
  "weaknesses": [
    "Missing key skills commonly required for Frontend Developer (TypeScript)",
    "No certifications or specialized technical credentials detected"
  ],
  "recommendations": [
    "Add key role-specific technical skills if applicable: TypeScript.",
    "Optimize your resume for ATS by embedding relevant Frontend Developer keywords in your project bullet points."
  ]
}
```

