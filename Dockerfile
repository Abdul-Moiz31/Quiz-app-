# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Install + build frontend
COPY Frontend/package*.json ./Frontend/
RUN npm --prefix Frontend install
COPY Frontend ./Frontend
RUN npm --prefix Frontend run build

# Install + build backend
COPY backend/package*.json ./backend/
RUN npm --prefix backend install
COPY backend ./backend
RUN npm --prefix backend run build

# ---- Runtime stage ----
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Backend runtime deps only
COPY backend/package*.json ./backend/
RUN npm --prefix backend install --omit=dev

# Compiled output
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/Frontend/dist ./Frontend/dist

EXPOSE 3000
CMD ["node", "backend/dist/index.js"]
