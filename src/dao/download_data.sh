#!/bin/bash

# URL of the file to download
URL="https://data.assemblee-nationale.fr/static/openData/repository/17/dossiers_legislatifs_opendata/52428/libre_office.csv"

# Base directory for storing the data
BASE_DIR="/Users/alihmaou/Projets/hackathon/lawwatch/data/PLF2026/LECTURE_1"

# Create the directory if it doesn't exist
mkdir -p "$BASE_DIR"

# Generate the timestamp
TIMESTAMP=$(date +"%Y%m%d%H%M")

# Construct the filename
FILENAME="${TIMESTAMP}_PLF2026_LECTURE_1.csv"
FILEPATH="$BASE_DIR/$FILENAME"

# Download the file and capture output
if curl -o "$FILEPATH" "$URL"; then
  echo "$(date +"%Y-%m-%d %H:%M:%S") - SUCCESS: File downloaded and saved to $FILEPATH"
else
  echo "$(date +"%Y-%m-%d %H:%M:%S") - ERROR: Failed to download file from $URL"
fi
