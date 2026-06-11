#!/bin/bash
echo "🚀 Deploying Trakjobs Admin..."
cd /var/www/Trakjobs-admin
git fetch origin
git reset --hard origin/main
npm ci
npm run build
chown -R www-data:www-data /var/www/Trakjobs-admin
chmod -R 755 /var/www/Trakjobs-admin
systemctl reload nginx
echo "✅ Admin Deployed Successfully!"
