FROM node:22-alpine

WORKDIR /app

# Enable corepack (pnpm) and prepare pnpm
RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

RUN apk add --no-cache openssl

# Install necessary dependencies for Chromium
RUN apk add --no-cache \
    curl \
    wget \
    ca-certificates \
    ttf-freefont \
    alsa-lib \
    libx11 \
    libxcb \
    mesa-gl \
    gtk+3.0 \
    nss \
    libxcomposite \
    libxtst \
    libxrandr \
    libxi \
    xvfb \
    chromium \
    xdg-utils

ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY . .

RUN pnpm prisma generate

RUN pnpm run build

EXPOSE 3000

# DATABASE_URL must be set at runtime (docker run -e DATABASE_URL=... or --env-file)
CMD ["pnpm", "start"]