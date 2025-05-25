#!/bin/bash

echo "🔍 Replacing all 'track.artist' and 'track.artists' with 'formatArtists(track.artists || track.artist)'..."

# Search and replace both variations across .tsx and .ts files
grep -rl "track.artist" ./src | xargs sed -i '' 's/track\.artist/formatArtists(track.artists || track.artist)/g'
grep -rl "track.artists" ./src | xargs sed -i '' 's/track\.artists/formatArtists(track.artists || track.artist)/g'

echo "✅ Replacement complete. Make sure 'formatArtists' is imported where needed."

# Optional: add import line to top of each file if missing
FILES=$(grep -rl "formatArtists(" ./src)
for FILE in $FILES
do
  if ! grep -q "import { formatArtists" "$FILE"; then
    sed -i '' '1s/^/import { formatArtists } from "src\/utils\/formatArtists";\n/' "$FILE"
    echo "💡 Added missing import in $FILE"
  fi
done

echo "🎉 All artist references normalized. Review changes in Git."
