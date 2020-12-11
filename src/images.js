// GUILLOTINE - IMAGE METHODS
//

const ora = require('ora');
const chalk = require('chalk');
const path = require('path');
const util = require('util');
const { createWriteStream } = require('fs');
const { exec } = require('child_process');
const execPromise = util.promisify(exec);
const { noop, createDirectory, customSpinner, getAllFilepaths, parseImageDimensions, parseBufferToString, escapeFilepathString, generateFilename } = require('./utils');
const defaults = require('../defaults.config');

// FETCH CONFIG
//
let config;
try {
  // TEST LOCAL FILE
  //
  // config = require('../guillotine.config.js');

  config = require(path.resolve(process.cwd(), './guillotine.config.js'));
} catch (err) {
  config = {};
}

// GLOBALS
const globalConfig = Object.assign({}, defaults, config);

// PROCESS LOCATION
const pwd = process.cwd();

// DIRECTORIES & FILES
const input = path.resolve(pwd, globalConfig.inputDir);
const output = path.resolve(pwd, globalConfig.outputDir);
const logs = path.resolve(pwd, globalConfig.logsDir);
const logFile = path.resolve(pwd, globalConfig.logsDir, globalConfig.logFile);

// SETTINGS
const allow = globalConfig.allow;
const ignore = globalConfig.ignore;
const prefix = globalConfig.prefix;
const suffix = globalConfig.suffix;

// REGEX
const includeRE = new RegExp(Object.keys(allow || {}).join('|'));
const excludeRE = new RegExp((ignore || []).join('|'));

// METHODS
const getImgDimensions = async (filename) => {
  let result = '';

  try {
    const fname = escapeFilepathString(filename);
    const imgInput = `${input}/${fname}`;
    const cmd = `magick identify -ping -format "%wx%h" ${imgInput}`;
    const { stdout, stderr } = await execPromise(cmd);

    if (!stderr && stdout) {
      result = parseBufferToString(stdout);
    }
  } catch (err) {
    console.log('🚫', 'getImgDimensions', `${chalk.red(err.stderr || err)}`);
  }

  return result;
};

const imgToAnimatedGIF = async (filename, options) => {
  const { dimensions = '', minSpriteSize = '', loop = 0, delay = 0 } = options || {};

  try {
    const fname = escapeFilepathString(filename);
    const imgInput = `${input}/${fname}`;
    const imgOutput = `${output}/${generateFilename(filename, suffix, prefix)}.gif`;
    const cmd = `magick convert -dispose 3 -loop ${loop} -delay ${delay} ${imgInput} -crop ${dimensions} +repage ${imgOutput}`
    const cmdAlt = `magick convert ${imgInput} -resize ${dimensions} ${imgOutput}`;

    const results = await getImgDimensions(fname);
    const [rawWidth, rawHeight] = parseImageDimensions(results);
    const [w, h] = parseImageDimensions(dimensions);

    // LET'S ASSUME AN IMAGE DOUBLE ITS SIZE IS A SPRITE 🤞
    // SOME ASSETS WON'T BE SPRITES, JUST MAKE SURE THEY'RE SIZED RIGHT
    //
    if (rawWidth % w === 0 && rawWidth >= Number(minSpriteSize || 0)) {
      await execPromise(cmd);
    } else {
      await execPromise(cmdAlt);
    }

  } catch (err) {
    console.log('🚫', 'imgToAnimatedGIF', `${chalk.red(err.stderr || err)}`);
  }
};

const imgToGIF = async (filename, options) => {
  const { dimensions = '', foregroundImg = '', backgroundImg = '' } = options || {};

  try {
    const fname = escapeFilepathString(filename);
    const imgInput = `${input}/${fname}`;
    const imgOutput = `${output}/${generateFilename(filename, suffix, prefix)}.gif`;
    const hasLayers = foregroundImg || backgroundImg;
    const src = hasLayers ? `${backgroundImg} ${imgInput} ${foregroundImg}` : `${imgInput}`;
    const cmd = `magick convert ${src} ${hasLayers && '-compose over -composite'} -resize ${dimensions} ${imgOutput}`;

    await execPromise(cmd);
  } catch (err) {
    console.log('🚫', 'imgToGIF', `${chalk.red(err.stderr || err)}`);
  }
};

