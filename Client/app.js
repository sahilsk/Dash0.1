var angular = require('angular');
var uiRouter = require('angular-ui-router');
require('angular-router-browserify')(angular);
require("./build/view/templates.js");

var app = angular.module('DashApp', [uiRouter, 'ngRoute', 'templates-main']);

app.config( ['$stateProvider', '$urlRouterProvider', '$locationProvider', function( $stateProvider, $urlRouterProvider, $locationProvider){

	$locationProvider.html5Mode(true);
	$stateProvider
		.state('dockers', {
			abstract: true,
			url:'/dockers',
			controller: "DockerListCtrl",
			template:"<div ui-view> </div>"

		})		
		.state('dockers.list', {
			url:'/list',
			controller: "DockerListCtrl",
			templateUrl: "dockers/list.tpl.html"
		})
		.state('dockers.new', {
			url:'/new',
			controller: "DockerNewCtrl",
			templateUrl: "dockers/new.tpl.html"
		});
	
	
	
}] );

app.run(['$rootScope', '$location', '$route', function($rootScope, $location, $route) {

	$rootScope.$on('$stateChangeStart', function(){
		console.log("state changing to ", $location.path());
	})

	$rootScope.$on('$stateChangeSuccess', function(){
		console.log('....@', $location.path() );
	})


}])


module.exports = app;