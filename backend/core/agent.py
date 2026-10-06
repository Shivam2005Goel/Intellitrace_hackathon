import os
import json
from groq import Groq

def get_client() -> Groq | None:
    from dotenv import load_dotenv
    load_dotenv()
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or api_key == "your_key_here":
        return None
    try:
        return Groq(api_key=api_key)
    except Exception as e:
        print(f"Failed to initialize Groq Client: {e}")
        return None

def extract_invoice_json(raw_text: str) -> dict | None:
    """Uses Groq to read messy OCR text and strictly enforce JSON output."""
    client = get_client()
    if not client:
        return None
        
    prompt = f"""
    You are a professional invoice data extractor. Read this raw text from a document and cleanly extract all known entities. 
    If a field is missing, make a highly educated guess. If completely absent, use zero for numbers and empty strings for text.
    Return ONLY a valid JSON object with the following keys:
    - supplier: Name of the selling company
    - supplier_id: Lowercase Snake-case version of the supplier name
    - buyer: Name of the buying company
    - buyer_id: Lowercase Snake-case version of the buyer name
    - amount: Total monetary value of the invoice (float)
    - items: List of physical goods being transported (list of strings)
    - origin: City where the shipment originated
    - destination: City where the shipment is heading
    - transport_mode: One of: sea, air, road, rail
    - claimed_days: Total estimated or claimed delivery time in days (float)
    - quantity: Weight or count of goods (float)
    - po_date: Purchase Order date YYYY-MM-DD
    - invoice_date: Invoice date YYYY-MM-DD
    - finance_request_date: Date financing was requested YYYY-MM-DD
    - grn_date: Goods Receipt Note date YYYY-MM-DD
    
    RAW TEXT:
    {raw_text}
    """
    
    try:
        completion = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        if completion.choices[0].message.content:
            return json.loads(completion.choices[0].message.content)
    except Exception as e:
        print(f"Groq Extraction Error: {e}")
        
    return None

def generate_fraud_explanation(violations_text: str, severity: str) -> str | None:
    """Uses Groq to generate a professional fraud explanation report."""
    client = get_client()
    if not client:
        return None
        
    prompt = f"""You are an expert fraud detection officer analyzing supply chain finance invoices. 

DETECTED VIOLATIONS:
{violations_text}

OVERALL SEVERITY: {severity}

Provide a 2-3 sentence explanation of why this invoice should be held or blocked. Be direct, professional, and specific about the fraud indicators. Focus on the most serious violations. Do NOT include greetings.

EXPLANATION:"""

    try:
        completion = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )
        return completion.choices[0].message.content.strip().replace("This invoice", "The invoice").replace("should be held", "is flagged for review")
    except Exception as e:
        print(f"Groq Explanation Error: {e}")
        
    return None

