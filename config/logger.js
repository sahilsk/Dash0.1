
var path = require('path'),
    appDir = path.dirname(require.main.filename);

console.log("Application Logging Directory:::::::::::: ",  process.cwd() + "/logs" );

module.exports = require('tracer').dailyfile({root: './logs'});