#!/usr/bin/env node
var debug = require('debug')('Server');
var app = require('../Server/app');

app.set('port', 3001);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port, "(TEST)");
});

module.exports = server;