const imgToPNG = async (filename, options) => {
  const { dimensions = '', foregroundImg = '', backgroundImg = '' } = options || {};

  try {
    const fname = escapeFilepathString(filename);
    const imgInput = `${input}/${fname}`;
    const imgOutput = `${output}/${generateFilename(filename, suffix, prefix)}.png`;
    const hasLayers = foregroundImg || backgroundImg;
    const src = hasLayers ? `${backgroundImg} ${imgInput} ${foregroundImg}` : `${imgInput}`;
    const cmd = `magick convert ${src} ${hasLayers && '-compose over -composite'} -resize ${dimensions} ${imgOutput}`;


    await execPromise(cmd);
  } catch (err) {
    console.log('🚫', 'imgToPNG', `${chalk.red(err.stderr || err)}`);
  }
};

const imgToJPG = async (filename, options) => {
  const { dimensions = '', foregroundImg = '', backgroundImg = '', quality = 100 } = options || {};

  try {
    const fname = escapeFilepathString(filename);
    const imgInput = `${input}/${fname}`;
    const imgOutput = `${output}/${generateFilename(filename, suffix, prefix)}.jpg`;
    const hasLayers = foregroundImg || backgroundImg;
    const src = hasLayers ? `${backgroundImg} ${imgInput} ${foregroundImg}` : `${imgInput}`;
    const cmd = `magick convert ${src} ${hasLayers && '-compose over -composite'} -resize ${dimensions} -quality ${quality} ${imgOutput}`

    await execPromise(cmd);
  } catch (err) {
    console.log('🚫', 'imgToJPG', `${chalk.red(err.stderr || err)}`);
  }
};

const imgResize = async (filename, options) => {
  const { dimensions = '', mimetype, foregroundImg = '', backgroundImg = '' } = options || {};

  try {
    const fname = escapeFilepathString(filename);
    const _mimetype = mimetype ? `.${mimetype.replace('.', '')}` : path.extname(filename);
    const imgInput = `${input}/${fname}`;
    const imgOutput = `${output}/${generateFilename(filename, suffix, prefix)}${_mimetype}`;
    const hasLayers = foregroundImg || backgroundImg;
    const src = hasLayers ? `${backgroundImg} ${imgInput} ${foregroundImg}` : `${imgInput}`;
    const cmd = `magick convert ${src} ${hasLayers && '-compose over -composite'} -resize ${dimensions} ${imgOutput}`;

    await execPromise(cmd);
  } catch (err) {
    console.log('🚫', 'imgResize', `${chalk.red(err.stderr || err)}`);
  }
};

const copyImg = async (filename) => {
  try {
    const fname = escapeFilepathString(filename);
    const mimetype = path.extname(fname);
    const imgInput = `${input}/${fname}`;
    const imgOutput = `${output}/${generateFilename(filename, suffix, prefix)}${mimetype}`;
    const cmd = `cp -f ${imgInput} ${imgOutput}`;

    await execPromise(cmd);
  } catch (err) {
    console.log('🚫', 'copyImg', `${chalk.red(err.stderr || err)}`);
  }
};

const getProcessableImgs = (filepaths) => {
  const processableImgs = [];
  const unprocessableImgs = [];

  filepaths.forEach(f => {
    if (f.isFile()) {
      if (allow && Object.keys(allow).length > 0 && includeRE.test(f.name) && !excludeRE.test(f.name)) {
        processableImgs.push(f.name);
      } else {
        unprocessableImgs.push(f.name);
      }
    }
  });

  return [
    processableImgs,
    unprocessableImgs,
  ];
};

const processImg = (filename, callback = noop) => {
  const imgType = filename.match(includeRE);

  let p;

  if (imgType && allow && Object.keys(allow).length > 0) {
    if (allow[imgType] && allow[imgType].transform === 'imgToAnimatedGIF') {
      p = imgToAnimatedGIF(filename, allow[imgType]);
    } else if (allow[imgType] && allow[imgType].transform === 'imgToGIF') {
      p = imgToGIF(filename, allow[imgType]);
    } else if (allow[imgType] && allow[imgType].transform === 'imgToPNG') {
      p = imgToPNG(filename, allow[imgType]);
    } else if (allow[imgType] && allow[imgType].transform === 'imgToJPG') {
      p = imgToJPG(filename, allow[imgType]);
    } else {
      p = imgResize(filename, allow[imgType]);
    }
  }

  callback();

  return p;
};

const processImgQueueLogs = (queue) => {
  try {
    const logger = createWriteStream(logFile);

    queue.forEach((filename) => {
      logger.write(path.resolve(pwd, input, filename) + '\n');
    });

    logger.end();
  } catch (err) {
    console.log('🚫', 'processImgQueueLogs', `${chalk.red(err.stderr || err)}`);
  }
};

