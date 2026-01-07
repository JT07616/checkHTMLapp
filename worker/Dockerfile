#Base image
FROM node:18-alpine

#Radni direktorij
WORKDIR /app

#Kopiraj package.json i lock
COPY package*.json ./

#Instaliraj dependencije
RUN npm install

#Kopiraj ostatak workera
COPY . .

#Pokreni worker
CMD ["node", "worker.js"]
