FROM alpine:latest

WORKDIR /usr/app

RUN apk update && apk add --update nodejs nodejs-npm python3

COPY ./ ./

RUN npm i

EXPOSE 3000

ENTRYPOINT [ "node",  "index.js" ]
