import os
import fitz  # PyMuPDF

def create_resume_pdf(filename: str, title: str, text_blocks: list[str]):
    doc = fitz.open()
    page = doc.new_page(width=595, height=842) # A4 size
    
    y = 50
    # Title / Header
    page.insert_text((50, y), title, fontsize=20, fontname="helv", color=(0.1, 0.1, 0.4))
    y += 40
    
    for block in text_blocks:
        rect = fitz.Rect(50, y, 545, y + 150)
        rc = page.insert_textbox(rect, block, fontsize=11, fontname="helv", color=(0.2, 0.2, 0.2))
        y += 75
        
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    doc.save(filename)
    doc.close()
    print(f"Sample PDF created: {filename}")

if __name__ == "__main__":
    samples_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "sample_resumes"))
    
    # 1. Frontend Resume
    frontend_text = [
        "Alex Morgan\nEmail: alex.morgan@example.com | Phone: +1 555-0199 | Location: San Francisco, CA | GitHub: github.com/alexmorgan",
        "PROFESSIONAL SUMMARY\nCreative Frontend Developer with 3+ years of experience building modern, responsive web applications using React, HTML5, CSS3, JavaScript, and Tailwind CSS. Passionate about UI/UX performance.",
        "WORK EXPERIENCE\nFrontend Developer | TechCorp Solutions (2022 - Present)\n- Developed 12+ responsive web dashboards using React, JavaScript (ES6), HTML, and CSS.\n- Optimized web performance, reducing page load time by 35%.\n- Collaborated with design teams using Git for version control.",
        "EDUCATION\nBachelor of Science in Computer Science | University of California (2018 - 2022)",
        "TECHNICAL SKILLS\nSkills: HTML, CSS, JavaScript, React, SQL, Git, Tailwind CSS, REST API",
        "PROJECTS\nPortfolio Showcase Website: Built with React, HTML, CSS and REST API backend."
    ]
    create_resume_pdf(os.path.join(samples_dir, "sample_frontend_resume.pdf"), "ALEX MORGAN - FRONTEND DEVELOPER", frontend_text)

    # 2. Data Scientist Resume
    ds_text = [
        "Dr. Sarah Chen\nEmail: sarah.chen@example.com | Phone: +1 555-0288 | LinkedIn: linkedin.com/in/sarahchen",
        "PROFESSIONAL SUMMARY\nData Scientist with expertise in predictive modeling, statistical analysis, and machine learning. Skilled in Python, Pandas, NumPy, Scikit-learn, SQL, and data visualization.",
        "WORK EXPERIENCE\nData Scientist | Analytics Corp (2021 - Present)\n- Built machine learning models with Python, Scikit-learn, and Pandas achieving 92% prediction accuracy.\n- Processed large SQL database queries and performed statistical analysis on customer churn data.",
        "EDUCATION\nMaster of Science in Data Science | Stanford University (2019 - 2021)",
        "TECHNICAL SKILLS\nSkills: Python, Pandas, NumPy, Scikit-learn, Machine Learning, Statistics, SQL, Matplotlib",
        "PROJECTS\nCustomer Churn Prediction Model: Implemented random forest classifier using Scikit-learn, Pandas, and Python."
    ]
    create_resume_pdf(os.path.join(samples_dir, "sample_datascience_resume.pdf"), "DR. SARAH CHEN - DATA SCIENTIST", ds_text)

