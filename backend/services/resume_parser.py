import fitz  # PyMuPDF
from typing import Tuple

def extract_text_from_pdf(file_bytes: bytes) -> Tuple[str, str | None]:
    """
    Extracts raw text from PDF bytes using PyMuPDF (fitz).
    Returns (extracted_text, error_message).
    If extraction succeeds, error_message is None.
    """
    if not file_bytes:
        return "", "Uploaded PDF file is empty (0 bytes)."
        
    try:
        # Open PDF document from memory stream
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        
        if doc.page_count == 0:
            return "", "PDF file contains no pages."
            
        text_content = []
        for page_num in range(doc.page_count):
            page = doc.load_page(page_num)
            text = page.get_text("text")
            if text:
                text_content.append(text)
                
        full_text = "\n".join(text_content).strip()
        doc.close()
        
        if not full_text:
            return "", "Could not extract readable text from this PDF. It may be a scanned image or empty."
            
        return full_text, None
        
    except Exception as e:
        return "", f"Failed to parse PDF document: {str(e)}"

