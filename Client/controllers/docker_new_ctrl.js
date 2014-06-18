
var _ = require("underscore");
var app = require("../app");



module.exports  = app.controller('DockerNewCtrl', ['$scope', '$http', 'DockerFactory', function($scope, $http, DockerFactory){
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
						$scope.notification = {
							type: 'danger',
							message:' Failed to create docker: '+  res.err
						}
					}else{

						$scope.docker.response = "Docker created successfully.!!!";
						$scope.notification = {
							type: 'success',
							message:' Docker created successfully'
						};
						$scope.docker = {};
					}

			}.bind(this));


		}
}]);
