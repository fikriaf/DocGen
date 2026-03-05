# Transcript: Invoice Generation — INV-2026-007

## Task
Generate a PDF invoice for PT Maju Bersama with 2 line items and 11% PPN.

---

## Step 1: Health Check

**Request:**
```
GET http://localhost:3000/health
```

**Response (HTTP 200):**
```json
{ "status": "ok", "service": "DocGen Engine", "version": "1.0.0", "timestamp": "2026-03-05T08:19:00.776Z" }
```

---

## Step 2: Calculations

| Field         | Calculation                          | Result         |
|---------------|--------------------------------------|----------------|
| Item 1        | 1 × Rp 8.000.000                     | Rp 8.000.000   |
| Item 2        | 1 × Rp 500.000                       | Rp 500.000     |
| Subtotal      | 8.000.000 + 500.000                  | Rp 8.500.000   |
| Tax (PPN 11%) | 8.500.000 × 11 / 100                 | Rp 935.000     |
| Discount      | —                                    | Rp 0           |
| **Total**     | 8.500.000 + 935.000 − 0              | **Rp 9.435.000** |

- Issue date: `2026-03-05` (today)
- Due date: `2026-04-04` (30 days from issue date)

---

## Step 3: API Call — Generate PDF

**Request:**
```
POST http://localhost:3000/api/v1/generate
Content-Type: application/json
```

**Request Body:**
```json
{
  "templateId": "invoice",
  "data": {
    "invoice_number": "INV-2026-007",
    "issue_date": "2026-03-05",
    "due_date": "2026-04-04",
    "client_name": "PT Maju Bersama",
    "client_address": "Jl. Kebon Jeruk No. 5 Jakarta Barat",
    "company_name": "CV Karya Digital",
    "items": [
      { "description": "Pengembangan Website", "qty": 1, "unit_price": 8000000 },
      { "description": "Domain + Hosting 1 tahun", "qty": 1, "unit_price": 500000 }
    ],
    "subtotal": 8500000,
    "tax": 935000,
    "tax_rate": 11,
    "discount": 0,
    "total": 9435000
  },
  "options": {
    "useLLM": false,
    "outputFormat": "pdf"
  }
}
```

**Response:**
- HTTP Status: `200 OK`
- Content-Type: `application/pdf`
- Size: `79,254 bytes`
- Body: Raw binary PDF (saved to disk)

---

## Step 4: Output

**Saved to:**
```
D:\script\express\DocGen\skill\docgen-generate-workspace\iteration-1\eval-1-invoice-rupiah\with_skill\outputs\invoice.pdf
```

---

## Result

| Field          | Value                  |
|----------------|------------------------|
| Status         | SUCCESS                |
| Template       | invoice                |
| Invoice Number | INV-2026-007           |
| Client         | PT Maju Bersama        |
| Company        | CV Karya Digital       |
| Line Items     | 2                      |
| Subtotal       | Rp 8.500.000           |
| PPN (11%)      | Rp 935.000             |
| **Total**      | **Rp 9.435.000**       |
| PDF File Size  | 79,254 bytes           |
