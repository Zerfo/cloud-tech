FROM node:18

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY dist /app

RUN ls -a

RUN npm install

RUN git clone https://github.com/vishnubob/wait-for-it.git

EXPOSE 8080
CMD [ "node", "./dist/index.js" ]