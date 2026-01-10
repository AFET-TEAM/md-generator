# Multi-stage build - Production optimized Dockerfile

# syntax=docker/dockerfile:1.4
# Stage 1: Build aşaması
FROM node:18-alpine AS builder

WORKDIR /app

# Build arguments (secret olarak işlenecek)
ARG GEMINI_API_KEY=""
ARG ENVIRONMENT="development"

# Package files kopyala
COPY package*.json ./

# Dependencies yükle
RUN npm install

# Kaynak kodları kopyala
COPY . .

# React uygulamasını build et (build-time secrets'ları kullan)
RUN --mount=type=secret,id=gemini_api_key \
    --mount=type=secret,id=environment \
    REACT_APP_GEMINI_API_KEY=$(cat /run/secrets/gemini_api_key 2>/dev/null || echo "${GEMINI_API_KEY}") \
    REACT_APP_ENVIRONMENT=$(cat /run/secrets/environment 2>/dev/null || echo "${ENVIRONMENT}") \
    npm run build

# Stage 2: Production aşaması
FROM node:18-alpine

WORKDIR /app

# serve paketini yükle (React uygulamasını serve etmek için)
RUN npm install -g serve

# Builder aşamasından build output'u kopyala
COPY --from=builder /app/build ./build

# Port tanımla
EXPOSE 3004

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3004", (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Uygulamayı başlat
CMD ["serve", "-s", "build", "-l", "3002"]
