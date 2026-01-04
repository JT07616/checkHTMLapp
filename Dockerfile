FROM node:22-alpine

WORKDIR /app

# prvo kopiramo package datoteke (bolji cache)
COPY package*.json ./
RUN npm ci --omit=dev

# kopiramo ostatak projekta
COPY . .

EXPOSE 3000

# default je API (možemo override u compose)
CMD ["node", "server.js"]