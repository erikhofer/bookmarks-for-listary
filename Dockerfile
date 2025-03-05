FROM node:22

ADD . /app

WORKDIR /app

RUN npm ci

ENTRYPOINT [ "node", "index.js" ]

CMD [ "--json", "example/bookmarks.json" ]

EXPOSE 8000
