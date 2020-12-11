// GUILLOTINE - CLI
//

const prompts = require("prompts");
const { processAllImgs } = require('./images');
const defaults = require('../defaults.config');

let config;

try {
  config = require(path.resolve(process.cwd(), './guillotine.config.js'));
} catch (err) {
  config = {};
}

const globalConfig = Object.assign({}, defaults, config);

const guillotine = {};

guillotine.Prompt = async () => {
  const response = await prompts([
    {
      type: "select",
      name: "guillotine",
      message: `Would you like to process all images inside '${globalConfig.inputDir}'?\n`,
      choices: [
        { title: 'yes', value: true },
        { title: 'no', value: false },
      ],
      initial: 0
    }
  ]);

  const { guillotine } = response || {};

  if (guillotine) {
    await processAllImgs();
  }

};

module.exports = guillotine;
