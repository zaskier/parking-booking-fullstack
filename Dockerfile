# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json ./
COPY yarn.lock ./

# Install app dependencies
RUN yarn install

# Copy the rest of the application's source code
COPY . .

# Expose port 3000
EXPOSE 3000

# The command to run the development server
CMD ["yarn", "dev"]
