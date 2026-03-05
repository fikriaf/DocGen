# docgen-generate

An agent skill for generating professional PDF business documents (invoices and receipts) using the [DocGen Engine](https://github.com/fikriaf/DocGen) REST API — deployed on Railway, no local setup required.

## What it does

When installed, this skill enables your AI agent to:
- Generate invoice PDFs from structured data (client name, line items, tax, etc.)
- Generate receipt PDFs for payment confirmation
- Apply DRAFT watermarks for draft documents
- Calculate totals automatically from line items

## Requirements

No local server needed. The skill calls the live production API at:
`https://docgen-production-503d.up.railway.app`

## Install

```bash
npx skills add https://github.com/fikriaf/DocGen --skill docgen-generate
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

See [`docgen-generate/SKILL.md`](../docgen-generate/SKILL.md) for the full skill instructions.
