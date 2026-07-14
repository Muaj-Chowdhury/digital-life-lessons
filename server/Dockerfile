FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]


#----------------------------- Explanation of the code block:-------------------------
#WORKDIR /usr/src/app
# This line sets the working directory for the application inside the Docker container to /usr/src/app
# why working directory is used in dockerfile:
# The WORKDIR instruction in a Dockerfile sets the working directory for any subsequent instructions in the Dockerfile. It is used to define the directory where the application code and dependencies will be located inside the container. This helps to keep the container organized and ensures that all commands are executed in the correct context.

# RUN npm ci --only=production:
# This line installs the production dependencies defined in the package.json file using npm ci.
# npm ci is a faster alternative to npm install for production environments, as it doesn't install development dependencies.


# CMD [ "node", "index.js" ]:
# This line specifies the command to run when the container starts. It runs the Node.js application defined in the index.js file using the node command.