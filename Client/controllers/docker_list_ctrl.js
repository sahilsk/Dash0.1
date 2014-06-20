var app = require("../app");
var _ = require("underscore");

require("../services/docker_factory.js");


module.exports = app.controller('DockerListCtrl', ['$rootScope', '$scope','DockerFactory', function( $rootScope, $scope, DockerFactory){
		$scope.dockers =[];
		$scope.dockers = DockerFactory.dockers;

		DockerFactory.getDockers().then( function(res){
			DockerFactory.dockers = res.data.rows;
			$scope.dockers = DockerFactory.dockers;
			$scope.getDockerStatus();
			console.log("Total Dockers: ", $scope.dockers.length);

		}.bind(this));
		
		$scope.destroy = function(id){
			if( confirm("Are you sure?")){

				DockerFactory.delete(id).then( function(data){
					if( !data.errors){
						console.log("Record deleted");
						DockerFactory.dockers = _.reject( DockerFactory.dockers, function(docker){ return docker.id == id; });
						$scope.dockers = DockerFactory.dockers;
						console.log("Total Dockers: ", $scope.dockers.length);
						//toaster.pop('success', 'Docker Deleted ',  'Docker removed successfully');
						
					}
					else{
						console.log("Error deleting docker ", data.errors);
						//toaster.pop( 'alert', "Error deleting docker " , data.errors);					
					}
				});
			}
			
		}

		$scope.getDockerStatus = function(){
			_.each($scope.dockers, function(docker){
					delete( docker.Images );
					delete( docker.Containers);
					delete( docker.MemoryLimit);
					delete( docker.HealthStatus);
					
					DockerFactory
						.info(docker.id)
						.then( function(res){
					 		console.log(res);
							if( res && typeof(res.data.errors) !== 'undefined' ){
								if( res.data.data != null){
							 		docker.Images = res.data.data.Images;			 		
							 		docker.Containers = res.data.data.Containers;
							 		docker.MemoryLimit = res.data.data.MemoryLimit;
							 		docker.HealthStatus = res.data.data.HealthStatus;
								}					
						 	}else{
						 		docker.Images = -1;
						 		docker.Containers= -1;
						 		docker.MemoryLimit = -1;
						 		docker.HealthStatus = -1;
						 	}
				 		}, function( res){
				 			console.log("something went wrong");
					 		docker.Images = -1;
					 		docker.Containers= -1;
					 		docker.MemoryLimit = -1;
					 		docker.HealthStatus = -1;

				 		});

			});


		}

		$scope.getInfo = function( docker){
				DockerFactory
						.info(docker.id)
						.then( function(res){
							if( res.data.data != null){
						 		docker.Images = res.data.data.Images;			 		
						 		docker.Containers = res.data.data.Containers;
						 		docker.MemoryLimit = res.data.data.MemoryLimit;
						 		docker.HealthStatus = res.data.data.HealthStatus;
						 		console.log(res);
						 	}
				 
						}, function(res){
							console.log("something went wrong: ", res);

						});
		}

		$scope.explore = function( docker){


		}


}]);

