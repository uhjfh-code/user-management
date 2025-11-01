# ======================
# Stage 1: Build stage
# ======================
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --include=dev

COPY . .

RUN npx prisma generate
RUN npx tsc -p tsconfig.json


# ======================
# Stage 2: Production stage
# ======================
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

RUN npx prisma generate

EXPOSE 4000
CMD ["node", "dist/index.js"]
