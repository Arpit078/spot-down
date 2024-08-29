FROM node:18.19.1
WORKDIR /app

COPY . .

RUN npm install

ENV PORT 5001
EXPOSE 5001

ENV POSTGRES_PASSWORD spot-down-db-password
 
CMD ["npm" , "start"]