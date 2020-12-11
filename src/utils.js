// GUILLOTINE - UTILS
//

const chalk = require('chalk');
const path = require('path');
const util = require('util');
const { readdir } = require('fs');
const { exec } = require('child_process');
const execPromise = util.promisify(exec);
const readdirPromise = util.promisify(readdir);
const defaults = require('../defaults.config');

// CUSTOM
const customSpinner = [
  '🔪                  ',
  '  🔪                ',
  '    🔪              ',
  '      🔪            ',
  '        🔪          ',
  '          🔪        ',
  '            🔪      ',
  '              🔪    ',
  '                🔪  ',
  '                  🔪',
];

// REGEX
const spacesRE = /\s/g;
const hypensRE = /-/g;

// METHODS
const noop = () => {};

const getAllFilepaths = async (input) => readdirPromise(input, { withFileTypes: true });

const parsePath = (filepath) => path.parse(filepath); // dir | base | ext | name

const parseImageDimensions = (result) => result.split('x').map(Number);

const parseBufferToString = (result) => result.toString().replace('\n', '').trim();

const escapeFilepathString = (result) => result.replace(spacesRE, '\\ ');

const generateFilename = (filename, suffix, prefix) => {
  const _filename = filename.toLowerCase().replace(spacesRE, '').replace(hypensRE, '_');
  const { name } = parsePath(_filename);
  return `${prefix || ''}${name}${suffix || ''}`;
};

const createDirectory = async (dir) => {
  let result = false;

  try {
    const filepath = path.resolve(__dirname, dir);
    const cmd = `mkdir -p ${filepath}`;

    await execPromise(cmd);

    result = true;
  } catch (err) {
    result = false;
    console.log('🚫', 'createDirectory', `${chalk.red(err.stderr || err)}`);
  }

  return result
};

module.exports = {
  noop,
  customSpinner,
  getAllFilepaths,
  parseImageDimensions,
  parseBufferToString,
  escapeFilepathString,
  generateFilename,
  createDirectory,
};
