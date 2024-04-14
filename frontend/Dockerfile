# Use a base image with Node.js installed
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the frontend application
# RUN npm list
RUN npm run build 
RUN npm install -g serve 

# Expose the port on which the frontend will run
EXPOSE 8080

# Start the frontend application
CMD ["npx", "serve", "-s", "-l", "8080", "build"]
