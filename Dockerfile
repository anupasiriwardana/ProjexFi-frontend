FROM node:lts

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Vite requires the --host flag to allow traffic outside the container to find it
CMD ["npm", "run", "dev", "--", "--host"]