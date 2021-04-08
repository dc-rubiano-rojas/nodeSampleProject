FROM node:14

# FROM postgres:latest

WORKDIR /app

COPY package*.json ./
# COPY tsconfig.json ./
# COPY ./config/*.env ./app/

RUN npm install

# COPIA TODOS LOS ARCHIVO DENTRO DEL CONTENEDOR
COPY . .

# RUN npm run build

EXPOSE 3000 

CMD [ "npm", "start" ]
# CMD node src/server.ts
