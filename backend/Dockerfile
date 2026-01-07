#Base image – Node.js
FROM node:18-alpine

#Postavi radni direktorij u containeru
WORKDIR /app

#Kopiraj package.json i package-lock.json
COPY package*.json ./

#Instaliraj dependencije
RUN npm install

#Kopiraj ostatak aplikacije
COPY . .

#Otvori port koji koristi Express
EXPOSE 3000

#Pokreni backend
CMD ["npm", "start"]
