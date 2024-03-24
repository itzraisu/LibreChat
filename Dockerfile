# Base node image
FROM node:18-alpine AS build

# Install system dependencies
RUN apk add --no-cache g++ make py-pip curl

# Set user to node
USER node

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json to cache dependencies
COPY package*.json ./

# Install production dependencies
RUN npm install --production --silent

# Copy the rest of the application code
COPY . .

# Build the react app
RUN npm run build

# Node API setup
FROM node:18-alpine AS run

# Install system dependencies
RUN apk add --no-cache g++ make py-pip curl

# Set user to node
USER node

# Create app directory
WORKDIR /app

# Copy the application code
COPY --from=build /app .

# Expose the API port
EXPOSE 3080

# Set environment variables
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV HOST=0.0.0.0

# Run the backend
CMD ["npm", "run", "backend"]

# Optional: for client with nginx routing
# FROM nginx:stable-alpine AS nginx-client
# WORKDIR /usr/share/nginx/html
# COPY --from=run /app/client/dist /usr/share/nginx/html
# COPY client/nginx.conf /etc/nginx/conf.d/default.conf
# ENTRYPOINT ["nginx", "-g", "daemon off;"]
