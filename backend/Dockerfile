FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies including dev tools
COPY package*.json ./
RUN npm install

# Install ts-node globally (optional, if not in package.json)
RUN npm install -g ts-node

# Copy application code
COPY . .

# Expose the port from docker-compose.yml
EXPOSE 3001

# Start the app
CMD ["npm", "start"]