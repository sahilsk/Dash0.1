
var _ = require("underscore");
var app = require("../app");
var $ = require("jQuery");


module.exports  = app.controller('DockerProcessCtrl', 
		['$rootScope', '$scope', '$http', '$stateParams', 'ImageFactory','ContainerFactory',
		 function( $rootScope, $scope, $http, $stateParams, ImageFactory, ContainerFactory ){
		 	$scope.processes = [];
			$scope.opts = ContainerFactory.options;
			$scope.docker  = ContainerFactory.docker;
			console.log( $scope.docker );

			$rootScope.isSelectedContainer = null;

		 	$scope.containerId = $stateParams.cid;
		 	console.log("Container processes to fetch: ", $scope.containerId);

			$scope.getProcesses = function(  containerId ){
				$rootScope.isSelectedContainer = containerId;

				if( !containerId){
					return;
				}
				ContainerFactory.getProcesses( containerId).then( function(res){
					if( res.data.errors){
						console.log('Error fetching processes: ', res.data.errors)
					}else{
						$scope.processes = res.data.data;
				 		console.log("Processes: ", res.data.data);
					}
				}, function(err){
					console.log("Failed to fetch processes: ", err);
				});				
			}

			$scope.getProcesses( $scope.containerId );


}
]);
