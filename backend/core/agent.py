import os
import json
from google import genai
from pydantic import BaseModel, Field

def get_client() -> genai.Client | None:
    from dotenv import load_dotenv
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_key_here":
        return None
    try:
        return genai.Client(api_key=api_key)
    except Exception as e:
        print(f"Failed to initialize Gemini Client: {e}")
        return None

class LLMInvoiceExtraction(BaseModel):
    supplier: str = Field(description="Name of the selling company")
    supplier_id: str = Field(description="Lowercase Snake-case version of the supplier name")
    buyer: str = Field(description="Name of the buying company")
    buyer_id: str = Field(description="Lowercase Snake-case version of the buyer name")
    amount: float = Field(description="Total monetary value of the invoice")
    items: list[str] = Field(description="List of physical goods being transported")
    origin: str = Field(description="City where the shipment originated. e.g. shanghai, rotterdam")
    destination: str = Field(description="City where the shipment is heading. e.g. shanghai, rotterdam")
    transport_mode: str = Field(description="One of: sea, air, road, rail")
    claimed_days: float = Field(description="Total estimated or claimed delivery time in days")
    quantity: float = Field(description="Weight or count of goods")
    po_date: str | None = Field(description="Purchase Order date YYYY-MM-DD")
    invoice_date: str | None = Field(description="Invoice date YYYY-MM-DD")
    finance_request_date: str | None = Field(description="Date financing was requested YYYY-MM-DD")
    grn_date: str | None = Field(description="Goods Receipt Note date (when goods arrived) YYYY-MM-DD")

def extract_invoice_json(raw_text: str) -> dict | None:
    """Uses Gemini to read messy OCR text and strictly enforce JSON output."""
    client = get_client()
    if not client:
        return None
        
    prompt = f"""
    You are a professional invoice data extractor. Read this raw text from a document and cleanly extract all known entities. 
    If a field is missing, make a highly educated guess. If completely absent, use zero for numbers and empty strings for text.
    
    RAW TEXT:
    {raw_text}
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=genai.types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=LLMInvoiceExtraction,
            ),
        )
        if response.text:
            return json.loads(response.text)
    except Exception as e:
        print(f"Gemini Extraction Error: {e}")
        
    return None

def generate_fraud_explanation(violations_text: str, severity: str) -> str | None:
    """Uses Gemini to generate a professional fraud explanation report."""
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
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=genai.types.GenerateContentConfig(
                temperature=0.2,
            )
        )
        return response.text.strip().replace("This invoice", "The invoice").replace("should be held", "is flagged for review")
    except Exception as e:
        print(f"Gemini Explanation Error: {e}")
        
    return None
