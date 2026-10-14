import re
import string

def preprocess_text(text: str) -> str:
    """
    Standard text preprocessing routine used for both training and inference.
    - Converts text to lowercase
    - Removes URLs, emails, phone numbers, and non-printable characters
    - Normalizes punctuation and extra whitespace
    """
    if not text:
        return ""
    
    # Lowercase
    text = text.lower()
    
    # Remove URLs
    text = re.sub(r'https?://\S+|www\.\S+', ' ', text)
    
    # Remove email addresses
    text = re.sub(r'\S+@\S+', ' ', text)
    
    # Remove phone numbers / numeric sequences with dashes/parentheses
    text = re.sub(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', ' ', text)
    
    # Replace newlines and tabs with space
    text = re.sub(r'[\r\n\t]+', ' ', text)
    
    # Remove bullet points and special symbols, keeping alphanumeric and basic spaces
    text = re.sub(r'[^a-z0-9\s\#\+\.\-]', ' ', text)
    
    # Normalize multiple spaces into single space
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

