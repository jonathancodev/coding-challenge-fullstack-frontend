FROM node:20.12.2
WORKDIR /app
EXPOSE 3000
COPY . /app
RUN npm install
CMD npm run start:production
