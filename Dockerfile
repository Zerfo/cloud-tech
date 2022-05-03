FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

RUN git clone https://github.com/vishnubob/wait-for-it.git

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "app.js" ]