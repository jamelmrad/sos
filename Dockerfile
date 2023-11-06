#  Dockerfile for Node Express Backend

FROM node:16.17.0

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install nodemon globally using Yarn
RUN yarn global add nodemon

# Install Dependencies
COPY package*.json ./
RUN yarn install

# Copy app source code
COPY . .

# Exports
EXPOSE 3030

CMD ["nodemon","app.js"]
