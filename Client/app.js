var angular = require('angular');
var uiRouter = require('angular-ui-router');
var angular_animate = require('angular-module-animate');

require('angular-loading-bar');


//var toaster = require("./lib/toaster");

require('angular-router-browserify')(angular);
require("./build/view/templates.js");


var app = angular.module('DashApp', [uiRouter, 'templates-main']);

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
		})

		.state('dockers.list.panel', {
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
					controller: "DockerShowCtrl"
				},
				'containers': {
					templateUrl: 'dockers/containers.tpl.html',
					controller: "DockerShowCtrl"				
				}
			},
			url: '/:id'
			
		});
	
	
	
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