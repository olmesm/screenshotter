const text2png = require("text2png");
const Jimp = require("jimp");
const [, , ORIGINAL_IMAGE_PATH, SHOULD_OVERWRITE] = process.argv;

// Usage
// node ./watermark.js <FILE_NAME> [overwrite]

const shouldOverwrite = SHOULD_OVERWRITE === "overwrite";

const originalFileName = ORIGINAL_IMAGE_PATH.replace(
  /.*\/([^\.\/\\]*)\.[A-z]{0,4}$/gi,
  "$1"
);

const LOGO = text2png(originalFileName, {
  color: "red",
});

const LOGO_MARGIN_PERCENTAGE = 5;

const outputFilePath = shouldOverwrite
  ? ORIGINAL_IMAGE_PATH
  : ORIGINAL_IMAGE_PATH + "_marked";

const main = async () => {
  const [image, logo] = await Promise.all([
    Jimp.read(ORIGINAL_IMAGE_PATH),
    Jimp.read(LOGO),
  ]);

  logo.resize(image.bitmap.width / 10, Jimp.AUTO);

  const xMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
  const yMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;

  const X = xMargin;
  const Y = yMargin;

  return image.composite(logo, X, Y, [
    {
      mode: Jimp.BLEND_SCREEN,
      opacitySource: 0.1,
      opacityDest: 1,
    },
  ]);
};

main()
  .then((image) => image.write(outputFilePath))
  .catch(console.error);
