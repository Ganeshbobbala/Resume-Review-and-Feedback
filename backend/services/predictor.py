import os
import warnings
import joblib
from services.text_processor import preprocess_text

# Suppress scikit-learn version mismatch warnings during unpickling
warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")

class ResumePredictor:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.is_loaded = False
        self.load_models()

    def load_models(self):
        # Locate model files in root /models directory
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        models_dir = os.path.join(base_dir, "models")
        
        classifier_path = os.path.join(models_dir, "resume_classifier.pkl")
        vectorizer_path = os.path.join(models_dir, "tfidf_vectorizer.pkl")

        if not os.path.exists(classifier_path) or not os.path.exists(vectorizer_path):
            print(f"Warning: Model files missing in {models_dir}")
            return

        try:
            self.model = joblib.load(classifier_path)
            self.vectorizer = joblib.load(vectorizer_path)
            self.is_loaded = True
            print(f"ML Model ({type(self.model).__name__}) and TF-IDF Vectorizer successfully connected.")
        except Exception as e:
            print(f"Error loading model artifacts: {e}")
            self.is_loaded = False

    def predict(self, raw_text: str) -> str:
        if not self.is_loaded:
            return "General / Uncategorized"

        cleaned_text = preprocess_text(raw_text)
        if not cleaned_text:
            return "General / Uncategorized"

        try:
            features = self.vectorizer.transform([cleaned_text])
            prediction = self.model.predict(features)[0]
            
            # Format prediction string (e.g. INFORMATION-TECHNOLOGY -> Information Technology)
            raw_pred = str(prediction).strip()
            formatted_pred = raw_pred.replace("-", " ").replace("_", " ").title()
            return formatted_pred
        except Exception as e:
            print(f"Prediction execution error: {e}")
            return "General / Uncategorized"

# Global singleton predictor instance
predictor_service = ResumePredictor()