// TODO: REFACTOR
//
// NOTE: PERFORMANCE SLOWER ON LARGER BATCHES
//
const processImgQueueBatch = async (queue, callback) => {
  let batchPosition = 0;
  const batchSize = 250;

  while (queue.length > batchPosition) {
    await Promise.all(queue
      .slice(batchPosition, batchPosition + batchSize)
      .map((filename) => processImg(filename, callback))
    );

    batchPosition += Math.min(queue.length, batchSize);
  }
};

// TODO: REVISIT
//
// PROBLEM: VERY LARGE NUMBER OF `child_processes` CAUSE `ENTCONN ERROR` 🤷‍♂️
// WORKAROUND - BATCH CHILD_PROCESSES, SEE `processImgQueueBatch`
//
const processImgQueue = async (queue, callback) => {
  await Promise.all(queue.map((filename) => processImg(filename, callback)));
};

const processAllImgs = async () => {
  let spinner = ora({ spinner: { frames: customSpinner } });

  console.log(`🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪`);
  console.log(`\n🔪🔪🔪   💀 ${chalk.strikethrough.red(' GUILLOTINE ')} 💀   🔪🔪🔪\n`);
  console.log(`🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪\n\n`);
  console.log(`🔍 ${chalk.yellow('HUNTING IMAGES...')}\n`);

  try {
    const hasInputDir = await createDirectory(input);

    if (hasInputDir) {
      const filepaths = await getAllFilepaths(input);

      if (Array.isArray(filepaths) && filepaths.length > 0) {
        const [processableImgs, unprocessableImgs] = getProcessableImgs(filepaths);
        const totalImgs = filepaths.length;
        const totalProcessableImgs = processableImgs.length;
        const totalUnprocessableImgs = unprocessableImgs.length;

        console.log(`🦷 ${totalImgs} VICTIMS FOUND (processable: ${chalk.green(totalProcessableImgs)}, unprocessable: ${chalk.red(totalUnprocessableImgs)})\n`);

        try {
          // IF ITS NOT IN THE CONFIG LETS LOG IT TO `logFile`
          // WE PROB STILL NEED THE IMAGE, SO INSPECT THE LOGS MANUALLY
          //
          if (totalUnprocessableImgs > 0) {
            const haslogsDir = await createDirectory(logs);

            if (haslogsDir) {
              processImgQueueLogs(unprocessableImgs);
              console.log(chalk.red('📓 OBITUARY:'), `${totalUnprocessableImgs} image records added to '${logFile}'\n`);
            } else {
              console.log('Unable to create the `logsDir` directory');
            }
          }

          console.log(`🔪 Slice 'n' Dice...\n`);

          spinner.start();

          // IF ITS IN THE CONFIG, START IMAGE PROCESSING
          //
          if (totalProcessableImgs > 0) {
            const hasOutputDir = await createDirectory(output);
            const render = () => { spinner.render() };

            if (hasOutputDir) {
              if (totalProcessableImgs > 250) {
                await processImgQueueBatch(processableImgs, render);
              } else {
                await processImgQueue(processableImgs, render);
              }

              spinner.stop();

              console.log(`💀💀💀 ${chalk.strikethrough.red(' IMAGE SLICING DONE ')} 💀💀💀\n`);
            } else {
              console.log(chalk.red("Error: Unable to create the output directory"));
            }
          } else {
            spinner.stop();
            console.log(chalk.red(`No processable images w/ config properties of (${includeRE}) found inside directory at '${input}'...\n`));
            console.log(chalk.yellow("Make sure your 'config' & 'directories' are setup correctly.\n"));
          }
        } catch (err) {
          spinner.stop();
          console.log(chalk.red('An error occurred while processing images'), err, '\n');
        }
      } else {
        console.log(chalk.red("No images found inside directory at:"), `'${input}'\n`);
      }
    } else {
      console.log(chalk.red("Error: Unable to find the input directory.\n"));
    }
  } catch (err) {
    console.log(chalk.red("Error: Make sure your 'config' & 'directories' are setup correctly.\n"));
    console.log(chalk.yellow("*Note: Make sure you also have Imagemagick installed. Try 'brew install imagemagick'.\n"));
    console.log('🚫', 'processAllImgs', chalk.red(err.stderr || err));
  }
};

module.exports = {
  imgToAnimatedGIF,
  imgToGIF,
  imgToPNG,
  imgToJPG,
  imgResize,
  copyImg,
  processImg,
  processAllImgs,
};
