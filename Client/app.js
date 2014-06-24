var angular = require('angular');
var uiRouter = require('angular-ui-router');
var angular_animate = require('angular-module-animate');
var ngPrettyJson = require("./lib/ng-prettyjson.min");



//var toaster = require("./lib/toaster");

require('angular-router-browserify')(angular);
require("./build/view/templates.js");


var app = angular.module('DashApp', [uiRouter, 'templates-main', 'ngPrettyJson' ]);

app.config( ['$stateProvider', '$urlRouterProvider', '$locationProvider', function( $stateProvider, $urlRouterProvider, $locationProvider){

	$locationProvider.html5Mode(true);
	$stateProvider
		.state('dockers', {
			abstract: true,
			url:'/dockers',
			template:"<div ui-view> </div>"

		})
		.state( 'dockers.list', {
			url: '/list',
			controller: "DockerListCtrl",
			templateUrl: "dockers/list.tpl.html"
		})
		.state('dockers.new', {
			url:'/new',
			controller: "DockerNewCtrl",
			templateUrl: "dockers/new.tpl.html"
		})
		.state('dockers.list.explore', {
			url: '/:id',
			resolve:{
				currentDocker: function($http, $stateParams) {
		      		return $http
						.get('/api/dockers/'+ $stateParams.id )
						.success( function(res){
							console.log( res);
							if( res.errors ){
								return null;
							}
							else{
								return res.data;
							}
						})
						.error( function(err){
						 	console.log("Error :", err);
						});
				},
			},
			views:{
				'images': {
					templateUrl: 'dockers/images.tpl.html',
					controller: "DockerImageCtrl"
				},
				'containers': {
					templateUrl: "dockers/containers.tpl.html",
					controller: "DockerContainerCtrl"		
				}
			}
		})
		.state('dockers.list.explore.top', {
			url: "/containers/:cid/top",
			views: {
				'processes': {
					templateUrl: "dockers/processes.tpl.html",
					controller: "DockerProcessCtrl"
				}
			}
		})		
/*		.state('dockers.images', {
			url: '/:id/images',
			template: "Image list"

		})
		.state('dockers.containers', {
			url: '/:id/containers',
			template: "Image list"

		})	*/	

	
	
	
}] );

app.run(['$rootScope', '$location', function($rootScope, $location) {

	$rootScope.$on('$stateChangeStart', function(){
		console.log("state changing to ", $location.path());
	})

	$rootScope.$on('$stateChangeSuccess', function(){
		console.log('....@', $location.path() );
	})


}])


module.exports = app;