FROM node:6.3.1 
# make a dir called app, -p means create the folder even if the root folder of it does not exist

RUN npm install -g nodemon
RUN mkdir -p /tiny
# set app to be the working dir
WORKDIR /tiny 
# add all the files in the current path to the docker container
ADD . /tiny  
# cd to app folder and npm install all the node packages
RUN cd /tiny && npm install

EXPOSE 3000
# run the app
CMD ["node","/tiny/server.js"]

#how to build the docker container:  docker build -t jeff/tinyurl .
#how to run the docker:  docker run --name tinyCon -p 3000:3000 -d jeff/tinyurl