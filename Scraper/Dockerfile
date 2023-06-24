FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY tsconfig.json ./

# RUN npm ci --only=production
RUN npm install
COPY . .
RUN npm run build
# RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=0 /usr/src/app/build ./build


CMD [ "node", "./build/src/main.js" ]
