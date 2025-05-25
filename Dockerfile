# Use a Node.js image as the base.
# This image comes with Node.js and npm pre-installed.
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first.
# This allows Docker to cache these layers, speeding up builds if dependencies don't change.
COPY package.json package-lock.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your Angular project files into the container
COPY . .

# Expose the port that Angular's development server typically runs on (4200)
EXPOSE 4200

# Command to run when the container starts.
# We'll use 'npm start' which should run 'ng serve'
CMD ["npm", "start"]