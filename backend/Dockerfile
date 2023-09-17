FROM node:18.17.0

WORKDIR /usr/app/todo-app-api

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev"]
