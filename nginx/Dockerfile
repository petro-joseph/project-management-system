FROM nginx:latest

# Copy the generate-certs.sh script to the correct location
COPY generate-certs.sh /etc/nginx/generate-certs.sh

# Make the script executable
RUN chmod +x /etc/nginx/generate-certs.sh

# Create SSL directory and set permissions
RUN mkdir -p /etc/nginx/ssl && chmod 700 /etc/nginx/ssl

# Generate SSL certificates during build
RUN /etc/nginx/generate-certs.sh

# Copy nginx.conf after certificates are generated
COPY nginx.conf /etc/nginx/nginx.conf

# Verify certificate generation
RUN test -f /etc/nginx/ssl/nginx.crt && test -f /etc/nginx/ssl/nginx.key || (echo "SSL certificates were not generated!" && exit 1)

EXPOSE 80
