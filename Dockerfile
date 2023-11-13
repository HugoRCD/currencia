FROM node:18.16.0

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

EXPOSE 3000

RUN npm run build

CMD [ "npm", "run", "start" ]