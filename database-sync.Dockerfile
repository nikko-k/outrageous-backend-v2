FROM node:12-alpine

RUN apk add --no-cache python2 g++ make

WORKDIR /app

COPY *.js *.ts *.json .env ./

ADD errors ./errors

ADD passport-strategies ./passport-strategies

ADD sequelize ./sequelize

ADD types ./types

RUN npm install

CMD ["npm", "run", "sync"]

EXPOSE 3000