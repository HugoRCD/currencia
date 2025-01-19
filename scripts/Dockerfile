# Stage 1: Build Stage
FROM oven/bun:latest

RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libxshmfence1 \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

ARG DATABASE_URL
ARG MONGODB_URL
ENV DATABASE_URL=$DATABASE_URL
ENV MONGODB_URL=$MONGODB_URL

WORKDIR /scripts

COPY package.json ./
COPY bun.lockb ./

RUN bun install

COPY . .

ENTRYPOINT ["bun"]
