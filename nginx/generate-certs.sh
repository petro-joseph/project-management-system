#!/bin/sh

# Check if certificates already exist
if [ ! -f "/etc/nginx/ssl/nginx.crt" ] || [ ! -f "/etc/nginx/ssl/nginx.key" ]; then
    # Create the SSL directory if it doesn't exist
    mkdir -p /etc/nginx/ssl
    
    # Generate a private key
    openssl genpkey -algorithm RSA -out /etc/nginx/ssl/nginx.key
    
    # Generate a self-signed certificate
    openssl req -new -x509 -key /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt \
        -days 365 \
        -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=example.com"
    
    # Set proper permissions
    chmod 600 /etc/nginx/ssl/nginx.key
    chmod 644 /etc/nginx/ssl/nginx.crt
fi
