'use strict';

/*
 * EXAMPLE 2
 * Shows how to use Trawler-Internal by passing in configuration directly.
 */

// FIX - Ensure we run the example from inside the examples directory.
// This is not needed in your code.
process.chdir(__dirname);

const packageJSON = require('./package.json');
const log = require('../index').init({
  appName: packageJSON.name,  // Must be provided when passing in config directly (should be the same as package.json).
  mode: 'bunyan',
  logDir: '/logs',
  logFilename: 'ops.log',
  bunyanConfig: {
    level: 'debug',
    src: true,
    streams: [{
      type: 'rotating-file',
      level: 'debug',
      period: '1d',
      count: 30,
    }],
  },
});
const otherModule = require('./otherModule');

// We can log out in our main file.
log.info('First log out...');

// Continue inside another module.
otherModule.someMethod('World');
