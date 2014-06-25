var app = require("../app");
var _ = require("underscore");
var jQuery = require("jQuery");
var Morris = require('Morris');
require("../services/docker_factory.js");



module.exports = app.controller('DockerListCtrl', ['$rootScope', '$scope','DockerFactory',  function( $rootScope, $scope, DockerFactory){
		$scope.dockers =[];
		$rootScope.isSelectedDocker = null;


		$scope.dockers = DockerFactory.dockers;

		DockerFactory.getDockers().then( function(res){
			DockerFactory.dockers = res.data.rows;
			$scope.dockers = DockerFactory.dockers;
			$scope.getDockersStatus();
			console.log("Total Dockers: ", $scope.dockers.length);

		}.bind(this));
		
		$scope.setSelected = function( id){
			$rootScope.isSelectedDocker = id;
		}


		$scope.drawStats = function(docker){

			jQuery('#morris-image-stat').html("");
			Morris.Donut({
		        element: 'morris-image-stat',
		        data: [{
		            label: "Images",
		            value: typeof docker.Images == 'undefined' ? 0: docker.Images
		        }

		        ],
		        resize: true
		    });				

		
			jQuery('#morris-container-stat').html("");

			Morris.Donut({
		        element: 'morris-container-stat',
		        data: [{
		            label: "Containers",
		            value:  typeof docker.Containers == 'undefined'?0 : docker.Containers
		        }

		        ],
		        resize: true
		    });
		}

		$scope.destroy = function(id){
			if( confirm("Are you sure you want to delete this docker?")){

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

		$scope.getDockersStatus = function(){
			_.each($scope.dockers, function(docker){
					delete( docker.Images );
					delete( docker.Containers);
					delete( docker.MemoryLimit);
					delete( docker.HealthStatus);
					
					DockerFactory
						.info(docker.id)
						.then( 
							function(res){
						 		console.log(res);
								if( res && typeof(res.data.errors) !== 'undefined' ){
									if( res.data.data != null){
								 		docker.Images = res.data.data.Images;			 		
								 		docker.Containers = res.data.data.Containers;
								 		docker.MemoryLimit = res.data.data.MemoryLimit;
								 		docker.HealthStatus = res.data.data.HealthStatus;

								 		docker.loaded = true;
									}					
							 	}else{
							 		docker.Images = -1;
							 		docker.Containers= -1;
							 		docker.MemoryLimit = -1;
							 		docker.HealthStatus = -1;
							 		data.loaded = -1;
							 	}
				 		}, function( res){
					 			console.log("Failed to fetch docker status");
						 		docker.Images = -1;
						 		docker.Containers= -1;
						 		docker.MemoryLimit = -1;
						 		docker.HealthStatus = -1;

						 		docker.loaded = -1;

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
							console.log("Failed to fetch docker info: ", res);
						});
		}


}]);

