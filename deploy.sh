#!/usr/bin/env bash

set -euo pipefail

APP_DIR="/var/www/hello"
BRANCH="${1:-master}"
PM2_APP_NAME="${PM2_APP_NAME:-hellobubble}"

echo "Starting deploy for ${PM2_APP_NAME} (${BRANCH})..."

if [[ ! -d "${APP_DIR}" ]]; then
  echo "Error: app directory not found: ${APP_DIR}"
  exit 1
fi

cd "${APP_DIR}"

echo "Fetching latest code..."
git fetch origin
git checkout "${BRANCH}"
git pull --ff-only origin "${BRANCH}"

echo "Installing dependencies..."
npm ci

echo "Building project..."
npm run build

echo "Restarting PM2 process..."
if pm2 describe "${PM2_APP_NAME}" >/dev/null 2>&1; then
  pm2 restart "${PM2_APP_NAME}"
else
  pm2 start npm --name "${PM2_APP_NAME}" -- start
fi

pm2 save

echo "Deploy completed successfully."
pm2 status "${PM2_APP_NAME}"
