
var _ = require("underscore");
var app = require("../app");


module.exports  = app.controller('DockerImageCtrl', 
		[ '$scope', '$http', '$stateParams', 'ImageFactory','ContainerFactory', 'currentDocker',
		 function(  $scope, $http, $stateParams, ImageFactory, ContainerFactory, currentDocker){
			$scope.images = [];
			$scope.opts = ContainerFactory.options;
			$scope.docker = currentDocker.data.data;

			ImageFactory.docker = $scope.docker;
	 		ContainerFactory.docker = $scope.docker;

			console.log( $scope.docker );

			$scope.getImages = function(){
				ImageFactory.getImages($scope.opts).then( function(res){
					$scope.images = res.data.data.images;
					$scope.info = res.data.data.info;
					$scope.version = res.data.data.version;
				 	console.log("Images: ", res.data.data);

				});				
			}

			$scope.getImages();
		
}
]);
