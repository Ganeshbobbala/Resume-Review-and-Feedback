import re
from typing import List, Dict, Any

STRONG_ACTION_VERBS = [
    "architected", "automated", "built", "created", "delivered", "deployed",
    "designed", "developed", "engineered", "implemented", "improved", "increased",
    "integrated", "launched", "led", "managed", "migrated", "modeled",
    "optimized", "orchestrated", "refactored", "resolved", "reduced", "scaled",
    "spearheaded", "standardized", "streamlined", "transformed"
]

WEAK_PASSIVE_PHRASES = [
    ("worked on", "Engineered / Implemented"),
    ("responsible for", "Spearheaded / Managed"),
    ("helped with", "Collaborated to deliver / Accelerated"),
    ("assisted in", "Co-authored / Implemented"),
    ("handled", "Orchestrated / Resolved"),
    ("did", "Executed / Built"),
    ("made", "Constructed / Developed"),
    ("participated in", "Contributed to / Drove")
]

ROLE_PLAYBOOKS = {
    "Frontend Developer": {
        "priority_focus": "Component Architecture, State Management & Web Performance",
        "key_metrics_advice": "Highlight Core Web Vitals, page speed reduction, bundle size optimization, and responsive design metrics.",
        "must_have_concepts": ["Component Lifecycle & Hooks", "State Management (Redux/Zustand)", "Performance Optimization", "REST/GraphQL Integration", "Accessible UI (a11y)"],
        "bullet_examples": [
            "Architected responsive dashboard using React and Tailwind CSS, decreasing initial page load time by 34% for 150k+ monthly active users.",
            "Engineered reusable UI component library with TypeScript and Storybook, reducing sprint development cycle time by 25% across 3 engineering teams.",
            "Integrated complex state management and GraphQL API queries, eliminating redundant network calls by 40%."
        ]
    },
    "Backend Developer": {
        "priority_focus": "System Scalability, API Throughput & Database Performance",
        "key_metrics_advice": "Quantify queries per second (QPS), latency reduction (p95/p99), database query optimization, and test coverage.",
        "must_have_concepts": ["RESTful / gRPC API Design", "Database Indexing & Query Tuning", "Authentication & Security (OAuth/JWT)", "Caching (Redis/Memcached)", "Automated Unit & Integration Testing"],
        "bullet_examples": [
            "Designed and implemented high-throughput REST APIs using Python FastAPI and PostgreSQL, scaling system capacity to 4,500+ requests/sec with 99.9% uptime.",
            "Optimized legacy SQL database queries and introduced Redis caching layer, dropping average p99 endpoint latency from 420ms to 85ms.",
            "Engineered secure microservices architecture with Docker and Kubernetes, achieving 94% automated test coverage across all core services."
        ]
    },
    "Full Stack Developer": {
        "priority_focus": "End-to-End Product Delivery & Cloud Deployment",
        "key_metrics_advice": "Demonstrate complete ownership from client-side interfaces to server-side business logic and cloud pipelines.",
        "must_have_concepts": ["Full Lifecycle Architecture", "Database Schema Modeling", "API & State Synchronization", "CI/CD Pipeline Automation", "Cloud Infrastructure (AWS/GCP/Vercel)"],
        "bullet_examples": [
            "Delivered end-to-end SaaS platform using React, Node.js, and MongoDB, scaling from initial beta launch to 10,000+ active subscriptions within 6 months.",
            "Streamlined deployment workflows by setting up automated GitHub Actions CI/CD pipelines, cutting deployment downtime by 80%.",
            "Built interactive customer portal with secure Stripe payment gateway and real-time WebSocket notifications."
        ]
    },
    "Data Scientist": {
        "priority_focus": "Statistical Modeling, Business Insights & Algorithm Performance",
        "key_metrics_advice": "Include dataset volumes, model validation metrics (AUC-ROC, F1, RMSE), and direct business revenue/cost impact.",
        "must_have_concepts": ["Exploratory Data Analysis", "Feature Engineering", "Supervised/Unsupervised ML", "Data Storytelling & Dashboards", "A/B Testing & Hypothesis Testing"],
        "bullet_examples": [
            "Engineered customer churn prediction model using Scikit-Learn and XGBoost, achieving an 89% F1-score and identifying $120k in at-risk revenue.",
            "Analyzed 2.5M+ transaction records using Python and Pandas, surfacing key user conversion bottlenecks and driving an 18% lift in checkout conversion.",
            "Built interactive Tableau dashboard tracking real-time KPI metrics, adopted by 4 executive teams for strategic quarterly planning."
        ]
    },
    "ML Engineer": {
        "priority_focus": "Model Productionization, Training Pipelines & Inference Latency",
        "key_metrics_advice": "Highlight training throughput, GPU/CPU optimization, inference latency, and MLOps tracking tools (MLflow/Docker).",
        "must_have_concepts": ["MLOps & Model Versioning", "Distributed Training / Fine-Tuning", "Low-Latency Model Serving (Triton/TorchServe)", "Feature Stores", "Data Pipeline Scalability"],
        "bullet_examples": [
            "Deployed production NLP classification pipeline utilizing PyTorch and FastAPI, reducing token inference latency to under 30ms.",
            "Built automated model retraining pipeline with MLflow and Docker, accelerating model deployment cycles from 2 weeks to 2 hours.",
            "Fine-tuned transformer models on 500k+ customer support tickets, achieving 93% classification accuracy for automated routing."
        ]
    },
    "DevOps Engineer": {
        "priority_focus": "Infrastructure as Code, Zero-Downtime Releases & Reliability",
        "key_metrics_advice": "Focus on MTTR (Mean Time to Resolution), deployment frequency, infrastructure cost savings, and uptime SLOs.",
        "must_have_concepts": ["Infrastructure as Code (Terraform)", "Container Orchestration (Kubernetes)", "CI/CD Automation", "Cloud Security & IAM", "Observability (Prometheus/Grafana)"],
        "bullet_examples": [
            "Provisioned resilient cloud infrastructure across AWS using Terraform and Docker, reducing monthly cloud infrastructure spend by 22%.",
            "Orchestrated Kubernetes clusters managing 60+ microservice pods with automated horizontal pod autoscaling (HPA) during peak traffic.",
            "Established comprehensive monitoring and alert system with Prometheus and Grafana, lowering MTTR by 45% during critical incidents."
        ]
    }
}

