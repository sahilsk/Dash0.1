
var _ = require("underscore");
var app = require("../app");


module.exports  = app.controller('DockerNewCtrl', ['$scope', '$http', '$location', 'DockerFactory', function( $scope, $http,$location, DockerFactory){
		$scope.docker = {};

		$scope.submit = function(){
			console.log( $scope.docker );
			$scope.docker  = {
				title: $scope.docker.title || "",
				host: $scope.docker.hostname || "",
				port: parseInt($scope.docker.port)  || 4273,
				healthCheckPath : $scope.docker.healthCheckPath || "/info"
			};

			DockerFactory.save( $scope.docker).then( function(res){
					if(res.err){
						$scope.response = res.err;
						//toaster.pop('danger', ' Failed to create docker ',  res.err);
					}else{
						$scope.docker.response = "Docker created successfully.!!!";
						//toaster.pop('success', ' Success', 'Docker created successfully');
						$scope.docker = {};
						$location.path("/dockers/list");
					}

			}.bind(this));


		}
}]);
