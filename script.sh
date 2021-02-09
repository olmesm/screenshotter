#! /usr/bin/env bash

OUTPUT_DIR=screenshots

rm -rf $OUTPUT_DIR 2>&1
mkdir $OUTPUT_DIR

function capture () {
    URL=$1
    FILE_NAME=${2:-$URL} # default to url if no filename provided
    OUTPUT_FILE=$OUTPUT_DIR/$FILE_NAME.png

    $(npm bin)/capture-website $URL --full-page --output=$OUTPUT_FILE

    node ./watermark.js $OUTPUT_FILE overwrite
}

capture http://example.com example-screenshot

echo ">> Done!"