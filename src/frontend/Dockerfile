# pull the official base image
FROM node:alpine

# set working direction
WORKDIR /app

# install application dependencies
COPY package*.json ./
RUN npm install --verbose

# add app
COPY . ./

EXPOSE 3000

# start app
CMD ["npm", "start"]