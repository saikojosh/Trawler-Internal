# Trawler-Internal
Provides an API for internal logging to the console and to log files on disk. Works beautifully with [Trawler-Std](https://www.npmjs.com/package/trawler-std) (for external application logging, restarting and crash reporting).

## Usage
There are two ways to use Trawler-Internal. You can include the configuration inside the `trawler` property in your `package.json` or you can pass a config object straight to the `.init()` method. Either way you must call the `.init()` method before you require any modules that use the logger.

The only supported `mode` at present is `bunyan`. The returned `log` variable will be an instance of a Bunyan logger which you can use as normal.

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
The other way to initialise Trawler-Internal is to pass in a plain config object:

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
```

## Config Properties
...
