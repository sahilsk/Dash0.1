var app = require("../app");
var templates = require("../build/view/templates");



module.exports = app.directive('dockerList',  function(){
	return {
		restrict: 'E',
		templateUrl:  "dockers/list.tpl.html"
	} 
	 
});