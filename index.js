// GUILLOTINE: 🔪 SOME IMAGE SLICE 'N' DICE 🔪
//

const cli = require('./src/cli');

const {
  imgToAnimatedGIF,
  imgToGIF,
  imgToPNG,
  imgToJPG,
  imgResize,
  processImg,
  processAllImgs,
 } = require('./src/images');

module.exports = {
  cli,
  imgToAnimatedGIF,
  imgToGIF,
  imgToPNG,
  imgToJPG,
  imgResize,
  processImg,
  processAllImgs,
};
