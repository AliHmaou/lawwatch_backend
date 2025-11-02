#!/bin/bash

# Base directory for storing the data
BASE_DIR="data/PLF2026/LECTURE_1/TEXTES"
LIENS_TEXTES_FILE="data/PLF2026/LECTURE_1/PLF2026_LECTURE_1_LIENS_TEXTES.json"

# Create the directory if it doesn't exist
mkdir -p "$BASE_DIR"

# The JSON file is a stream of concatenated JSON objects.
# We add commas between the objects and wrap them in an array to make it a valid JSON array.
sed 's/}{/},{/g' "$LIENS_TEXTES_FILE" | sed 's/^/[/' | sed 's/$/]/' | jq -c '.[]' | while read -r line; do
  numero=$(echo "$line" | jq -r '."Numéro de l'\''amendement"')
  url=$(echo "$line" | jq -r '.url_json')
  filepath="$BASE_DIR/$numero.json"

  if [ ! -f "$filepath" ]; then
    if [ -n "$url" ] && [ "$url" != "null" ]; then
      if curl -L -o "$filepath" "$url"; then
        echo "$(date +"%Y-%m-%d %H:%M:%S") - SUCCESS: File downloaded and saved to $filepath"
      else
        echo "$(date +"%Y-%m-%d %H:%M:%S") - ERROR: Failed to download file from $url"
        rm -f "$filepath" # Remove empty file on failure
      fi
    else
      echo "$(date +"%Y-%m-%d %H:%M:%S") - WARNING: No URL for amendment $numero, skipping."
    fi
  else
    echo "$(date +"%Y-%m-%d %H:%M:%S") - INFO: File $filepath already exists, skipping download."
  fi
done
