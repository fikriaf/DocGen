# Transcript — Invoice Draft PT Horizon Nusantara

**Date:** 2026-03-05  
**Task:** Generate invoice draft with DRAFT watermark for client presentation

---

## Step 1: Server Health Check

**Request:** `GET http://localhost:3000/health`  
**Response 200:**
```json
{ "status": "ok", "service": "DocGen Engine", "version": "1.0.0", "timestamp": "2026-03-05T08:19:01.386Z" }
```

---

## Step 2: Data Preparation

**Template:** `invoice`  
**Client:** PT Horizon Nusantara, Surabaya  
**Invoice Number:** INV-2026-003  
**Issue Date:** 2026-03-05  
**Due Date:** 2026-04-04

### Line Items

| Description     | Qty | Unit Price      | Amount          |
|-----------------|-----|-----------------|-----------------|
| Konsultasi IT   | 5   | Rp 2.000.000    | Rp 10.000.000   |
| Setup Server    | 1   | Rp 3.500.000    | Rp 3.500.000    |

### Totals

- **Subtotal:** Rp 13.500.000
- **Tax:** Rp 0 (tidak disebutkan)
- **Discount:** Rp 0
- **Total:** Rp 13.500.000

### Watermark

- **enabled:** true
- **text:** DRAFT
- **opacity:** 0.12
- **color:** #cc0000
- **angle:** -45

---

## Step 3: API Call

**Request:** `POST http://localhost:3000/api/v1/generate`

```json
{
  "templateId": "invoice",
  "data": {
    "invoice_number": "INV-2026-003",
    "issue_date": "2026-03-05",
    "due_date": "2026-04-04",
    "client_name": "PT Horizon Nusantara",
    "client_address": "Surabaya",
    "items": [
      { "description": "Konsultasi IT", "qty": 5, "unit_price": 2000000 },
      { "description": "Setup Server", "qty": 1, "unit_price": 3500000 }
    ],
    "subtotal": 13500000,
    "tax": 0,
    "discount": 0,
    "total": 13500000
  },
  "options": {
    "useLLM": false,
    "outputFormat": "pdf",
    "watermark": {
      "enabled": true,
      "text": "DRAFT",
      "opacity": 0.12,
      "color": "#cc0000",
      "angle": -45
    }
  }
}
```

**Response:** HTTP 200 — Raw binary PDF

---

## Step 4: Output

**File saved to:**  
`D:\script\express\DocGen\skill\docgen-generate-workspace\iteration-1\eval-3-draft-watermark\with_skill\outputs\invoice.pdf`

**File size:** ~65 KB

---

## Summary

| Field            | Value                |
|------------------|----------------------|
| Status           | SUCCESS              |
| Template         | invoice              |
| Invoice Number   | INV-2026-003         |
| Client           | PT Horizon Nusantara |
| Total            | Rp 13.500.000        |
| Line Items       | 2                    |
| Watermark        | DRAFT (applied)      |
| Errors           | None                 |
