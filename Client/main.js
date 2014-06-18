
var angular = require("angular");
var app = require("./app");

require("./controllers/docker_list_ctrl");
require("./controllers/docker_new_ctrl");
require("./directives/docker_list");

require("./services/docker_factory");






window.onload = function () {
  module.exports = angular.bootstrap(document, ['DashApp']);
};