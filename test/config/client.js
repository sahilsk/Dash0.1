exports.client = require('webdriverjs').remote({
    desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled:true,
        databaseEnabled: true,
        webSecurityEnabled: false
    },
    logLevel: 'silent',
    screenshotPath:'/home/sahilsk/Pictures',
    singleton:true
});