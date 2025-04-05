FROM nginx:latest

# Copy the generate-certs.sh script, wait-for-it.sh, and nginx.conf
COPY generate-certs.sh /etc/nginx/generate-certs.sh
COPY wait-for-it.sh /etc/nginx/wait-for-it.sh
COPY nginx.conf /etc/nginx/nginx.conf

# Make scripts executable and prepare SSL directory
RUN chmod +x /etc/nginx/generate-certs.sh && \
    chmod +x /etc/nginx/wait-for-it.sh && \
    mkdir -p /etc/nginx/ssl && \
    chmod 700 /etc/nginx/ssl

# Wait for backend, generate certs, then start Nginx
# ENTRYPOINT ["/etc/nginx/generate-certs.sh", "nginx", "-g", "daemon off;"]
ENTRYPOINT ["/etc/nginx/wait-for-it.sh", "backend:3001", "--", "/etc/nginx/wait-for-it.sh", "frontend:3000", "--", "/etc/nginx/wait-for-it.sh", "grafana:3000", "--", "/etc/nginx/wait-for-it.sh", "prometheus:9090", "--", "/etc/nginx/wait-for-it.sh", "adminer:8080", "--", "/etc/nginx/generate-certs.sh", "nginx", "-g", "daemon off;"]
EXPOSE 8085 443