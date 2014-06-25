
var _ = require("underscore");
var app = require("../app");
var $ = require("jQuery");


module.exports  = app.controller('DockerImageCtrl', 
		['$rootScope', '$scope', '$http', '$stateParams', 'ImageFactory','ContainerFactory', 'currentDocker',
		 function( $rootScope, $scope, $http, $stateParams, ImageFactory, ContainerFactory, currentDocker){
			$scope.images = [];
			$scope.docker = null;
			$scope.hasLoaded = 0;

			$scope.objectToInpect = {};

			$scope.opts = ImageFactory.options;


		 	if( typeof currentDocker !== "undefined" && currentDocker.hasOwnProperty("data") && currentDocker.data.data !== null ){
				$scope.docker = currentDocker.data.data;
				ImageFactory.docker = $scope.docker;
		 		ContainerFactory.docker = $scope.docker;
		 	}else{
				console.log( "Docker not found. Invalid Docker");
		 	}


			$scope.getImages = function(){
				$scope.hasLoaded = 0;
				if( !$scope.docker){
					return;
				}

				ImageFactory
					.getImages($scope.opts)
					.then( 
						function(res){
							$scope.images = res.data.data.images;
							$scope.info = res.data.data.info;
							$scope.version = res.data.data.version;
						 	console.log("Images: ", res.data.data);
						 	$scope.hasLoaded = 1;
						//	$('#imageTable').dataTable();

					}, function(err){
							$scope.hasLoaded = -1;
							console.log("Failed to fetch images: ", err);
					});				
			}

			$scope.getImages();

			$scope.inspectImage = function(id){
				ImageFactory.inspectImage( id).then( function(res){
					console.log( res.data);
					$rootScope.modal = { title: "Image: "+id.substring(0, 14), content:  res.data.data };
					$("#launchInspectWindow").modal();
				}, function(err){
					console.log("Failed to inspect image");
				});

			}
}
]);
