#!/bin/bash

# Define variables
BUILD_DIR="/home/salt_user/app/salt-autofi/dist"

# Function to print progress
print_progress() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Remove the build directory
print_progress "Removing the current dist directory: $BUILD_DIR"
print_progress "..."
sudo rm -rf "$BUILD_DIR"
print_progress "..."
print_progress "Removed the build directory: $BUILD_DIR"
print_progress ""
print_progress ""
print_progress ""

print_progress "Running Webpack to compile the new build"
print_progress "..."
npx webpack --config webpack.config.js
print_progress "..."
print_progress "Done."
print_progress ""
print_progress ""
print_progress ""
