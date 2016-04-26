'use strict';

/*
 * OTHER MODULE
 * We simply required Trawler-Internal again and use the .get() method to grab the instance of the logger. Then we can
 * use it as we normally would. Easy peasy.
 */

const ME = module.exports;
const log = require('../index').get();

/*
 * Does something useful.
 */
ME.someMethod = function (text) {
  log.info(`Hello, ${text}!`);
};
