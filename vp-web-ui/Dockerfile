FROM node:14.15.4

WORKDIR /client-ui

COPY package*.json ./

RUN npm install -g @angular/cli @angular-devkit/build-angular && npm install

EXPOSE 4200

CMD ["npm", "start"]