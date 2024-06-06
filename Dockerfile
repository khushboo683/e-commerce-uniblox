# Stage 1: Build the application
FROM node:18 AS build

WORKDIR /app

# Install Python
RUN apt-get update && apt-get install -y python3 g++ make

COPY package*.json ./

# Set Python for node-gyp
ENV PYTHON /usr/bin/python3

# Install dependencies
RUN npm install

COPY . .

# Rebuild bcrypt to ensure correct architecture
RUN npm rebuild bcrypt --build-from-source

# Stage 2: Run the application
FROM node:18

WORKDIR /app

COPY --from=build /app /app

CMD ["npm", "run", "start"]
