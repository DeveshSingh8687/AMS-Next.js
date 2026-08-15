# Dockerfile

# Start from your base image, e.g. Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy your application code
COPY . .

# Remove Next.js and other caches before build  
RUN rm -rf .next/ node_modules/.cache/ 

# Build the Next.js app (optional, depends on your setup)
RUN npm run build


# Expose the port your app runs on
EXPOSE 3000

# Start your app
CMD ["npm", "start"]
