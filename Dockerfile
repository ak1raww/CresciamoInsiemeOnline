FROM nginx:alpine

# Copy static site
COPY . /usr/share/nginx/html

# Copy template config for envsubst processing
COPY default.conf.template /etc/nginx/templates/default.conf.template

# Expose the dynamic port (Koyeb will set PORT env var)
EXPOSE $PORT

# Start Nginx with envsubst to replace ${PORT}
CMD ["sh", "-c", "envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