DEFAULT_PLAYBOOK = {
    "priority_focus": "Demonstrated Technical Problem Solving & Measurable Business Impact",
    "key_metrics_advice": "Quantify outcomes with percentages, user numbers, latency improvements, or cost reductions.",
    "must_have_concepts": ["Core Technical Skills", "Hands-on Projects", "Measurable Results", "Clean Architecture", "Collaboration & Version Control"],
    "bullet_examples": [
        "Spearheaded technical development of core system features, enhancing application responsiveness by 28% and user satisfaction by 4.8/5.",
        "Collaborated with cross-functional product and design teams to launch key user-facing capabilities on schedule.",
        "Refactored legacy codebase, eliminating 15+ recurring bugs and increasing automated test coverage by 30%."
    ]
}

def generate_feedback(
    raw_text: str,
    target_role: str,
    detected_skills: List[str],
    matched_skills: List[str],
    missing_skills: List[str],
    sections: Dict[str, bool],
    scores: Dict[str, int]
) -> Dict[str, Any]:
    """
    Generates dynamic, deep, and multi-dimensional feedback:
      - Strengths & Weaknesses
      - Numbered Recommendations
      - Action Verbs Analysis (strong verbs found vs weak phrases detected with rewrite advice)
      - Quantification & Metric Density Analysis
      - Categorized Checklist (Critical / Recommended / Polish)
      - Role-Tailored Engineering Playbook with Before & After examples
    """
    text_lower = raw_text.lower()
    lines = [line.strip() for line in raw_text.split("\n") if line.strip()]

    # 1. Strengths
    strengths = []
    if len(matched_skills) >= len(missing_skills) and len(matched_skills) > 0:
        strengths.append(f"Strong coverage for target role core skills ({len(matched_skills)} matched out of {len(matched_skills) + len(missing_skills)})")
    elif len(detected_skills) >= 5:
        strengths.append(f"Broad technical skill set with {len(detected_skills)} detected skills")
        
    if sections.get("projects"):
        strengths.append("Dedicated Projects section highlighting practical technical implementation")
    if sections.get("education"):
        strengths.append("Clear educational qualification details included")
    if sections.get("experience"):
        strengths.append("Professional work experience section detected")
    if sections.get("summary"):
        strengths.append("Includes a professional summary section introducing your candidate value proposition")
        
    metric_matches = re.findall(r'\b\d+(?:%|\+|\s*k|\s*m)?\b', text_lower)
    if metric_matches:
        strengths.append(f"Contains quantitative metrics and measurable outcomes ({len(metric_matches)} data points detected)")
    if len(strengths) == 0:
        strengths.append("Basic resume structure is present and readable")

    # 2. Weaknesses
    weaknesses = []
    if missing_skills:
        missing_str = ", ".join(missing_skills[:3])
        weaknesses.append(f"Missing core skills commonly expected for {target_role} ({missing_str})")
        
    if not metric_matches:
        weaknesses.append("Resume lacks measurable metrics, statistics, or quantified business impact")
    if not sections.get("summary"):
        weaknesses.append("Professional Summary section is missing at the top of the resume")
    if not sections.get("certifications"):
        weaknesses.append("No technical certifications or specialized credentials detected")
    if not sections.get("projects"):
        weaknesses.append("No explicit Projects section detected to demonstrate applied technical skills")
    if not sections.get("achievements"):
        weaknesses.append("Key achievements or honors section is absent")

    # 3. Action Verbs Analysis
    detected_strong_verbs = []
    for verb in STRONG_ACTION_VERBS:
        if re.search(r'\b' + verb + r'\b', text_lower):
            detected_strong_verbs.append(verb.capitalize())

    detected_weak_phrases = []
    for weak_p, suggestion in WEAK_PASSIVE_PHRASES:
        if re.search(r'\b' + weak_p + r'\b', text_lower):
            detected_weak_phrases.append({
                "phrase": weak_p,
                "suggestion": suggestion
            })

    # 4. Quantification & Metric Density Analysis
    bullet_lines = [
        line for line in lines
        if line.startswith(('•', '-', '*', '1.', '2.', '3.')) or len(line) > 35
    ]
    total_bullets = max(len(bullet_lines), 1)
    quantified_bullets = sum(1 for b in bullet_lines if re.search(r'\b\d+(?:%|\+|\$|\s*k|\s*m)?\b', b.lower()))
    quant_density = round((quantified_bullets / total_bullets) * 100)

    if quant_density >= 40:
        quant_rating = "Excellent"
        quant_feedback = "Your resume demonstrates strong business impact with ample metrics and data points."
    elif quant_density >= 20:
        quant_rating = "Moderate"
        quant_feedback = "You have some quantified achievements, but adding metrics to 2-3 more bullet points will significantly boost recruiter callbacks."
    else:
        quant_rating = "Low"
        quant_feedback = "Most statements describe responsibilities rather than outcomes. Quantify your work with %, numbers, scale, or time saved."

    # 5. Categorized Action Checklist (Critical, Recommended, Polish)
    checklist = {
        "critical": [],
        "recommended": [],
        "polishing": []
    }

    if missing_skills:
        checklist["critical"].append({
            "title": f"Integrate Missing Core Skills ({len(missing_skills)})",
            "desc": f"Add {', '.join(missing_skills[:4])} to project descriptions or technical skills.",
            "impact": "+15–20% ATS Match"
        })
    if quant_density < 25:
        checklist["critical"].append({
            "title": "Quantify Achievements with Numbers & %",
            "desc": "Use the Google XYZ Formula: 'Accomplished [X], as measured by [Y], by doing [Z]'.",
            "impact": "+25% Recruiter Response"
        })
    if not sections.get("summary"):
        checklist["critical"].append({
            "title": "Add a 2–3 Sentence Professional Summary",
            "desc": f"State your primary tech stack, target role ({target_role}), and top 2 key achievements.",
            "impact": "+10% First-Impression Score"
        })

    if detected_weak_phrases:
        checklist["recommended"].append({
            "title": f"Replace {len(detected_weak_phrases)} Passive Phrases with Action Verbs",
            "desc": f"Replace phrases like '{detected_weak_phrases[0]['phrase']}' with '{detected_weak_phrases[0]['suggestion']}'.",
            "impact": "Executive Presence"
        })
    if scores.get("keyword_score", 0) < 75:
        checklist["recommended"].append({
            "title": "Enhance ATS Keyword Density in Project Bullets",
            "desc": f"Ensure your project bullets explicitly mention {target_role} tools and frameworks in context.",
            "impact": "High ATS Ranking"
        })
    if not sections.get("projects"):
        checklist["recommended"].append({
            "title": "Include 2-3 Technical Projects with Live Links",
            "desc": "Demonstrate end-to-end execution with GitHub or live deployment links.",
            "impact": "Practical Credibility"
        })

    if not sections.get("certifications"):
        checklist["polishing"].append({
            "title": "Add Relevant Technical Certifications",
            "desc": f"Highlight recognized credentials (e.g. AWS, Meta, Google, Coursera) relevant to {target_role}.",
            "impact": "Competitive Edge"
        })
    if not sections.get("achievements"):
        checklist["polishing"].append({
            "title": "Showcase Key Achievements or Awards",
            "desc": "Include hackathons, honors, open-source contributions, or academic distinctions.",
            "impact": "Standout Factor"
        })

    # 6. Role Playbook & Before/After Examples
    playbook = ROLE_PLAYBOOKS.get(target_role, DEFAULT_PLAYBOOK)

    # 7. Recommendations (Numbered List)
    recommendations = []
    if missing_skills:
        recommendations.append(f"Add key role-specific technical skills: {', '.join(missing_skills)}.")
    if quant_density < 30:
        recommendations.append("Quantify your project and work achievements using numbers, percentages, and business impact.")
    if detected_weak_phrases:
        recommendations.append(f"Replace passive phrases (like '{detected_weak_phrases[0]['phrase']}') with decisive action verbs like 'Architected', 'Implemented', or 'Optimized'.")
    if not sections.get("summary"):
        recommendations.append(f"Add a concise 2-3 sentence Professional Summary tailored specifically for a {target_role} position.")
    if not sections.get("certifications"):
        recommendations.append(f"Obtain and showcase recognized certifications for {target_role} to validate your expertise.")
    if not sections.get("projects"):
        recommendations.append("Add a dedicated Projects section with 2-3 highlighted projects detailing the technical stack and problem solved.")

    return {
        "strengths": strengths,
        "weaknesses": weaknesses,
        "recommendations": recommendations,
        "detailed_feedback": {
            "action_verbs": {
                "strong_count": len(detected_strong_verbs),
                "strong_detected": detected_strong_verbs[:10],
                "weak_count": len(detected_weak_phrases),
                "weak_detected": detected_weak_phrases
            },
            "quantification": {
                "density_percentage": quant_density,
                "quantified_bullets": quantified_bullets,
                "total_bullets": total_bullets,
                "rating": quant_rating,
                "advice": quant_feedback
            },
            "checklist": checklist,
            "playbook": {
                "target_role": target_role,
                "priority_focus": playbook["priority_focus"],
                "key_metrics_advice": playbook["key_metrics_advice"],
                "must_have_concepts": playbook["must_have_concepts"],
                "bullet_examples": playbook["bullet_examples"]
            }
        }
    }

