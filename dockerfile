FROM node:bookworm-slim as build
WORKDIR /home/node/
# COPY ./package.json ./
# COPY ./src ./src

# For moving just the docker files
RUN apt-get update && apt-get install -y git
RUN git init && \
    git config --global --add safe.directory /home/node && \
    git remote add origin https://github.com/canderson9625/calvins.work/ && \
    git pull origin site-update

RUN npm i
RUN npm run server

CMD [ "sh", "-c", "node server.js" ]