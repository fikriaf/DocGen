# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# ── Stage 2: Production ───────────────────────────────────────────────────────
FROM node:20-slim AS production

# GraphicsMagick & Ghostscript required by pdf2pic (OCR fallback)
# Libreoffice required by libreoffice-convert
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    fonts-liberation \
    graphicsmagick \
    ghostscript \
    libreoffice \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built output and templates
COPY --from=builder /app/dist ./dist
COPY public ./dist/public

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/app.js"]
