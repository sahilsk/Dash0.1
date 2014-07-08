exports.client = require('webdriverjs').remote({
    desiredCapabilities: {
        // You may choose other browsers
        // http://code.google.com/p/selenium/wiki/DesiredCapabilities
        browserName: 'chrome'
    },
    // webdriverjs has a lot of output which is generally useless
    // However, if anything goes wrong, remove this to see more details
    logLevel: 'silent',
    screenshotPath:'/home/sahilsk/Pictures',
    singleton:true
});