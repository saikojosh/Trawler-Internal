'use strict';

/*
 * EXAMPLE 1
 * Shows how to use Trawler-Internal with configuration in your app's package.json file.
 */

// FIX - Ensure we run the example from inside the examples directory.
// This is not needed in your code.
process.chdir(__dirname);

const log = require('../index').init();
const otherModule = require('./otherModule');

// We can log out in our main file.
log.info('First log out...');

// Continue inside another module.
otherModule.someMethod('World');
