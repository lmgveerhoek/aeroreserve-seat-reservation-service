FROM node:16-alpine

# Setting the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json) for better caching
COPY package*.json ./

# Install dependencies
# Adding this before copying the entire source code utilizes Docker cache
# This means changes in the source code won't invalidate the cache at the dependency installation step
RUN npm install

# Copy tsconfig.json separately for better caching, in case it changes less frequently than source code
COPY tsconfig.json ./

# Copy the source code into the container
COPY src ./src

# Build the application
RUN npm run build

# The command to run the application
CMD [ "node", "./dist/app.js" ]