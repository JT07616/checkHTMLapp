#BUILD STAGE
FROM node:20-alpine AS build

WORKDIR /app

#Kopiraj package files
COPY package*.json ./

#Instaliraj dependencije
RUN npm install

#Kopiraj ostatak frontenda
COPY . .

#Build Vue aplikacije
RUN npm run build


#PRODUCTION STAGE
FROM nginx:alpine

#Kopiraj build u Nginx
COPY --from=build /app/dist /usr/share/nginx/html

#Izloži port 80
EXPOSE 80

#Pokreni Nginx
CMD ["nginx", "-g", "daemon off;"]
