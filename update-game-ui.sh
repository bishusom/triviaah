#!/bin/bash

# update-game-ui.sh
# Usage: ./update-game-ui.sh <page-file> [game-type]

# Example usage:
# ./update-game-ui.sh src/app/word-games/word-ladder/page.tsx word
# ./update-game-ui.sh src/app/word-games/boggle/page.tsx word
# ./update-game-ui.sh src/app/number-puzzles/sudoku/page.tsx number

PAGE_FILE="$1"
GAME_TYPE="${2:-word}"  # Default to 'word' if not specified

if [ -z "$PAGE_FILE" ]; then
    echo "Error: No page file specified"
    echo "Usage: $0 <page-file> [game-type]"
    echo "Game types: word, number, brainwave"
    exit 1
fi

if [ ! -f "$PAGE_FILE" ]; then
    echo "Error: File $PAGE_FILE not found"
    exit 1
fi

# Set color scheme based on game type
case $GAME_TYPE in
    "word")
        PRIMARY_COLOR="green"
        GRADIENT_FROM="green-500"
        GRADIENT_TO="emerald-500"
        ;;
    "number")
        PRIMARY_COLOR="purple"
        GRADIENT_FROM="purple-500"
        GRADIENT_TO="pink-500"
        ;;
    "brainwave")
        PRIMARY_COLOR="cyan"
        GRADIENT_FROM="cyan-500"
        GRADIENT_TO="blue-500"
        ;;
    *)
        PRIMARY_COLOR="green"
        GRADIENT_FROM="green-500"
        GRADIENT_TO="emerald-500"
        ;;
esac

echo "Updating $PAGE_FILE with $GAME_TYPE theme..."

# Create backup
cp "$PAGE_FILE" "${PAGE_FILE}.backup"

# Apply transformations
sed -i.tmp "
# Update main container background
s/<div className=\"page-with-ads\">/<div className=\"min-h-screen bg-gradient-to-b from-gray-900 to-gray-800\">/g

# Update header container
s/<div className=\"text-center mb-8\">/<div className=\"text-center mb-12\">/g

# Update main title
s/<h1 className=\"text-3xl font-bold\">/<h1 className=\"text-4xl md:text-5xl font-bold text-white mb-4\">/g
s/<h1 className=\"text-3xl md:text-4xl font-bold text-gray-800\">/<h1 className=\"text-4xl md:text-5xl font-bold text-white mb-4\">/g

# Update subtitle/description
s/<p className=\"text-lg text-gray-600\">/<p className=\"text-lg text-gray-300 max-w-2xl mx-auto\">/g
s/<p className=\"text-xl text-gray-600.*mx-auto\">/<p className=\"text-lg text-gray-300 max-w-2xl mx-auto\">/g

# Update timestamp styling
s/bg-[a-z]*-50.*border-[a-z]*-200/bg-${PRIMARY_COLOR}-500\/10 border border-${PRIMARY_COLOR}-500\/20 text-white/g

# Update FAQ section
s/bg-gray-50 p-6 rounded-lg/bg-gray-800 rounded-2xl p-6 border border-gray-700/g
s/<h2 className=\"text-xl font-bold\">/<h2 className=\"text-xl font-bold text-white\">/g
s/<h2 className=\"text-2xl font-bold text-gray-300\">/<h2 className=\"text-2xl font-bold text-white\">/g
s/<h3 className=\"font-semibold\">/<h3 className=\"font-semibold text-white\">/g
s/<h3 className=\"text-xl font-semibold text-gray-300/<h3 className=\"text-xl font-semibold text-white/g
s/<p className=\"text-gray-600\"/<p className=\"text-gray-300\"/g
s/text-gray-600 text-sm/text-gray-300 text-sm/g

# Update content sections
s/bg-white rounded-xl shadow-md p-8/bg-gray-800 rounded-2xl p-8 border border-gray-700/g
s/bg-white rounded-lg shadow-md p-6/bg-gray-800 rounded-2xl p-6 border border-gray-700/g
s/prose prose-lg text-gray-600/prose prose-invert prose-lg max-w-none text-gray-300/g
s/prose text-gray-700/prose prose-invert max-w-none text-gray-300/g

# Update tip boxes and highlighted sections
s/bg-blue-50.*border-blue-200/bg-gradient-to-r from-${GRADIENT_FROM}\/10 to-${GRADIENT_TO}\/10 rounded-xl border border-${GRADIENT_FROM}\/20/g
s/bg-indigo-50.*border-indigo-200/bg-gradient-to-r from-${GRADIENT_FROM}\/10 to-${GRADIENT_TO}\/10 rounded-xl border border-${GRADIENT_FROM}\/20/g
s/text-blue-800/text-white/g
s/text-indigo-800/text-white/g
s/font-bold text-blue-800/font-bold text-${PRIMARY_COLOR}-300/g

# Update lists and bullet points
s/<li><strong>/<li><strong className=\"text-${PRIMARY_COLOR}-300\">/g

# Update hidden SEO content background if present
s/<div className=\"sr-only\" aria-hidden=\"false\">/<div className=\"sr-only\" aria-hidden=\"false\">/g
" "$PAGE_FILE"

# Clean up temporary file
rm -f "${PAGE_FILE}.tmp"

echo "✅ Updated $PAGE_FILE successfully!"
echo "📁 Backup created at ${PAGE_FILE}.backup"
