// GUILLOTINE - DEFAULTS
//

const localDir = 'guillotine';
const assetDir = 'assets';
const logsDir = 'logs';

const defaults = {
  inputDir: `${localDir}/${assetDir}/input`,
  outputDir: `${localDir}/${assetDir}/output`,
  logsDir: `${localDir}/${logsDir}`,
  logFile: 'logs.txt',
  prefix: '',
  suffix: '',
  allow: {},
  ignore: [],
};

module.exports = defaults;
