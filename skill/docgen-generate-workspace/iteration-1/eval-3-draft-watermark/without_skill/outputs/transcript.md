# Transcript: Invoice Draft Generation with DRAFT Watermark

**Date:** 2026-03-05  
**Task:** Generate invoice draft PDF for PT Horizon Nusantara with DRAFT watermark

---

## Step 1: API Discovery

Probed `http://localhost:3000/` — returned 404 (route not found).  
Probed `http://localhost:3000/health` — returned:

```json
{
  "status": "ok",
  "service": "DocGen Engine",
  "version": "1.0.0",
  "timestamp": "2026-03-05T08:19:00.593Z"
}
```

Discovered API base is at `/api/v1` by reading the source `src/app.ts`.

---

## Step 2: List Available Templates

```
GET http://localhost:3000/api/v1/templates
```

Response:
```json
{"success":true,"templates":["invoice","receipt"]}
```

Selected template: **`invoice`**

---

## Step 3: Inspect Invoice Template Fields

```
GET http://localhost:3000/api/v1/fields/invoice
```

Response (key fields):
- `invoice_number` (required, string)
- `issue_date` (required, string/date)
- `due_date` (required, string/date)
- `client_name` (required, string)
- `client_address` (optional, string)
- `items` (required, array of `{description, qty, unit_price}`)
- `subtotal` (required, number)
- `total` (required, number)
- `notes` (optional, string)
- `options.watermark` supports: `enabled`, `text`, `opacity`, `fontSize`, `color`, `angle`

---

## Step 4: Generate Invoice PDF

```
POST http://localhost:3000/api/v1/generate
Content-Type: application/json
```

**Request body:**
```json
{
  "templateId": "invoice",
  "data": {
    "invoice_number": "INV-DRAFT-2026-001",
    "issue_date": "2026-03-05",
    "due_date": "2026-04-05",
    "client_name": "PT Horizon Nusantara",
    "client_address": "Surabaya, Jawa Timur",
    "company_name": "PT DocGen Solutions",
    "company_address": "Jakarta, Indonesia",
    "company_email": "info@docgen.co.id",
    "items": [
      {
        "description": "Konsultasi IT",
        "qty": 5,
        "unit_price": 2000000
      },
      {
        "description": "Setup Server",
        "qty": 1,
        "unit_price": 3500000
      }
    ],
    "subtotal": 13500000,
    "tax": 0,
    "tax_rate": 0,
    "total": 13500000,
    "notes": "Invoice ini adalah draft untuk keperluan presentasi klien."
  },
  "options": {
    "watermark": {
      "enabled": true,
      "text": "DRAFT",
      "opacity": 0.3,
      "fontSize": 80,
      "color": "#cc0000",
      "angle": -45
    }
  }
}
```

**Response:**
- HTTP Status: `200 OK`
- Content-Type: `application/pdf`
- File size: `69,715 bytes`

---

## Step 5: Save Output

PDF saved to:  
`D:\script\express\DocGen\skill\docgen-generate-workspace\iteration-1\eval-3-draft-watermark\without_skill\outputs\invoice.pdf`

---

## Summary

| Field              | Value                          |
|--------------------|--------------------------------|
| Status             | SUCCESS                        |
| Template Used      | invoice                        |
| Client             | PT Horizon Nusantara, Surabaya |
| Items              | Konsultasi IT (5x Rp 2.000.000) + Setup Server (1x Rp 3.500.000) |
| Subtotal           | Rp 13.500.000                  |
| Total              | Rp 13.500.000                  |
| Watermark Applied  | YES — "DRAFT", red (#cc0000), 30% opacity, -45° angle |
| PDF Size           | 69,715 bytes                   |
| Errors             | None                           |
