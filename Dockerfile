FROM node:lts

RUN mkdir -p /opt/app /opt/app/hub /opt/app/common /opt/app/web /opt/app/scripts

WORKDIR /opt/app/
ADD package.json yarn.lock ./
ADD web/package.json ./web/
ADD hub/package.json ./hub/
ADD common/package.json ./common/
RUN yarn install

ADD web ./web
ADD hub ./hub
ADD common ./common
ADD scripts ./scripts
RUN yarn build

WORKDIR /opt/app/hub
CMD [ "node", "." ]