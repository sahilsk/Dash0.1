
var _ = require("underscore");
var app = require("../app");
var jQuery = require("jQuery");


module.exports  = app.controller('DockerContainerCtrl', 
		['$rootScope', '$scope', '$http', '$stateParams', 'ImageFactory','ContainerFactory', 'currentDocker',
		 function( $rootScope,  $scope, $http, $stateParams, ImageFactory, ContainerFactory, currentDocker){
		 	$scope.containers = [];
		 	$scope.hasLoaded = 0;
		 	$scope.docker  = null;
			$scope.objectToInpect = {};

		 	$scope.opts = ContainerFactory.options;

		 	if( typeof currentDocker !== "undefined" && currentDocker.hasOwnProperty("data") && currentDocker.data.data !== null ){
				$scope.docker = currentDocker.data.data;
				ImageFactory.docker = $scope.docker;
		 		ContainerFactory.docker = $scope.docker;
				$rootScope.isSelectedDocker = $scope.docker.id;
				console.log( "Selected Docker: " , $scope.docker );

			}else{
				console.log("Docker not found");
			}


			jQuery('#containerDateTimeFilter').datetimepicker();


			$scope.getContainers = function(){
				$scope.hasLoaded = 0;			
				if( !$scope.docker ){
					return ;
				}

				$scope.opts[ $scope.opts.when] = + new Date( $scope.opts[ $scope.opts.when] ) /1000;
				console.log( $scope.opts );

				ContainerFactory
					.getContainers( $scope.opts )
					.then(
						function(res){
							//console.log( res);
						 	$scope.hasLoaded = 1;
							ContainerFactory.containers = res.data.data;
							$scope.containers = ContainerFactory.containers ;
							console.log( "Containers: ",$scope.containers);
					}, function(err){
							$scope.hasLoaded = -1;
							console.log("Failed to fetch containers: ", err);
					});			

			}

			$scope.getContainers();

			$scope.inspectContainer = function(id){
				ContainerFactory.inspectContainer( id).then( function(res){
					console.log( res.data);
					$rootScope.modal = { title: "Container: "+id.substring(0,14), content:  res.data.data };
					$("#launchInspectWindow").modal();

				}, function(err){
					console.log("Failed to inspect container");
				});

			}			
		
}
]);
