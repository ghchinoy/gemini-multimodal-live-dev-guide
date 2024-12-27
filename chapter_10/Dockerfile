# Use the official Node.js image
FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Install a simple HTTP server
RUN npm install -g http-server

# Copy application files
COPY . .

# Expose the port
EXPOSE 8080

# Start the server
CMD ["http-server", "--port", "8080"]
