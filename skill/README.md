# docgen-generate

An agent skill for generating professional PDF business documents (invoices and receipts) using the [DocGen Engine](https://github.com/your-username/DocGen) local REST API.

## What it does

When installed, this skill enables your AI agent to:
- Generate invoice PDFs from structured data (client name, line items, tax, etc.)
- Generate receipt PDFs for payment confirmation
- Apply DRAFT watermarks for draft documents
- Calculate totals automatically from line items

## Requirements

- [DocGen Engine](https://github.com/your-username/DocGen) running locally on `http://localhost:3000`
- Start it with: `npm run dev` inside the DocGen project folder

## Install

```bash
npx skills add https://github.com/your-username/agent-skills --skill docgen-generate
```

## Usage

Just ask your agent naturally:

- "Buatkan invoice untuk PT Maju Bersama, item: jasa konsultasi 10 jam x Rp 500.000"
- "Create a receipt PDF for John Doe, Monthly Retainer Rp 5.000.000"
- "Buatin invoice draft dengan watermark buat presentasi klien"
- "I need an invoice PDF for my client, here's the data: ..."

## Templates

| Template | Use for |
|----------|---------|
| `invoice` | Billing clients — supports invoice number, due date, tax, discount |
| `receipt` | Payment confirmation — supports payer name, payment method |

## Skill file

See [`docgen-generate/SKILL.md`](./docgen-generate/SKILL.md) for the full skill instructions.
