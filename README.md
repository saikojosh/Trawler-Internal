# Trawler-Internal
Provides an API for internal logging to the console and to log files to disk. The functionality provided depends on which mode you choose i.e. "trawler" or "bunyan". Works beautifully with [Trawler-Std](https://www.npmjs.com/package/trawler-std) (for external application logging, restarting and crash reporting).

## Usage
There are two ways to use Trawler-Internal. You can include the configuration inside the `trawler` property in your `package.json` which is great if you use Trawler-Std to manage your application. Otherwise you can pass a config object directly to the `.init()` method. Either way you must call the `.init()` method before you require any modules that use the logger.

**The only supported `mode` at present is `bunyan`.** The log variable returned by `.init()` and `.get()` will be an instance of a [Bunyan](https://www.npmjs.com/package/bunyan) logger which you can use as you normally would.

### Package.json
In your `package.json` add the config like this:

```javascript
{
  ...
  "trawler": {
    ...
    "internal": {
      "mode": "bunyan",  // Required.
      "logDir": "/data/logs",
      "logFilename": "ops.log",
      "bunyanConfig": {
        "level": "debug",
        "src": true,
        "streams": [{
          "type": "rotating-file",
          "level": "debug",
          "period": "1d",
          "count": 30
        }],
        ...
      }
    }
  }
}
```

Then initialise Trawler-Internal by providing the path to your `package.json `:

```javascript
const log = require('trawler-internal').init('../');
```

```javascript
// Don't specify anything if package.json is in the same directory!
const log = require('trawler-internal').init();
```

### Config Object
The other way to initialise Trawler-Internal is to pass a plain config object directly to `.init()`:

```javascript
const packageJSON = require('./package.json');
const log = require('trawler-internal').init({
  appName: packageJSON.name,  // Required.
  mode: 'bunyan',  // Required.
  logDir: '/data/logs',  // Required.
  logFilename: 'ops.log',  // Required.
  bunyanConfig: {
    level: 'debug',
    src: true,
    streams: [{
      type: 'rotating-file',
      level: 'debug'
      period: '1d',
      count: 30
    }],
    ...
  },
});
```

### In Other Files
To use the logger in other files and modules simply use the `.get()` method and use as normal:

```javascript
const log = require('trawler-internal').get();

log.info('My log message...');  // Example Bunyan log.
```

## Config Properties
These are the properties you need to configure to use Trawler-Internal:

| Property     | Default | Description |
|--------------|---------|-------------|
| appName      |         | The name of the application Trawler-Internal is being used in. Defaults to the value in `package.json` unless a config object is passed directly to `.init()`, in which case you need to specify it manually. |
| mode         | trawler | The mode to use i.e. "trawler" or "bunyan". |
| logDir       | /logs   | The directory where log files should be stored. This can be a Docker volume. |
| logFilename  | ops.log | The filename for the log files e.g. "ops.log".
| bunyanConfig | {}      | Configuration options to pass to Bunyan, see [Bunyan on npm](https://www.npmjs.com/package/bunyan). Only required if mode is "bunyan". |

## Modes
Trawler-Internal supports a number of different modes depending on how you want to handle app logging.

### Trawler Mode
**Not Currently Implemented** - Specify the mode as "trawler" (or leave blank) to use the default logging system provided by Trawler-Internal.

### Bunyan Mode
Specify the mode as "bunyan" to use [Bunyan](https://www.npmjs.com/package/bunyan) as the logging module. You can specify Bunyan's configuration in the `bunyanConfig` property. By default, `file` and `rotating-file` streams will write log files to the directory given in the `logDir` property and will be named like the `logFilename` property.

The log variable returned by `.init()` and `.get()` will be an instance of a [Bunyan](https://www.npmjs.com/package/bunyan) logger which you can use as you normally would.

## In Detail

### Examples
See the `/examples` directory for two sample scripts that demonstrate how to use Trawler-Internal:

* **example1.js** - Demonstrates specifying the configuration in your app's `package.json` file.
* **example2.js** - Demonstrates passing the configuration object directly to `.init()`.

### Known Issues
* The "trawler" mode is not yet implemented.
* The "bunyan" mode has only been tested with simple Bunyan configurations.
* Currently doesn't support specifying different config for different environments.
