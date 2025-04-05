#!/bin/sh

echo "Starting certificate generation..."

if [ ! -f "/etc/nginx/ssl/nginx.crt" ] || [ ! -f "/etc/nginx/ssl/nginx.key" ]; then
    echo "Certificates not found, generating..."
    mkdir -p /etc/nginx/ssl || { echo "Failed to create /etc/nginx/ssl"; exit 1; }
    
    echo "Generating private key..."
    openssl genpkey -algorithm RSA -out /etc/nginx/ssl/nginx.key || { echo "Failed to generate key"; exit 1; }
    if [ -f "/etc/nginx/ssl/nginx.key" ]; then
        echo "Private key generated."
    else
        echo "Private key not found after generation!"
        exit 1
    fi
    
    echo "Generating certificate..."
    openssl req -new -x509 -key /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt \
        -days 365 \
        -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=${CERT_CN:-localhost}" || { echo "Failed to generate cert"; exit 1; }
    if [ -f "/etc/nginx/ssl/nginx.crt" ]; then
        echo "Certificate generated."
    else
        echo "Certificate not found after generation!"
        exit 1
    fi
    
    chmod 600 /etc/nginx/ssl/nginx.key || { echo "Failed to set key permissions"; exit 1; }
    chmod 644 /etc/nginx/ssl/nginx.crt || { echo "Failed to set cert permissions"; exit 1; }
    echo "Certificates generated successfully."
else
    echo "Certificates already exist."
fi

echo "Starting Nginx..."
exec "$@"