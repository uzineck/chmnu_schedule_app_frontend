# Use Node as the base image for all stages
FROM node:23-alpine AS base

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json .
ARG NODE_ENV=production

RUN yarn install --production=false

# Copy the rest of the files to the container
COPY . .

# Development stage: Runs the React development server with live reload
FROM base AS dev
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]

# Production build stage: Builds optimized static files
FROM base AS build
ENV NODE_ENV=production
RUN yarn build

# Production runtime stage: Serves static files with Nginx
FROM nginx:stable-alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]