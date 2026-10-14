import re
from typing import List, Set

# Comprehensive skill dictionary with regex boundary patterns
SKILL_PATTERNS = {
    # Frontend & Web
    "HTML": [r'\bhtml5?\b'],
    "CSS": [r'\bcss3?\b', r'\bsass\b', r'\bless\b', r'\btailwind\b', r'\bbootstrap\b'],
    "JavaScript": [r'\bjavascript\b', r'\bes6\b', r'\bjs\b'],
    "TypeScript": [r'\btypescript\b', r'\bts\b'],
    "React": [r'\breact(?:\.js|js)?\b'],
    "Next.js": [r'\bnext(?:\.js|js)?\b'],
    "Vue.js": [r'\bvue(?:\.js|js)?\b'],
    "Angular": [r'\bangular(?:\.js|js)?\b'],
    "Redux": [r'\bredux\b'],
    "Tailwind CSS": [r'\btailwind(?:\s*css)?\b'],
    
    # Backend & Programming Languages
    "Python": [r'\bpython3?\b'],
    "Node.js": [r'\bnode(?:\.js|js)?\b'],
    "Express": [r'\bexpress(?:\.js|js)?\b'],
    "Django": [r'\bdjango\b'],
    "FastAPI": [r'\bfastapi\b'],
    "Flask": [r'\bflask\b'],
    "Java": [r'\bjava\b(?!script)'],
    "Spring": [r'\bspring\b'],
    "Spring Boot": [r'\bspring\s*boot\b'],
    "Hibernate": [r'\bhibernate\b'],
    "JDBC": [r'\bjdbc\b'],
    "C++": [r'\bc\+\+\b', r'\bcpp\b'],
    "C#": [r'\bc\#\b', r'\bcsharp\b'],
    "PHP": [r'\bphp\b'],
    "Ruby": [r'\bruby\b', r'\brails\b'],
    
    # Mobile Development
    "Kotlin": [r'\bkotlin\b'],
    "Swift": [r'\bswift\b'],
    "Android": [r'\bandroid\b'],
    "iOS": [r'\bios\b', r'\bxcode\b'],
    
    # Databases & APIs
    "SQL": [r'\bsql\b', r'\bmysql\b', r'\bpostgresql\b', r'\bpostgres\b', r'\bsqlite\b', r'\boracle\b', r'\bmssql\b'],
    "MongoDB": [r'\bmongodb\b', r'\bmongo\b'],
    "Redis": [r'\bredis\b'],
    "REST API": [r'\brest(?:ful)?\s*(?:api|apis|services)?\b', r'\bweb\s*services\b'],
    "GraphQL": [r'\bgraphql\b'],
    "Microservices": [r'\bmicroservices?\b'],
    
    # Data Science, ML & Big Data
    "Pandas": [r'\bpandas\b'],
    "NumPy": [r'\bnumpy\b'],
    "Scikit-learn": [r'\bscikit[\s\-_]*learn\b', r'\bsklearn\b'],
    "TensorFlow": [r'\btensorflow\b', r'\btf\b'],
    "PyTorch": [r'\bpytorch\b'],
    "Machine Learning": [r'\bmachine\s*learning\b', r'\bml\b'],
    "Deep Learning": [r'\bdeep\s*learning\b', r'\bdl\b'],
    "Statistics": [r'\bstatistics\b', r'\bstatistical\b'],
    "Data Analysis": [r'\bdata\s*analysis\b', r'\bdata\s*analytics\b'],
    "Spark": [r'\bapache\s*spark\b', r'\bspark\b'],
    "Hadoop": [r'\bhadoop\b'],
    "Matplotlib": [r'\bmatplotlib\b'],
    "Seaborn": [r'\bseaborn\b'],
    
    # Cloud, DevOps & System Admin
    "Git": [r'\bgit\b', r'\bgithub\b', r'\bgitlab\b'],
    "Docker": [r'\bdocker\b'],
    "Kubernetes": [r'\bkubernetes\b', r'\bk8s\b'],
    "AWS": [r'\baws\b', r'\bamazon\s*web\s*services\b'],
    "Cloud": [r'\bcloud\b', r'\bazure\b', r'\bgcp\b'],
    "Linux": [r'\blinux\b', r'\bubuntu\b', r'\bbash\b'],
    "CI/CD": [r'\bci\s*\/\s*cd\b', r'\bcontinuous\s*integration\b'],
    "Networking": [r'\bnetworking\b', r'\btcp\s*\/\s*ip\b', r'\bdns\b'],
    "Cybersecurity": [r'\bcybersecurity\b', r'\bsecurity\b', r'\binformation\s*security\b'],
    
    # Testing & Quality Assurance
    "Selenium": [r'\bselenium\b'],
    "Testing": [r'\btesting\b', r'\bqa\b', r'\bunit\s*testing\b', r'\bautomation\s*testing\b'],
    
    # UI/UX & Design
    "Figma": [r'\bfigma\b'],
    "UI/UX": [r'\bui\s*\/\s*ux\b', r'\buser\s*experience\b', r'\buser\s*interface\b'],
    "Prototyping": [r'\bprototyping\b', r'\bwireframing\b'],
    
    # Product & Agile Management
    "Agile": [r'\bagile\b'],
    "Scrum": [r'\bscrum\b'],
    "Jira": [r'\bjira\b'],
    "Product Management": [r'\bproduct\s*management\b', r'\bproduct\s*roadmap\b']
}

def extract_skills(raw_text: str) -> List[str]:
    """
    Extracts canonical skill names from raw resume text.
    Returns a sorted list of unique detected skills formatted nicely.
    """
    if not raw_text:
        return []
        
    text_lower = raw_text.lower()
    detected: Set[str] = set()
    
    for skill_name, patterns in SKILL_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, text_lower):
                detected.add(skill_name)
                break
                
    return sorted(list(detected))
