'use strict';

/*
 * TRAWLER-INTERNAL (class)
 */

const fs = require('fs');
const pathify = require('path').join;
const bunyan = require('bunyan');
const clc = require('cli-color');
const extender = require('object-extender');

module.exports = class TrawlerInternal {

  /*
   * Constructor.
   */
  constructor () {

    // Default config.
    this.config = extender.defaults({
      appName: null,
      mode: 'trawler',
      logDir: '/logs',
      logFilename: 'ops.log',
      bunyanConfig: {},
    });

    // Private variables.
    this.logger = null;

  }

  /*
   * Initialise the module.
   */
  init (input) {

    let packagePath;
    let appPackageJSON;
    let useConfig;

    // Get a useable config variable.
    switch (typeof input) {

      case 'undefined':
      case 'string':
        // If no path if specified assume the packageJSON is in the same directory.
        packagePath = (!input ? pathify(process.cwd(), './package.json') : pathify(input, 'package.json'));

        try {
          appPackageJSON = require(packagePath);
        } catch (err) {
          throw new Error(clc.redBright(`Trawler-Internal can't load the package.json file at "${packagePath}" (${err.code || err.name}).`));
        }

        if (appPackageJSON) {
          useConfig = (appPackageJSON.trawler ? appPackageJSON.trawler.internal : null) || {};
          useConfig.appName = appPackageJSON.name;
        }
        break;

      case 'object':
        useConfig = input;
        break;

      default: throw new Error(clc.redBright('Trawler-Internal received invalid input to .init()'));

    }

    // Extend our config.
    this.config = extender.defaults(this.config, useConfig);

    // Checks.
    if (!this.config.appName) { throw new Error(clc.redBright('You must specify the "appName" config.')); }
    if (!this.config.logDir) { throw new Error(clc.redBright('You must specify the "logDir" config.')); }
    if (!this.config.logFilename) { throw new Error(clc.redBright('You must specify the "logFilename" config.')); }

    // Ensure we build the full log dir path.
    this.config.logDir = pathify(process.cwd(), this.config.logDir, this.config.appName);

    // Create the app log dir syncrhonously so it's ready before any other modules are required.
    try {
      fs.mkdirSync(this.config.logDir);
    } catch (err) {
      // Ignore directory already exists error.
      if (err && err.code !== 'EEXIST') {
        throw new Error(clc.redBright(`Unable to create logs directory "${this.config.logDir}" (${err.code || err.name}).`));
      }
    }

    // Initialise in the specified mode.
    switch (this.config.mode) {
      case 'trawler': throw new Error(clc.redBright('Only the "bunyan" mode is implemented right now.'));
      case 'bunyan': this.initBunyanMode(); break;
      default: throw new Error(clc.redBright(`Unknown mode "${this.config.mode}".`));
    }

    return this.logger;

  }

  /*
   * Initialises the module in Bunyan logging mode.
   */
  initBunyanMode () {

    const bunyanConfig = extender.merge({
      // Overrideable configs.
      serializers: {
        err: bunyan.stdSerializers.err,
      },
    }, this.config.bunyanConfig, {
      // Private configs.
      name: this.config.appName,
    });

    // Add the path for the file streams, if any.
    if (bunyanConfig.streams) {
      for (let i = 0, ilen = bunyanConfig.streams.length; i < ilen; i++) {
        const stream = bunyanConfig.streams[i];

        if (stream.type === 'file' || stream.type === 'rotating-file') {
          stream.path = pathify(this.config.logDir, this.config.logFilename);
        }
      }
    }

    // Create a top level Bunyan logger.
    this.logger = bunyan.createLogger(bunyanConfig);

  }

  /*
   * Returns the instance of the logger.
   */
  get () {
    return this.logger;
  }

};
