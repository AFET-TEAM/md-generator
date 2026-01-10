# Multi-stage build - Production optimized Dockerfile

# Stage 1: Build aşaması
FROM node:18-alpine AS builder

WORKDIR /app

# Package files kopyala
COPY package*.json ./

# Dependencies yükle
RUN npm install

# Kaynak kodları kopyala
COPY . .

# React uygulamasını build et
RUN npm run build

# Stage 2: Production aşaması
FROM node:18-alpine

WORKDIR /app

# serve paketini yükle (React uygulamasını serve etmek için)
RUN npm install -g serve

# Builder aşamasından build output'u kopyala
COPY --from=builder /app/build ./build

# Port tanımla
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3002", (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Uygulamayı başlat
CMD ["serve", "-s", "build", "-l", "3002"]
