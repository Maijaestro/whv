#!/usr/bin/env bash
set -e
DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$DIR"
echo "Pulling latest from origin..."
git pull origin main || git pull
echo "Installing dependencies..."
npm ci --prefer-offline
echo "Building..."
npm run build
echo "Done. Restart your server process (systemd, pm2, docker, etc.)"
