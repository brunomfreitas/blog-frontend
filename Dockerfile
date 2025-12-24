# =========================
# 1) Build (Vite)
# =========================
FROM node:20-alpine AS build
WORKDIR /app

# Dependências primeiro (melhor cache)
COPY package*.json ./
RUN npm ci

# Código
COPY . .

# Se você quiser parametrizar a URL da API em build-time:
# docker build --build-arg VITE_API_URL=http://localhost:3000 ...
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Build do Vite (gera /dist)
RUN npm run build


# =========================
# 2) Runtime (Nginx)
# =========================
FROM nginx:1.27-alpine

# SPA fallback (React Router)
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Publica os arquivos estáticos
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Opcional: healthcheck
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
