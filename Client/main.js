
var angular = require("angular");
var app = require("./app");

require("./controllers/docker_list_ctrl");
require("./controllers/docker_new_ctrl");
require("./controllers/docker_show_ctrl");
require("./controllers/docker_image_ctrl");
require("./controllers/docker_container_ctrl");
require("./controllers/docker_process_ctrl");



require("./directives/docker_list");
require("./directives/datepicker")

require("./services/docker_factory");
require("./services/image_factory");
require("./services/container_factory");






/*
window.onload = function () {
  module.exports = angular.bootstrap(document, ['DashApp']);
};

*/