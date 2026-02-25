FROM node:18-alpine
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

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

ENV CHROME_PATH=/usr/bin/chromium

COPY . .

RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]