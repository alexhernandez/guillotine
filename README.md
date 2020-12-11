🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪\
🔪🔪🔪 &nbsp; __ 💀 <span style="color: red">~~GUILLOTINE~~</span> 💀 __ &nbsp;🔪🔪🔪\
🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪

# Guillotine

- 🔍 Hunt Down The Images
- 🔪 Crop/Slice Processable Images
- 📓 Log Unprocessable Images

## Prerequisites 

Install [Image Magick](https://imagemagick.org/index.php):

```bash
brew install imagemagick
```

Install [Node.js](https://nodejs.org):

```bash
brew install node
```

## Getting Started

1. Initialize Project:
```bash
npm install
```

2. Add a `guillotine.config.js` file to your project

3. Lastly, dump all your raw images inside `guillotine/assets/input` or in your designated `inputDir` and run:
```bash
npm run guillotine
```

## Adding A Config File

```javascript
// guillotine.config.js
//
const config = {
  inputDir: 'guillotine/assets/input',
  outputDir: 'guillotine/assets/output',
  logsDir: 'guillotine/logs',
  logFile: 'logs.txt',
  prefix: '',
  suffix: '',
  allow: {},
  ignore: [],
};

module.exports = config;
```