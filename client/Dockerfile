# --- Stage 1: Build the React App ---
FROM node:20-alpine as builder

WORKDIR /app

# Define Build Arguments

ARG VITE_apiKey
ARG VITE_authDomain
ARG VITE_projectId
ARG VITE_storageBucket
ARG VITE_messagingSenderId
ARG VITE_appId
ARG VITE_IMGBB_API_KEY
ARG VITE_API_URL
# ARG Commands: These declare variables that the Docker engine accepts only during the build process. Your GitHub Actions workflow passes secrets into these slots via the build-args field.

# Expose them as Environment Variables for the build engine

ENV VITE_apiKey=$VITE_apiKey \
    VITE_authDomain=$VITE_authDomain \
    VITE_projectId=$VITE_projectId \
    VITE_storageBucket=$VITE_storageBucket \
    VITE_messagingSenderId=$VITE_messagingSenderId \
    VITE_appId=$VITE_appId \
    VITE_IMGBB_API_KEY=$VITE_IMGBB_API_KEY \
    VITE_API_URL=$VITE_API_URL
    #ENV Commands: These convert those build arguments into system environment variables inside the node environment.
    #Why this is crucial for Vite: Vite does not read environment variables at runtime in the browser. Instead, during npm run build, the Vite compiler searches your source code for import.meta.env.VITE_... placeholders and physically hardcodes (bakes) these values directly into your compiled JavaScript files. If these are not present during Stage 1, your frontend will not be able to communicate with your backend or Firebase services.

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 



# --- Stage 1: Build the React App ---
# This stage builds the React app using the Node.js image.
# It copies the package.json and package-lock.json files to the working directory.
# It installs the dependencies using npm install.
# It copies the rest of the files to the working directory.
# It builds the React app using npm run build.

# --- Stage 2: Serve with Nginx ---
# This stage serves the built React app with Nginx.
# It copies the built files from the previous stage to the Nginx public directory.
# It exposes port 80 for the Nginx server.
# It starts the Nginx server using the "-g" option to run in the foreground.


#------------------------ explaination of the code:--------------------------------
#FROM nginx:alpine: Discards the entire Node.js environment, the source code, and the bulky node_modules folder. It starts fresh with an incredibly small, secure web server image running Nginx on Alpine Linux.

# COPY --from=builder /app/dist /usr/share/nginx/html, explaination of the code block:
# This command copies the built React app files from the "dist" directory of the builder stage to the Nginx public directory "/usr/share/nginx/html".
# This is where Nginx will serve the files.
# Resulting Benefit: Your final Docker image size drops drastically (often from over 1GB down to roughly 20-30MB) because it only contains Nginx and your raw static files. Your raw source code and API keys are completely left behind.

# EXPOSE 80:
# This command exposes port 80 for the Nginx server.
# CMD ["nginx", "-g", "daemon off;"] , explaination of the code block:
# This command starts the Nginx server and keeps it running in the foreground.
# The "-g" option tells Nginx to run in the foreground, so it doesn't exit when the container starts.
# This is useful for debugging and development.
# "daemon off;" tells Nginx to run in the foreground and not as a background process.




#---------------------------------Nginx---------------------------------------------------

# what is Nginx: Nginx is a web server and reverse proxy server. It is known for its high performance and low resource consumption.
# why use Nginx here: Nginx is used here to serve the static files of the React app. It is efficient and can handle a large number of concurrent connections, making it suitable for serving web applications.
# why use multi-stage builds: Multi-stage builds are used to reduce the size of the final Docker image. The first stage builds the React app, and the second stage serves it with Nginx. This way, the final image only contains the necessary files to run the app, without including the build tools and dependencies.
# why Nginx is used here: Nginx is used here to serve the static files of the React app. It is efficient and can handle a large number of concurrent connections, making it suitable for serving web applications. Additionally, Nginx provides features like caching, load balancing, and security configurations that can enhance the performance and reliability of the application.

