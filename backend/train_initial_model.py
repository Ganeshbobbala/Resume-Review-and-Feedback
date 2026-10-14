import os
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from services.text_processor import preprocess_text

# Sample dataset representing resume profiles for the 5 target job roles
TRAINING_DATA = [
    # Frontend Developer
    ("Frontend Developer with experience in HTML, CSS, JavaScript, React, TypeScript, Redux, Tailwind CSS, Next.js, Git, web performance, responsive UI design.", "Frontend Developer"),
    ("Senior Frontend Engineer specializing in React.js, JavaScript (ES6+), HTML5, CSS3, Vue.js, SASS, REST APIs, Git, UI/UX prototyping and Webpack.", "Frontend Developer"),
    ("Web Developer focused on frontend technology stack: HTML, CSS, JavaScript, React, Typescript, Jest, Bootstrap, Git version control.", "Frontend Developer"),
    ("Frontend Developer built responsive web applications using React, HTML5, Tailwind CSS, JavaScript, Redux Toolkit, Figma to Code integration.", "Frontend Developer"),
    
    # Backend Developer
    ("Backend Developer with experience in Python, Node.js, Express, SQL, PostgreSQL, MongoDB, REST API, Microservices, Docker, Git, AWS.", "Backend Developer"),
    ("Senior Software Engineer specialized in backend systems, Python, FastAPI, Django, PostgreSQL, Redis, RESTful API design, Linux, Git.", "Backend Developer"),
    ("Backend Engineer building scalable microservices using Node.js, Express, MongoDB, Docker, REST API, SQL databases, Git CI/CD pipelines.", "Backend Developer"),
    ("Python Backend Developer experienced in building web servers, REST APIs, FastAPI, SQL, ORM, MongoDB, system architecture and Git.", "Backend Developer"),
    
    # Java Developer
    ("Java Developer proficient in Java, Spring Boot, Spring MVC, SQL, JDBC, Hibernate, Microservices, Maven, REST API, Git, MySQL.", "Java Developer"),
    ("Senior Java Engineer with expertise in Java 17, Spring Boot, Hibernate ORM, SQL, PostgreSQL, Kafka, REST API design, Maven, Git.", "Java Developer"),
    ("Enterprise Java Developer building secure applications using Java, Spring, Spring Boot, SQL, JDBC, JUnit, Tomcat, Jenkins, Git.", "Java Developer"),
    ("Backend Java Developer specializing in Spring Boot, REST APIs, Microservices, SQL, JPA/Hibernate, Gradle, Git, Oracle DB.", "Java Developer"),
    
    # Data Scientist
    ("Data Scientist with expertise in Python, Pandas, NumPy, Scikit-learn, Machine Learning, Statistics, SQL, Matplotlib, Seaborn, Data Analysis.", "Data Scientist"),
    ("Senior Data Scientist specializing in exploratory data analysis, predictive modeling, Python, Pandas, SQL, Scikit-learn, Statistics, Tableau.", "Data Scientist"),
    ("Data Scientist experienced in statistical analysis, A/B testing, Python, Pandas, NumPy, Scikit-learn, SQL, data visualization, XGBoost.", "Data Scientist"),
    ("Applied Data Scientist using Python, SQL, Pandas, NumPy, Scikit-learn, Machine Learning, Statistical Inference, Jupyter Notebooks.", "Data Scientist"),
    
    # ML Engineer
    ("Machine Learning Engineer skilled in Python, TensorFlow, PyTorch, Scikit-learn, NumPy, Pandas, Model Deployment, MLOps, Deep Learning, Docker.", "ML Engineer"),
    ("Senior ML Engineer focused on deep neural networks, PyTorch, TensorFlow, Scikit-learn, Python, CUDA, Model optimization, MLOps, ONNX.", "ML Engineer"),
    ("ML Systems Engineer with experience in Python, Machine Learning, PyTorch, Scikit-learn, NumPy, Pandas, FastAPI model inference, Docker, Git.", "ML Engineer"),
    ("Artificial Intelligence & ML Engineer specializing in Machine Learning, Deep Learning, TensorFlow, PyTorch, Scikit-learn, Python, MLOps.", "ML Engineer")
]

def train_and_save_models():
    texts, labels = zip(*TRAINING_DATA)
    processed_texts = [preprocess_text(t) for t in texts]
    
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=1000)
    X = vectorizer.fit_transform(processed_texts)
    
    model = MultinomialNB()
    model.fit(X, labels)
    
    # Output directory path
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
    os.makedirs(models_dir, exist_ok=True)
    
    classifier_path = os.path.join(models_dir, "resume_classifier.pkl")
    vectorizer_path = os.path.join(models_dir, "tfidf_vectorizer.pkl")
    
    joblib.dump(model, classifier_path)
    joblib.dump(vectorizer, vectorizer_path)
    
    print(f"Successfully saved trained artifacts to:\n  - {classifier_path}\n  - {vectorizer_path}")

if __name__ == "__main__":
    train_and_save_models()

