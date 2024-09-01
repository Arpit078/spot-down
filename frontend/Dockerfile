# Use a specific Node.js version
FROM node:18.19.1

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Set environment variable for port
ENV PORT=3000

# Expose the port the app will run on
EXPOSE 3000

# Serve the application using a simple server
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
