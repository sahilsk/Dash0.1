
var _ = require("underscore");
var app = require("../app");


module.exports  = app.controller('DockerContainerCtrl', 
		[ '$scope', '$http', '$stateParams', 'ImageFactory','ContainerFactory', 'currentDocker',
		 function(  $scope, $http, $stateParams, ImageFactory, ContainerFactory, currentDocker){
		 	$scope.containers = [];
		 	$scope.opts = ContainerFactory.options;
			$scope.docker = currentDocker.data.data;
			ImageFactory.docker = $scope.docker;
	 		ContainerFactory.docker = $scope.docker;

			console.log( $scope.docker );

			$scope.getContainers = function(){	
				ContainerFactory.getContainers( $scope.opts ).then( function(res){
					//console.log( res);
					ContainerFactory.containers = res.data.data;
					$scope.containers = ContainerFactory.containers ;
					console.log( "Containers: ",$scope.containers);
				})

			}

			$scope.getContainers();
		
}
]);
