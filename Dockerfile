FROM node:10.15.3

RUN mkdir -p /usr/src/nest-app
WORKDIR /usr/src/nest-app
COPY . /usr/src/nest-app

ARG env_name
ENV NODE_ENV=$env_name
ENV PORT 3000

RUN npm install -g tsc && npm install -g concurrently && npm install -g typescript && npm install -g @nestjs/cli
RUN npm install
RUN export PORT=3000
RUN ls
RUN npm run build

EXPOSE 3000
CMD [ "node", "dist/main.js" ]
