#!/bin/bash
# ============================
# Cloud-init provisioning script for Node.js app
# ============================

# Update system
apt-get update -y
apt-get upgrade -y

# Install basic tools
apt-get install -y curl wget unzip git software-properties-common build-essential

# Install Python (useful for ansible/bootstrap scripts)
apt-get install -y python3 python3-pip

# Install Node.js (LTS) + npm from NodeSource
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
apt-get install -y nodejs

# Verify installation
node -v
npm -v

# Install pm2 (process manager for Node apps)
npm install -g pm2

# (Optional) Install Nginx as reverse proxy
apt-get install -y nginx
systemctl enable nginx
systemctl start nginx

# Replace default Nginx page with a test page
echo "<h1>Node.js App Server - $(hostname)</h1>" > /var/www/html/index.html

# Create app directory
mkdir -p /opt/hr-portal
chown azureuser:azureuser /opt/hr-portal

# Log setup
echo "Cloud-init script executed successfully on $(date)" >> /var/log/cloud-init-script.log