def generate_bullet_rewrites(bullet_text: str, target_role: str) -> List[Dict[str, str]]:
    """
    Generates 3 professional AI-enhanced bullet point variations following the Google XYZ formula:
    1. Impact & Scale Focused
    2. Architecture & Design Focused
    3. Performance & Efficiency Focused
    """
    clean_bullet = re.sub(r'^[•\-\*\d\.\s]+', '', bullet_text.strip())
    
    # Strip common leading weak phrases
    for weak_p, _ in WEAK_PASSIVE_PHRASES:
        clean_bullet = re.sub(r'^' + weak_p + r'\s+', '', clean_bullet, flags=re.IGNORECASE)

    role_key = target_role if target_role in ROLE_PLAYBOOKS else "Frontend Developer"
    playbook = ROLE_PLAYBOOKS.get(role_key, DEFAULT_PLAYBOOK)
    
    return [
        {
            "style": "High-Impact & Measurable Outcome",
            "tag": "Recommended for Senior Roles",
            "text": f"Architected and executed {clean_bullet}, improving overall system efficiency by 28% and supporting 50k+ active users."
        },
        {
            "style": "Technical Architecture & Scale",
            "tag": "Best for Engineering Credibility",
            "text": f"Engineered scalable solution for {clean_bullet} using modern {role_key} best practices, reducing latency by 35% with 99.9% uptime."
        },
        {
            "style": "Process Optimization & Delivery",
            "tag": "Best for Collaborative Impact",
            "text": f"Spearheaded {clean_bullet} across cross-functional sprints, cutting feature delivery turnaround time by 30%."
        }
    ]
