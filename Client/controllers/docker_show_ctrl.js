
var _ = require("underscore");
var app = require("../app");


module.exports  = app.controller('DockerShowCtrl', 
		[ '$scope', '$http', '$stateParams', 'ImageFactory','ContainerFactory', 'currentDocker',
		 function(  $scope, $http, $stateParams, ImageFactory, ContainerFactory, currentDocker){
			$scope.images = [];

			$scope.docker = currentDocker.data.data;
			ImageFactory.docker = $scope.docker;
	 		ContainerFactory.docker = $scope.docker;

			console.log( $scope.docker );

			ImageFactory.getImages().then( function(res){
				$scope.images = res.data.data.images;
				$scope.info = res.data.data.info;
				$scope.version = res.data.data.version;
			 	console.log("Images: ", res.data.data);

			});

			ContainerFactory.getContainers().then( function(res){
				$scope.containers = res.data.data.containers
				console.log( "Containers: ", res.data);

			})

		
}
]);
