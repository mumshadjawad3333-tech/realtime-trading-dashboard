# Use Node 20 or later for better ESM support
FROM node:20-slim

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Expose the port your server is running on
EXPOSE 4000

# Start the application using the compiled JS
CMD ["npm", "start"]