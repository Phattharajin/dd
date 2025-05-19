# Use official Node.js image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your app uses (change if not 3000)
EXPOSE 3001

# Run the app
CMD ["node", "app.js"]
