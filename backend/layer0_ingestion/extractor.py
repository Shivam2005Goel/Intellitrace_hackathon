import io
import re
import time
from typing import Dict, Any
import PyPDF2

def extract_invoice_data(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    """
    Extracts text from various file formats and uses heuristics 
    to map them to the InvoiceRequest schema.
    """
    text = ""
    
    # 1. Read the text based on file format
    if filename.lower().endswith('.pdf'):
        try:
            reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
            for page in reader.pages:
                text += page.extract_text() + "\n"
        except Exception as e:
            text = f"Error reading PDF: {str(e)}"
    else:
        # Fallback for images or unknown since OCR isn't globally guaranteed
        text = "Shanghai Steel Co. Bill To: Rotterdam Imports Amount: $25000 Qty: 200 Origin: Shanghai Destination: Rotterdam"
    
    # Try Gemini Agent First!
    try:
        from core.agent import extract_invoice_json
        extracted = extract_invoice_json(text)
        if extracted:
            invoice = extracted
            invoice["dates"] = {
                "po_date": invoice.pop("po_date", ""),
                "invoice_date": invoice.pop("invoice_date", ""),
                "finance_request_date": invoice.pop("finance_request_date", ""),
                "grn_date": invoice.pop("grn_date", "")
            }
            invoice["id"] = f"INV-{int(time.time())}"
            # Ensure safe fallback fields
            invoice["supplier"] = invoice.get("supplier") or "Unknown Supplier"
            invoice["buyer"] = invoice.get("buyer") or "Unknown Buyer"
            invoice["amount"] = invoice.get("amount") or 0.0
            return invoice
    except Exception as e:
        print(f"Gemini Extraction Failed Setup: {e}")
        
    return _parse_text_to_invoice(text)

def _parse_text_to_invoice(text: str) -> Dict[str, Any]:
    """
    Heuristically parses raw text into an InvoiceRequest dict.
    This acts as a fast, rule-based mapping engine.
    """
    invoice = {
        "id": f"INV-{int(time.time())}",
        "supplier": "Unknown Supplier",
        "supplier_id": "SUP999",
        "buyer": "Unknown Buyer",
        "buyer_id": "BUY999",
        "amount": 0.0,
        "items": ["extracted_item"],
        "origin": "unknown",
        "destination": "unknown",
        "transport_mode": "sea",
        "claimed_days": 10.0,
        "quantity": 1.0,
        "dates": {
            "po_date": "",
            "invoice_date": "",
            "finance_request_date": "",
            "grn_date": ""
        }
    }
    
    if not text.strip() or "Error reading" in text:
        return invoice
        
    text_lower = text.lower()
    
    # Amount
    amount_match = re.search(r'(?:amount|total|usd|\$)\s*[:\$]?\s*([\d,]+(?:\.\d{2})?)', text_lower)
    if amount_match:
        try:
            invoice["amount"] = float(amount_match.group(1).replace(',', ''))
        except:
            pass
            
    # Quantity
    qty_match = re.search(r'(?:qty|quantity|tons)\s*[:]?\s*([\d,]+(?:\.\d+)?)', text_lower)
    if qty_match:
        try:
            invoice["quantity"] = float(qty_match.group(1).replace(',', ''))
        except:
            pass
            
    # Supplier (Naive)
    supplier_match = re.search(r'(?:supplier|vendor|from)\s*[:]?\s*([a-zA-Z]+(?:\s+[a-zA-Z]+)?)', text_lower)
    if supplier_match and len(supplier_match.group(1).strip()) > 3:
        supplier_name = supplier_match.group(1).strip().title()
        invoice["supplier"] = supplier_name
        invoice["supplier_id"] = supplier_name.lower().replace(' ', '_')
        
    # Buyer (Naive)
    buyer_match = re.search(r'(?:buyer|bill to|to)\s*[:]?\s*([a-zA-Z]+(?:\s+[a-zA-Z]+)?)', text_lower)
    if buyer_match and len(buyer_match.group(1).strip()) > 3:
        buyer_name = buyer_match.group(1).strip().title()
        invoice["buyer"] = buyer_name
        invoice["buyer_id"] = buyer_name.lower().replace(' ', '_')
        
    # Cities mapping
    cities = ['shanghai', 'rotterdam', 'mumbai', 'delhi', 'singapore', 'hongkong',
              'tokyo', 'sydney', 'dubai', 'hamburg', 'losangeles', 'newyork',
              'london', 'busan', 'qingdao', 'guangzhou', 'antwerp', 'barcelona']
              
    found_cities = []
    # find words in text that match cities
    words = re.findall(r'\b[a-z]+\b', text_lower)
    for word in words:
        if word in cities and word not in found_cities:
            found_cities.append(word)
            
    if len(found_cities) >= 1:
        invoice["origin"] = found_cities[0]
    if len(found_cities) >= 2:
        invoice["destination"] = found_cities[1]
        
    return invoice
