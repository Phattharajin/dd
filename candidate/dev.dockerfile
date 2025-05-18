# Use official Nginx base image
FROM nginx:alpine

# Remove the default nginx static 
RUN rm -rf /usr/share/nginx/html/*

# Copy your frontend files to Nginx's public directory
COPY ..

# Copy custom nginx config to change port to 3000
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 3000
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
