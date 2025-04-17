# Use base Node image
ARG NODE_VERSION=23.9.0

FROM node:${NODE_VERSION}-slim

# Create app directory
WORKDIR /app

# Copy both frontend and backend
COPY ./backend ./backend
COPY ./frontend ./frontend

# Install backend dependencies
WORKDIR /app/backend
RUN npm install
RUN npm run dbInit

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm install

# Install a process manager to run both
WORKDIR /app
RUN npm install -g concurrently

# Expose both ports
EXPOSE 3000 5003

# Start both apps
CMD concurrently "npm --prefix backend run start" "npm --prefix frontend run dev"
