# Nginx with SSL and wait-for-it scripts
FROM nginx:1.25.3-alpine

# Install necessary packages and copy scripts/config
RUN apk update && \
    apk add --no-cache bash curl openssl && \
    rm -rf /var/cache/apk/*

# Copy SSL generation and wait scripts, plus nginx config
COPY generate-certs.sh /etc/nginx/generate-certs.sh
COPY wait-for-it.sh /etc/nginx/wait-for-it.sh
COPY nginx.conf /etc/nginx/nginx.conf

# Make scripts executable and prepare SSL directory
RUN chmod +x /etc/nginx/generate-certs.sh && \
    chmod +x /etc/nginx/wait-for-it.sh && \
    mkdir -p /etc/nginx/ssl && \
    chmod 700 /etc/nginx/ssl

# Create non-root user for better security
RUN addgroup -S nginxgroup && adduser -S nginxuser -G nginxgroup && \
    # Change ownership of necessary directories before switching user
    # Ensure Nginx can write logs, cache, and potentially temp config files
    chown -R nginxuser:nginxgroup /etc/nginx/ssl && \
    chown -R nginxuser:nginxgroup /var/cache/nginx && \
    chown -R nginxuser:nginxgroup /var/log/nginx && \
    chown -R nginxuser:nginxgroup /etc/nginx/conf.d && \
    chown -R nginxuser:nginxgroup /etc/nginx/nginx.conf

# Wait for backend, generate certs, then start Nginx
# ENTRYPOINT ["/etc/nginx/generate-certs.sh", "nginx", "-g", "daemon off;"]
ENTRYPOINT ["/etc/nginx/wait-for-it.sh", "backend:3001", "--", "/etc/nginx/wait-for-it.sh", "frontend:3000", "--", "/etc/nginx/wait-for-it.sh", "grafana:3000", "--", "/etc/nginx/wait-for-it.sh", "prometheus:9090", "--", "/etc/nginx/wait-for-it.sh", "adminer:8080", "--", "/etc/nginx/generate-certs.sh", "nginx", "-g", "daemon off;"]

EXPOSE 8085 443