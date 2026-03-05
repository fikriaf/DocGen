# Invoice Generation Transcript

**Date:** 2026-03-05  
**Task:** Generate invoice PDF via DocGen API (no skill, general knowledge only)

---

## Step 1 — Discover Available Templates

**Request:**
```
GET http://localhost:3000/api/v1/templates
```

**Response (200):**
```json
{"success":true,"templates":["invoice","receipt"]}
```

Template `invoice` confirmed available.

---

## Step 2 — First Attempt (camelCase schema)

**Request:**
```
POST http://localhost:3000/api/v1/generate
Content-Type: application/json

{
  "templateId": "invoice",
  "data": {
    "invoiceNumber": "INV-2026-007",
    "date": "2026-03-05",
    "dueDate": "2026-04-04",
    "company": { "name": "CV Karya Digital" },
    "client": {
      "name": "PT Maju Bersama",
      "address": "Jl. Kebon Jeruk No. 5 Jakarta Barat"
    },
    "items": [
      { "description": "Pengembangan Website", "quantity": 1, "unitPrice": 8000000, "total": 8000000 },
      { "description": "Domain + Hosting 1 tahun", "quantity": 1, "unitPrice": 500000, "total": 500000 }
    ],
    "subtotal": 8500000,
    "tax": 935000,
    "taxRate": 11,
    "total": 9435000,
    "currency": "IDR"
  }
}
```

**Response (422):**
```json
{
  "success": false,
  "error": "Missing required fields",
  "missingFields": ["invoice_number","issue_date","due_date","client_name"]
}
```

**Diagnosis:** API expects snake_case field names, not camelCase.

---

## Step 3 — Second Attempt (snake_case schema)

**Request:**
```
POST http://localhost:3000/api/v1/generate
Content-Type: application/json

{
  "templateId": "invoice",
  "data": {
    "invoice_number": "INV-2026-007",
    "issue_date": "2026-03-05",
    "due_date": "2026-04-04",
    "company_name": "CV Karya Digital",
    "client_name": "PT Maju Bersama",
    "client_address": "Jl. Kebon Jeruk No. 5 Jakarta Barat",
    "items": [
      { "description": "Pengembangan Website", "quantity": 1, "unit_price": 8000000, "total": 8000000 },
      { "description": "Domain + Hosting 1 tahun", "quantity": 1, "unit_price": 500000, "total": 500000 }
    ],
    "subtotal": 8500000,
    "tax_rate": 11,
    "tax_amount": 935000,
    "total": 9435000,
    "currency": "IDR"
  }
}
```

**Response (200):**
```
Content-Type: application/pdf
Size: 77572 bytes (~75 KB)
```

PDF generated successfully.

---

## Invoice Calculation

| Item                        | Qty | Unit Price    | Total         |
|-----------------------------|-----|---------------|---------------|
| Pengembangan Website        | 1   | Rp 8,000,000  | Rp 8,000,000  |
| Domain + Hosting 1 tahun    | 1   | Rp   500,000  | Rp   500,000  |
| **Subtotal**                |     |               | Rp 8,500,000  |
| PPN 11%                     |     |               | Rp   935,000  |
| **TOTAL**                   |     |               | **Rp 9,435,000** |

---

## Output

- **PDF saved to:** `outputs/invoice.pdf`
- **File size:** 77,572 bytes
- **Status:** SUCCESS

---

## Key Findings (no skill used)

- Had to trial-and-error the field naming convention (camelCase → snake_case)
- Required fields discovered reactively from the 422 error response: `invoice_number`, `issue_date`, `due_date`, `client_name`
- Additional fields (`unit_price`, `tax_rate`, `tax_amount`, etc.) were inferred by applying common REST API snake_case conventions
- Took **2 API attempts** to produce a successful result
