require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"8DlaiP":[function(require,module,exports){
var angular = require('angular');
var uiRouter = require('angular-ui-router');
var angular_animate = require('angular-module-animate');
var ngPrettyJson = require("./lib/ng-prettyjson.min");



//var toaster = require("./lib/toaster");

require('angular-router-browserify')(angular);
require("./build/view/templates.js");


var app = angular.module('DashApp', [uiRouter, 'templates-main', 'ngPrettyJson' ]);

app.config( ['$stateProvider', '$urlRouterProvider', '$locationProvider', function( $stateProvider, $urlRouterProvider, $locationProvider){

	$locationProvider.html5Mode(true);
	$stateProvider
		.state('dockers', {
			//abstract: true,
			url:'/dockers',
			controller: "DockerListCtrl",
			templateUrl: "dockers/list.tpl.html"

		//	template:"<div ui-view> </div>"

		})
		.state('dockers.new', {
			url:'/new',
			controller: "DockerNewCtrl",
			templateUrl: "dockers/new.tpl.html"
		})
		.state('dockers.explore', {
			url: '/:id',
			resolve:{
				currentDocker: function($http, $stateParams) {
		      		return $http
						.get('/api/dockers/'+ $stateParams.id )
						.success( function(res){
							console.log( res);
							if( res.errors ){
								return null;
							}
							else{
								return res.data;
							}
						})
						.error( function(err){
						 	console.log("Error :", err);
						});
				},
			},
			views:{
				'images': {
					templateUrl: 'dockers/images.tpl.html',
					controller: "DockerImageCtrl"
				},
				'containers': {
					templateUrl: "dockers/containers.tpl.html",
					controller: "DockerContainerCtrl"		
				}
			}
		})
		.state('dockers.explore.top', {
			url: "/containers/:cid/top",
			views: {
				'processes': {
					templateUrl: "dockers/processes.tpl.html",
					controller: "DockerProcessCtrl"
				}
			}
		})		
/*		.state('dockers.images', {
			url: '/:id/images',
			template: "Image list"

		})
		.state('dockers.containers', {
			url: '/:id/containers',
			template: "Image list"

		})	*/	

	
	
	
}] );

app.run(['$rootScope', '$location', function($rootScope, $location) {

	$rootScope.$on('$stateChangeStart', function(){
		console.log("state changing to ", $location.path());
	})

	$rootScope.$on('$stateChangeSuccess', function(){
		console.log('....@', $location.path() );
	})


}])


module.exports = app;
},{"./build/view/templates.js":3,"./lib/ng-prettyjson.min":11,"angular":19,"angular-module-animate":16,"angular-router-browserify":17,"angular-ui-router":18}],"app":[function(require,module,exports){
module.exports=require('8DlaiP');
},{}],3:[function(require,module,exports){
angular.module('templates-main', []).run(['$templateCache', function($templateCache) {
  $templateCache.put("dockers/containers.tpl.html",
    "<div class=row><div class=col-lg-12><div class=\"panel panel-default\" id=containerTableWrapper><div class=panel-heading><span class=\"glyphicon glyphicon-list-alt\"></span> &nbsp; Containers List {{docker.id}}<div class=filters style=\"float: right\"><label>Include Size?</label>&nbsp; <input type=checkbox ng-change=getContainers() ng-model=opts.size ng-true-value=1 ng-false-value=0> | &nbsp;<label>Fetch All?</label>&nbsp; <input type=checkbox ng-change=getContainers() ng-model=opts.all ng-true-value=1 ng-false-value=0> | &nbsp;<label>Limit to:</label>&nbsp; <input type=number ng-change=getContainers() ng-model=opts.limit size=3 placeholder=100 style=width:50px> | &nbsp;<label>Search</label><input ng-model=filterContainer></div><div style=\"float:none; clear:both\"></div></div><div class=\"panel-body table-responsive\"><table class=\"table table-striped table-bordered\"><thead><tr><th>#</th><th>ID</th><th>Image</th><th>Command</th><th>Created</th><th>Status</th><th>Ports</th><th>SizeRw</th><th>SizeRootFs</th><th>Names</th></tr></thead><tbody><tr ng-repeat=\"container in containers | filter:filterContainer | orderBy: container.Created\"><td>{{ $index + 1 }}</td><td><a href=# ng-click=inspectContainer(container.Id) container-id=\"{{ container.Id }}\"><span class=\"label label-info\" title=\"{{ container.Id }}\">{{ container.Id.substring(0, 14) }}</span></a></td><td>{{ container.Image }}</td><td>{{ container.Command }}</td><td>{{ container.Created }}</td><td>{{ container.Status }}</td><td>{{ container.Ports }}</td><td>{{ container.SizeRw }}</td><td>{{ container.SizeRootFs }}</td><td>{{ container.Names }}</td><td><a href=# ui-sref=\"dockers.explore.top({id: docker.id , cid:container.Id})\" class=\"label label-warning action-refresh\" container-id=\"{{ container.Id }}\"><span class=\"glyphicon glyphicon-search\" data-toggle=tooltip data-placement=bottom title=Refresh></span></a> &nbsp;</td></tr></tbody></table></div></div></div></div><div class=row><div class=col-lg-12><div ui-view=processes></div></div></div>");
  $templateCache.put("dockers/images.tpl.html",
    "<div class=row><div class=col-lg-12><div class=\"panel panel-default\" id=imageTableWrapper><div class=panel-heading><span class=\"glyphicon glyphicon-list-alt\"></span> &nbsp; Images List : {{docker.id}}<div class=filters style=\"float: right\"><label>Fetch All?</label>&nbsp; <input type=checkbox ng-change=getImages() ng-model=opts.all ng-true-value=1 ng-false-value=0> | &nbsp;<label>Search</label><input ng-model=filterImage></div><div style=\"float:none; clear:both\"></div></div><div class=\"panel-body table-responsive\"><table class=\"table table-striped table-bordered\" id=imageTable><thead><tr><th>#</th><th>ID</th><th>RepoTags</th><th>Created</th><th>Size</th><th>Virtual Size</th></tr></thead><tbody><tr ng-repeat=\"image in images | orderBy: image.Created | filter:filterImage\"><td>{{ $index + 1 }}</td><td><a href=# image-id=\"{{ image.Id }}\" ng-click=inspectImage(image.Id) title=\"{{ image.Id }}\"><span class=\"label label-primary\">{{ image.Id.substring(0, 14) }}</span></a></td><td>{{ image.RepoTags }}</td><td>{{ image.Created }}</td><td>{{ image.Size }}</td><td>{{ image.VirtualSize }}</td></tr></tbody></table></div></div></div></div>");
  $templateCache.put("dockers/list.tpl.html",
    "<div class=row><div class=col-lg-12><div class=\"panel panel-default\"><div class=panel-heading>Docker Host List</div><div class=panel-body><div class=table-responsive><table class=\"table table-striped table-bordered table-hover\" id=dataTables-example><thead><tr><th>#</th><th>name</th><th>host</th><th>port</th><th>Images</th><th>containers</th><th>Memory Limit</th><th>Health Status</th><th><a ui-sref=dockers.new class=\"label label-primary\"><span class=\"glyphicon glyphicon-plus\"></span></a></th></tr></thead><tbody><tr ng-repeat=\"docker in dockers\"><td>{{ $index + 1 }}</td><td>{{ docker.title }}</td><td>{{ docker.host }}</td><td>{{ docker.port }}</td><td><span ng-if=\"docker.Images != -1\">{{docker.Images}}</span> <img src=/images/refreshing_x24.gif alt=loading... ng-show=\"docker.Images==undefined\"> <span class=\"label label-danger glyphicon glyphicon-warning-sign text-center\" ng-show=\"docker.Images==-1\">FAIL</span></td><td><span ng-if=\"docker.Images != -1\">{{docker.Containers}}</span> <img src=/images/refreshing_x24.gif alt=loading... ng-show=\"docker.Containers==undefined\"> <span class=\"label label-danger glyphicon glyphicon-warning-sign text-center\" ng-show=\"docker.Containers==-1\">FAIL</span></td><td><span ng-if=\"docker.Images != -1\">{{docker.MemoryLimit}}</span> <img src=/images/refreshing_x24.gif alt=loading... ng-show=\"docker.MemoryLimit==undefined\"> <span class=\"label label-danger glyphicon glyphicon-warning-sign text-center\" ng-show=\"docker.MemoryLimit==-1\">FAIL</span></td><td><img src=/images/refreshing_x24.gif alt=loading... ng-show=\"{{ docker.HealthStatus }} \"> <span class=\"label label-success glyphicon glyphicon-ok text-center\" ng-show=\"docker.HealthStatus &&  docker.HealthStatus !== -1\">OK</span> <span class=\"label label-danger glyphicon glyphicon-warning-sign text-center\" ng-hide=\"docker.HealthStatus !== -1 && docker.HealthStatus\">FAIL</span></td><td><a href=# class=\"label label-primary action-refresh\" ng-click=getInfo(docker)><span class=\"glyphicon glyphicon-refresh\" data-toggle=tooltip data-placement=bottom title=Refresh></span></a> &nbsp; <a ui-sref=\"dockers.explore({id: docker.id })\" class=\"label label-success action-explore\" docker-id=\"{{ docker.id }}\"><span class=\"glyphicon glyphicon-eye-open\"></span></a> &nbsp; <a href=# class=\"label label-danger action-delete\" docker-id=\"{{ docker.id }}\" ng-click=destroy(docker.id)><span class=\"glyphicon glyphicon-remove\"></span></a></td></tr></tbody></table></div></div></div></div></div><div ui-view=containers></div><div ui-view=images></div><div class=\"modal fade\" id=launchInspectWindow><div class=modal-dialog><div class=modal-content><div class=modal-header><button type=button class=close data-dismiss=modal aria-hidden=true>&times;</button><h4 class=modal-title><span class=\"label label-danger ng-binding\">{{ $root.modal.title }}</span></h4></div><div class=modal-body><pretty-json json=$root.modal.content></pretty-json></div><div class=modal-footer><button type=button class=\"btn btn-default\" data-dismiss=modal>Close</button></div></div></div></div>");
  $templateCache.put("dockers/new.tpl.html",
    "<h1>New Docker</h1><div ng-controller=DockerNewCtrl><div class=\"alert alert-dismissable alert-{{$root.notification.type}}\" ng-hide=\"$root.notification === 'undefined' || $root.notification.type === null\"><button type=button class=close data-dismiss=alert aria-hidden=true>×</button> {{ $root.notification.message }}</div><form name=newDockerForm class=cssForm role=form ng-submit=\"newDockerForm.$valid &&  submit()\" novalidate><div class=form-group><label class=control-label for=hostname>Nick</label><input name=title class=form-control ng-model=docker.title placeholder=\"eg. Mickie\" required></div><div class=form-group><label class=control-label for=hostname>Hostname</label><input name=hostname class=form-control ng-model=docker.hostname placeholder=\"eg. 10.2.1.1\" required></div><div class=form-group><label class=control-label for=port>Port</label><input name=port type=number class=form-control ng-model=docker.port placeholder=\"eg. 4273\" pattern=[0-9]*[0-9]+></div><div class=form-group><label class=control-label for=healthCheckPath>Health check path</label><input name=healthCheckPath class=form-control ng-model=docker.healthCheckPath placeholder=\"eg. /ping\"></div><button type=button class=\"btn btn-outline btn-primary\" ng-click=\"newDockerForm.$valid &&  submit()\">Submit</button></form></div>");
  $templateCache.put("dockers/processes.tpl.html",
    "<div class=\"panel panel-default\" id=processesTableWrapper><div class=panel-heading><span class=\"glyphicon glyphicon-list-alt\"></span> &nbsp; Process List : {{ containerId}}</div><div class=\"panel-body table-responsive\"><div ng-if=!processes.length class=info><div class=\"text-center text-info\">No process running</div></div><table class=\"table table-striped table-borderedf imageTable\" ng-if=\"processes.length > 1\"><thead><tr><th ng-repeat=\"title in processes.Titles\">{{ title}}</th></tr></thead><tbody><tr ng-repeat=\"process in processes.Processes\"><td ng-repeat=\"field in process\">{{ field }}</td></tr></tbody></table></div></div>");
}]);

},{}],4:[function(require,module,exports){

var _ = require("underscore");
var app = require("../app");


module.exports  = app.controller('DockerContainerCtrl', 
		['$rootScope', '$scope', '$http', '$stateParams', 'ImageFactory','ContainerFactory', 'currentDocker',
		 function( $rootScope,  $scope, $http, $stateParams, ImageFactory, ContainerFactory, currentDocker){
		 	$scope.containers = [];
			$scope.objectToInpect = {};

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

},{"../app":"8DlaiP","underscore":21}],5:[function(require,module,exports){
(function (global){

var _ = require("underscore");
var app = require("../app");
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);


module.exports  = app.controller('DockerImageCtrl', 
		['$rootScope', '$scope', '$http', '$stateParams', 'ImageFactory','ContainerFactory', 'currentDocker',
		 function( $rootScope, $scope, $http, $stateParams, ImageFactory, ContainerFactory, currentDocker){
			$scope.images = [];
			$scope.objectToInpect = {};

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

				//	$('#imageTable').dataTable();

				}, function(err){
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

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../app":"8DlaiP","underscore":21}],6:[function(require,module,exports){
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
							console.log("something went wrong: ", res);

						});
		}

		$scope.explore = function( docker){


		}


}]);


},{"../app":"8DlaiP","../services/docker_factory.js":14,"underscore":21}],7:[function(require,module,exports){

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

},{"../app":"8DlaiP","underscore":21}],8:[function(require,module,exports){
(function (global){

var _ = require("underscore");
var app = require("../app");
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);


module.exports  = app.controller('DockerProcessCtrl', 
		['$rootScope', '$scope', '$http', '$stateParams', 'ImageFactory','ContainerFactory',
		 function( $rootScope, $scope, $http, $stateParams, ImageFactory, ContainerFactory ){
		 	$scope.processes = [];
			$scope.opts = ContainerFactory.options;
			$scope.docker  = ContainerFactory.docker;
			console.log( $scope.docker );

		 	$scope.containerId = $stateParams.cid;
		 	console.log("Container processes to fetch: ", $scope.containerId);

			$scope.getProcesses = function(  containerId ){
				if( !containerId){
					return;
				}
				ContainerFactory.getProcesses( containerId).then( function(res){
					if( res.data.error){
						console.log('Error fetching processes: ', res.data.error)
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

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../app":"8DlaiP","underscore":21}],9:[function(require,module,exports){

var _ = require("underscore");
var app = require("../app");


module.exports  = app.controller('DockerShowCtrl', 
		[ '$scope', '$http', '$stateParams', 'ImageFactory','ContainerFactory', 'currentDocker',
		 function(  $scope, $http, $stateParams, ImageFactory, ContainerFactory, currentDocker){

			$scope.docker = currentDocker.data.data;
			ImageFactory.docker = $scope.docker;
	 		ContainerFactory.docker = $scope.docker;

			console.log( $scope.docker );
		
}
]);

},{"../app":"8DlaiP","underscore":21}],10:[function(require,module,exports){
var app = require("../app");
var templates = require("../build/view/templates");



module.exports = app.directive('dockerList',  function(){
	return {
		restrict: 'E',
		templateUrl:  "dockers/list.tpl.html"
	} 
	 
});
},{"../app":"8DlaiP","../build/view/templates":3}],11:[function(require,module,exports){
/** 
* @license ng-prettyjson - v0.1.0
* (c) 2013 Julien VALERY https://github.com/darul75/ng-prettyjson
* License: MIT 
**/
var angular = require("angular");
module.exports = angular.module("ngPrettyJson",[]).directive("prettyJson",["ngPrettyJsonFunctions",function(a){"use strict";var b=angular.isDefined;return{restrict:"AE",scope:{json:"=",prettyJson:"="},replace:!0,template:"<pre></pre>",link:function(c,d,e){var f,g=b(e.json)?"json":"prettyJson",h=function(c){return b(c)?d.html(a.syntaxHighlight(c)):d.empty()};f=c.$watch(g,function(a){angular.isObject(a)&&b(a.json)?(f(),c.$watch(g+".json",function(a){h(a)},!0)):h(a)},!0)}}}]).factory("ngPrettyJsonFunctions",function(){var a={entities:/((&)|(<)|(>))/g,json:/"(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|(null))\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g},b=["&amp;","&lt;","&gt;"],c=["number","string","key","boolean","null"],d=function(){var a=arguments.length-2;do a--;while(!arguments[a]);return a},e=function(a){var b;if(arguments.length<7)throw new Error("markup() must be called from String.prototype.replace()");return b=d.apply(null,arguments),'<span class="'+c[b]+'">'+a+"</span>"},f=function(){var a;if(arguments.length<5)throw new Error("makeEntities() must be called from String.prototype.replace()");return a=d.apply(null,arguments),b[a-2]},g=function(b){return angular.isString(b)||(b=JSON.stringify(b,null,2)),angular.isDefined(b)?b.replace(a.entities,f).replace(a.json,e):void 0};return{syntaxHighlight:g,makeEntities:f,markup:e,rx:a}});
},{"angular":19}],12:[function(require,module,exports){

var angular = require("angular");
var app = require("./app");

require("./controllers/docker_list_ctrl");
require("./controllers/docker_new_ctrl");
require("./controllers/docker_show_ctrl");
require("./controllers/docker_image_ctrl");
require("./controllers/docker_container_ctrl");
require("./controllers/docker_process_ctrl");



require("./directives/docker_list");

require("./services/docker_factory");
require("./services/image_factory");
require("./services/container_factory");





/*
window.onload = function () {
  module.exports = angular.bootstrap(document, ['DashApp']);
};

*/
},{"./app":"8DlaiP","./controllers/docker_container_ctrl":4,"./controllers/docker_image_ctrl":5,"./controllers/docker_list_ctrl":6,"./controllers/docker_new_ctrl":7,"./controllers/docker_process_ctrl":8,"./controllers/docker_show_ctrl":9,"./directives/docker_list":10,"./services/container_factory":13,"./services/docker_factory":14,"./services/image_factory":15,"angular":19}],13:[function(require,module,exports){
var app = require("../app");
var _ = require("underscore");


module.exports = app.factory("ContainerFactory", ['$http', function($http){
	var ContainerFactory = {};
	ContainerFactory.containers = [];

	ContainerFactory.options = {
		all: 0,
		size:0,
		limit: 100
	}

	ContainerFactory.docker = null;
	console.log()

	ContainerFactory.info = function(id){
	}

	ContainerFactory.getContainers = function(opts){
		if( !ContainerFactory.docker){
			return [];
		}
		opts = _.defaults(opts, ContainerFactory.options);
		return $http({	
				method:"GET", url: "/api/dockers/"+ ContainerFactory.docker.id + "/containers" , params: opts}
				)
				.success( function(res){
					if( res.errors ){
						console.log( "Error:" , res.errors);
						return res;
					}else{
						//console.log("Containers: ", res.data);
						return res.data;
					}
				});
	}

	ContainerFactory.inspectContainer = function( containerId){
		if( !containerId){
			return {};
		}
		return $http({	
				method:"GET", url: "/api/dockers/"+ ContainerFactory.docker.id + "/containers/" + containerId }
				)
				.success( function(res){
					if( res.errors ){
						console.log( "Error:" , res.errors);
						return res;
					}else{
						console.log("Images: ", res.data);
						return res.data;
					}
				});
	}

	ContainerFactory.getProcesses = function( containerId ){
		if( !containerId){
			return {};
		}
		return $http({	
				method:"GET", url: "/api/dockers/"+ ContainerFactory.docker.id + "/containers/" + containerId  +"/top"}
				)
				.success( function(res){
					if( res.errors ){
						console.log( "Error:" , res.errors);
						return res;
					}else{
						console.log("Images: ", res.data);
						return res.data;
					}
				});

	}

	
	return ContainerFactory;

}] );
},{"../app":"8DlaiP","underscore":21}],14:[function(require,module,exports){
var app = require("../app");


module.exports = app.factory("DockerFactory", ['$http', function($http){
	var DockerFactory = {};
	DockerFactory.dockers = [];

	DockerFactory.getDockers = function(){
		return $http({
				method:'GET',
				url: "/api/dockers/list",
				timeout: 5000
			})
			.success( function(data){
					if(data.status != 200 ){
						console.log( data.errors);
					}else{
						//console.log( data);
						return data;
					}	
			})
			.error( function(){
				alert("something goes wrong while retreiving docker list");
			});

	}

	DockerFactory.find = function(id){
		return $http
				.get('/api/dockers/'+id)
				.success( function(res){
					if( res.errors )
						return null;
					else
						return res.data
				})
				.error( function(err){
				 	console.log("Error :", err);
				})

	}


	DockerFactory.save = function( docker){
		return $http
			.post("/api/dockers", docker )
			.success( function(res){
					return res;					
				}
			)	;
	}

	DockerFactory.delete = function( id){
		console.log("sendind delete request");
		return $http
			.delete("/api/dockers/"+id)
			.success( function( res){
				console.log("Deleted: ", res);
				return res;
			})
			.error( function(err){
				console.log("Error deleting docker: ", err);
			});

	}

	DockerFactory.info = function( id){
		return $http({
				method:'GET',
				url: '/api/dockers/'+id+'/info',
				timeout: 3000
				})
				.success( function(res){
					console.log(res);
					return res;
				})
				.error( function(err){
				 	console.log("Error :", err);
				 	return {};
				})
	}

	DockerFactory.getImages = function( id){
			return $http
					.get('/api/dockers/' + id + '/images')

	}


	
	return DockerFactory;

}] );
},{"../app":"8DlaiP"}],15:[function(require,module,exports){
var app = require("../app");
var _ = require("underscore");

module.exports = app.factory("ImageFactory", ['$http', function($http){
	var ImageFactory = {};

	ImageFactory.docker = null;
	console.log()

	ImageFactory.options = {
		all: 0
	}

	ImageFactory.getImages = function(opts){
		if( !ImageFactory.docker){
			return [];
		}

		opts = _.defaults(opts, ImageFactory.options);
		return $http({	
				method:"GET", url: "/api/dockers/"+ ImageFactory.docker.id + "/images", params: opts }
				)
				.success( function(res){
					if( res.errors ){
						console.log( "Error:" , res.errors);
						return res;
					}else{
						console.log("Images: ", res.data);
						return res.data;
					}
				});
	}

	ImageFactory.inspectImage = function( id){
		if( !id){
			return {};
		}
		return $http({	
				method:"GET", url: "/api/dockers/"+ ImageFactory.docker.id + "/images/" + id }
				)
				.success( function(res){
					if( res.errors ){
						console.log( "Error:" , res.errors);
						return res;
					}else{
						console.log("Images: ", res.data);
						return res.data;
					}
				});

	}
	
	return ImageFactory;

}] );
},{"../app":"8DlaiP","underscore":21}],16:[function(require,module,exports){
/*
 AngularJS v1.2.17
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(u,f,P){'use strict';f.module("ngAnimate",["ng"]).factory("$$animateReflow",["$$rAF","$document",function(f,u){return function(e){return f(function(){e()})}}]).config(["$provide","$animateProvider",function(W,H){function e(f){for(var e=0;e<f.length;e++){var h=f[e];if(h.nodeType==aa)return h}}function C(h){return f.element(e(h))}var n=f.noop,h=f.forEach,Q=H.$$selectors,aa=1,k="$$ngAnimateState",K="ng-animate",g={running:!0};W.decorator("$animate",["$delegate","$injector","$sniffer","$rootElement",
"$$asyncCallback","$rootScope","$document",function(y,u,$,L,F,I,P){function R(a){if(a){var b=[],c={};a=a.substr(1).split(".");($.transitions||$.animations)&&b.push(u.get(Q[""]));for(var d=0;d<a.length;d++){var f=a[d],e=Q[f];e&&!c[f]&&(b.push(u.get(e)),c[f]=!0)}return b}}function M(a,b,c){function d(a,b){var c=a[b],d=a["before"+b.charAt(0).toUpperCase()+b.substr(1)];if(c||d)return"leave"==b&&(d=c,c=null),t.push({event:b,fn:c}),l.push({event:b,fn:d}),!0}function e(b,d,f){var q=[];h(b,function(a){a.fn&&
q.push(a)});var m=0;h(q,function(b,e){var h=function(){a:{if(d){(d[e]||n)();if(++m<q.length)break a;d=null}f()}};switch(b.event){case "setClass":d.push(b.fn(a,p,A,h));break;case "addClass":d.push(b.fn(a,p||c,h));break;case "removeClass":d.push(b.fn(a,A||c,h));break;default:d.push(b.fn(a,h))}});d&&0===d.length&&f()}var w=a[0];if(w){var k="setClass"==b,g=k||"addClass"==b||"removeClass"==b,p,A;f.isArray(c)&&(p=c[0],A=c[1],c=p+" "+A);var B=a.attr("class")+" "+c;if(T(B)){var r=n,v=[],l=[],x=n,m=[],t=[],
B=(" "+B).replace(/\s+/g,".");h(R(B),function(a){!d(a,b)&&k&&(d(a,"addClass"),d(a,"removeClass"))});return{node:w,event:b,className:c,isClassBased:g,isSetClassOperation:k,before:function(a){r=a;e(l,v,function(){r=n;a()})},after:function(a){x=a;e(t,m,function(){x=n;a()})},cancel:function(){v&&(h(v,function(a){(a||n)(!0)}),r(!0));m&&(h(m,function(a){(a||n)(!0)}),x(!0))}}}}}function z(a,b,c,d,e,w,g){function n(d){var e="$animate:"+d;x&&(x[e]&&0<x[e].length)&&F(function(){c.triggerHandler(e,{event:a,
className:b})})}function p(){n("before")}function A(){n("after")}function B(){n("close");g&&F(function(){g()})}function r(){r.hasBeenRun||(r.hasBeenRun=!0,w())}function v(){if(!v.hasBeenRun){v.hasBeenRun=!0;var d=c.data(k);d&&(l&&l.isClassBased?D(c,b):(F(function(){var d=c.data(k)||{};z==d.index&&D(c,b,a)}),c.data(k,d)));B()}}var l=M(c,a,b);if(l){b=l.className;var x=f.element._data(l.node),x=x&&x.events;d||(d=e?e.parent():c.parent());var m=c.data(k)||{};e=m.active||{};var t=m.totalActive||0,u=m.last;
if(l.isClassBased&&(m.disabled||u&&!u.isClassBased)||N(c,d))r(),p(),A(),v();else{d=!1;if(0<t){m=[];if(l.isClassBased)"setClass"==u.event?(m.push(u),D(c,b)):e[b]&&(y=e[b],y.event==a?d=!0:(m.push(y),D(c,b)));else if("leave"==a&&e["ng-leave"])d=!0;else{for(var y in e)m.push(e[y]),D(c,y);e={};t=0}0<m.length&&h(m,function(a){a.cancel()})}!l.isClassBased||(l.isSetClassOperation||d)||(d="addClass"==a==c.hasClass(b));if(d)r(),p(),A(),B();else{if("leave"==a)c.one("$destroy",function(a){a=f.element(this);var b=
a.data(k);b&&(b=b.active["ng-leave"])&&(b.cancel(),D(a,"ng-leave"))});c.addClass(K);var z=O++;t++;e[b]=l;c.data(k,{last:l,active:e,index:z,totalActive:t});p();l.before(function(d){var e=c.data(k);d=d||!e||!e.active[b]||l.isClassBased&&e.active[b].event!=a;r();!0===d?v():(A(),l.after(v))})}}}else r(),p(),A(),v()}function U(a){if(a=e(a))a=f.isFunction(a.getElementsByClassName)?a.getElementsByClassName(K):a.querySelectorAll("."+K),h(a,function(a){a=f.element(a);(a=a.data(k))&&a.active&&h(a.active,function(a){a.cancel()})})}
function D(a,b){if(e(a)==e(L))g.disabled||(g.running=!1,g.structural=!1);else if(b){var c=a.data(k)||{},d=!0===b;!d&&(c.active&&c.active[b])&&(c.totalActive--,delete c.active[b]);if(d||!c.totalActive)a.removeClass(K),a.removeData(k)}}function N(a,b){if(g.disabled)return!0;if(e(a)==e(L))return g.disabled||g.running;do{if(0===b.length)break;var c=e(b)==e(L),d=c?g:b.data(k),d=d&&(!!d.disabled||d.running||0<d.totalActive);if(c||d)return d;if(c)break}while(b=b.parent());return!0}var O=0;L.data(k,g);I.$$postDigest(function(){I.$$postDigest(function(){g.running=
!1})});var V=H.classNameFilter(),T=V?function(a){return V.test(a)}:function(){return!0};return{enter:function(a,b,c,d){a=f.element(a);b=b&&f.element(b);c=c&&f.element(c);this.enabled(!1,a);y.enter(a,b,c);I.$$postDigest(function(){a=C(a);z("enter","ng-enter",a,b,c,n,d)})},leave:function(a,b){a=f.element(a);U(a);this.enabled(!1,a);I.$$postDigest(function(){z("leave","ng-leave",C(a),null,null,function(){y.leave(a)},b)})},move:function(a,b,c,d){a=f.element(a);b=b&&f.element(b);c=c&&f.element(c);U(a);
this.enabled(!1,a);y.move(a,b,c);I.$$postDigest(function(){a=C(a);z("move","ng-move",a,b,c,n,d)})},addClass:function(a,b,c){a=f.element(a);a=C(a);z("addClass",b,a,null,null,function(){y.addClass(a,b)},c)},removeClass:function(a,b,c){a=f.element(a);a=C(a);z("removeClass",b,a,null,null,function(){y.removeClass(a,b)},c)},setClass:function(a,b,c,d){a=f.element(a);a=C(a);z("setClass",[b,c],a,null,null,function(){y.setClass(a,b,c)},d)},enabled:function(a,b){switch(arguments.length){case 2:if(a)D(b);else{var c=
b.data(k)||{};c.disabled=!0;b.data(k,c)}break;case 1:g.disabled=!a;break;default:a=!g.disabled}return!!a}}}]);H.register("",["$window","$sniffer","$timeout","$$animateReflow",function(k,g,C,L){function F(a,E){S&&S();X.push(E);S=L(function(){h(X,function(a){a()});X=[];S=null;q={}})}function I(a,E){var b=e(a);a=f.element(b);Y.push(a);b=Date.now()+E;b<=ea||(C.cancel(da),ea=b,da=C(function(){K(Y);Y=[]},E,!1))}function K(a){h(a,function(a){(a=a.data(m))&&(a.closeAnimationFn||n)()})}function R(a,E){var b=
E?q[E]:null;if(!b){var c=0,d=0,e=0,f=0,m,Z,s,g;h(a,function(a){if(a.nodeType==aa){a=k.getComputedStyle(a)||{};s=a[J+B];c=Math.max(M(s),c);g=a[J+r];m=a[J+v];d=Math.max(M(m),d);Z=a[p+v];f=Math.max(M(Z),f);var b=M(a[p+B]);0<b&&(b*=parseInt(a[p+l],10)||1);e=Math.max(b,e)}});b={total:0,transitionPropertyStyle:g,transitionDurationStyle:s,transitionDelayStyle:m,transitionDelay:d,transitionDuration:c,animationDelayStyle:Z,animationDelay:f,animationDuration:e};E&&(q[E]=b)}return b}function M(a){var b=0;a=
f.isString(a)?a.split(/\s*,\s*/):[];h(a,function(a){b=Math.max(parseFloat(a)||0,b)});return b}function z(a){var b=a.parent(),c=b.data(x);c||(b.data(x,++ca),c=ca);return c+"-"+e(a).getAttribute("class")}function U(a,b,c,d){var f=z(b),h=f+" "+c,k=q[h]?++q[h].total:0,g={};if(0<k){var l=c+"-stagger",g=f+" "+l;(f=!q[g])&&b.addClass(l);g=R(b,g);f&&b.removeClass(l)}d=d||function(a){return a()};b.addClass(c);var l=b.data(m)||{},s=d(function(){return R(b,h)});d=s.transitionDuration;f=s.animationDuration;if(0===
d&&0===f)return b.removeClass(c),!1;b.data(m,{running:l.running||0,itemIndex:k,stagger:g,timings:s,closeAnimationFn:n});a=0<l.running||"setClass"==a;0<d&&D(b,c,a);0<f&&(0<g.animationDelay&&0===g.animationDuration)&&(e(b).style[p]="none 0s");return!0}function D(a,b,c){"ng-enter"!=b&&("ng-move"!=b&&"ng-leave"!=b)&&c?a.addClass(t):e(a).style[J+r]="none"}function N(a,b){var c=J+r,d=e(a);d.style[c]&&0<d.style[c].length&&(d.style[c]="");a.removeClass(t)}function O(a){var b=p;a=e(a);a.style[b]&&0<a.style[b].length&&
(a.style[b]="")}function V(a,b,c,f){function g(a){b.off(z,l);b.removeClass(p);d(b,c);a=e(b);for(var fa in t)a.style.removeProperty(t[fa])}function l(a){a.stopPropagation();var b=a.originalEvent||a;a=b.$manualTimeStamp||b.timeStamp||Date.now();b=parseFloat(b.elapsedTime.toFixed(Q));Math.max(a-y,0)>=x&&b>=u&&f()}var k=e(b);a=b.data(m);if(-1!=k.getAttribute("class").indexOf(c)&&a){var p="";h(c.split(" "),function(a,b){p+=(0<b?" ":"")+a+"-active"});var n=a.stagger,s=a.timings,r=a.itemIndex,u=Math.max(s.transitionDuration,
s.animationDuration),v=Math.max(s.transitionDelay,s.animationDelay),x=v*ba,y=Date.now(),z=A+" "+H,q="",t=[];if(0<s.transitionDuration){var B=s.transitionPropertyStyle;-1==B.indexOf("all")&&(q+=w+"transition-property: "+B+";",q+=w+"transition-duration: "+s.transitionDurationStyle+";",t.push(w+"transition-property"),t.push(w+"transition-duration"))}0<r&&(0<n.transitionDelay&&0===n.transitionDuration&&(q+=w+"transition-delay: "+T(s.transitionDelayStyle,n.transitionDelay,r)+"; ",t.push(w+"transition-delay")),
0<n.animationDelay&&0===n.animationDuration&&(q+=w+"animation-delay: "+T(s.animationDelayStyle,n.animationDelay,r)+"; ",t.push(w+"animation-delay")));0<t.length&&(s=k.getAttribute("style")||"",k.setAttribute("style",s+"; "+q));b.on(z,l);b.addClass(p);a.closeAnimationFn=function(){g();f()};k=(r*(Math.max(n.animationDelay,n.transitionDelay)||0)+(v+u)*W)*ba;a.running++;I(b,k);return g}f()}function T(a,b,c){var d="";h(a.split(","),function(a,e){d+=(0<e?",":"")+(c*b+parseInt(a,10))+"s"});return d}function a(a,
b,c,e){if(U(a,b,c,e))return function(a){a&&d(b,c)}}function b(a,b,c,e){if(b.data(m))return V(a,b,c,e);d(b,c);e()}function c(c,d,e,f){var g=a(c,d,e);if(g){var h=g;F(d,function(){N(d,e);O(d);h=b(c,d,e,f)});return function(a){(h||n)(a)}}f()}function d(a,b){a.removeClass(b);var c=a.data(m);c&&(c.running&&c.running--,c.running&&0!==c.running||a.removeData(m))}function G(a,b){var c="";a=f.isArray(a)?a:a.split(/\s+/);h(a,function(a,d){a&&0<a.length&&(c+=(0<d?" ":"")+a+b)});return c}var w="",J,H,p,A;u.ontransitionend===
P&&u.onwebkittransitionend!==P?(w="-webkit-",J="WebkitTransition",H="webkitTransitionEnd transitionend"):(J="transition",H="transitionend");u.onanimationend===P&&u.onwebkitanimationend!==P?(w="-webkit-",p="WebkitAnimation",A="webkitAnimationEnd animationend"):(p="animation",A="animationend");var B="Duration",r="Property",v="Delay",l="IterationCount",x="$$ngAnimateKey",m="$$ngAnimateCSS3Data",t="ng-animate-block-transitions",Q=3,W=1.5,ba=1E3,q={},ca=0,X=[],S,da=null,ea=0,Y=[];return{enter:function(a,
b){return c("enter",a,"ng-enter",b)},leave:function(a,b){return c("leave",a,"ng-leave",b)},move:function(a,b){return c("move",a,"ng-move",b)},beforeSetClass:function(b,c,d,e){var f=G(d,"-remove")+" "+G(c,"-add"),g=a("setClass",b,f,function(a){var e=b.attr("class");b.removeClass(d);b.addClass(c);a=a();b.attr("class",e);return a});if(g)return F(b,function(){N(b,f);O(b);e()}),g;e()},beforeAddClass:function(b,c,d){var e=a("addClass",b,G(c,"-add"),function(a){b.addClass(c);a=a();b.removeClass(c);return a});
if(e)return F(b,function(){N(b,c);O(b);d()}),e;d()},setClass:function(a,c,d,e){d=G(d,"-remove");c=G(c,"-add");return b("setClass",a,d+" "+c,e)},addClass:function(a,c,d){return b("addClass",a,G(c,"-add"),d)},beforeRemoveClass:function(b,c,d){var e=a("removeClass",b,G(c,"-remove"),function(a){var d=b.attr("class");b.removeClass(c);a=a();b.attr("class",d);return a});if(e)return F(b,function(){N(b,c);O(b);d()}),e;d()},removeClass:function(a,c,d){return b("removeClass",a,G(c,"-remove"),d)}}}])}])})(window,
window.angular);
//# sourceMappingURL=angular-animate.min.js.map

},{}],17:[function(require,module,exports){
/**
* @license AngularJS v1.2.15
* (c) 2010-2014 Google, Inc. http://angularjs.org
* License: MIT
*/
module.exports = function(angular, undefined) {
  /**
  * @ngdoc module
  * @name ngRoute
  * @description
  *
  * # ngRoute
  *
  * The `ngRoute` module provides routing and deeplinking services and directives for angular apps.
  *
  * ## Example
  * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
  *
  *
  * <div doc-module-components="ngRoute"></div>
  */
  /* global -ngRouteModule */
  var ngRouteModule = angular.module('ngRoute', ['ng']).
                         provider('$route', $RouteProvider);

  /**
  * @ngdoc provider
  * @name $routeProvider
  * @function
  *
  * @description
  *
  * Used for configuring routes.
  *
  * ## Example
  * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
  *
  * ## Dependencies
  * Requires the {@link ngRoute `ngRoute`} module to be installed.
  */
  function $RouteProvider(){
   function inherit(parent, extra) {
     return angular.extend(new (angular.extend(function() {}, {prototype:parent}))(), extra);
   }

   var routes = {};

   /**
    * @ngdoc method
    * @name $routeProvider#when
    *
    * @param {string} path Route path (matched against `$location.path`). If `$location.path`
    *    contains redundant trailing slash or is missing one, the route will still match and the
    *    `$location.path` will be updated to add or drop the trailing slash to exactly match the
    *    route definition.
    *
    *    * `path` can contain named groups starting with a colon: e.g. `:name`. All characters up
    *        to the next slash are matched and stored in `$routeParams` under the given `name`
    *        when the route matches.
    *    * `path` can contain named groups starting with a colon and ending with a star:
    *        e.g.`:name*`. All characters are eagerly stored in `$routeParams` under the given `name`
    *        when the route matches.
    *    * `path` can contain optional named groups with a question mark: e.g.`:name?`.
    *
    *    For example, routes like `/color/:color/largecode/:largecode*\/edit` will match
    *    `/color/brown/largecode/code/with/slashes/edit` and extract:
    *
    *    * `color: brown`
    *    * `largecode: code/with/slashes`.
    *
    *
    * @param {Object} route Mapping information to be assigned to `$route.current` on route
    *    match.
    *
    *    Object properties:
    *
    *    - `controller` â€“ `{(string|function()=}` â€“ Controller fn that should be associated with
    *      newly created scope or the name of a {@link angular.Module#controller registered
    *      controller} if passed as a string.
    *    - `controllerAs` â€“ `{string=}` â€“ A controller alias name. If present the controller will be
    *      published to scope under the `controllerAs` name.
    *    - `template` â€“ `{string=|function()=}` â€“ html template as a string or a function that
    *      returns an html template as a string which should be used by {@link
    *      ngRoute.directive:ngView ngView} or {@link ng.directive:ngInclude ngInclude} directives.
    *      This property takes precedence over `templateUrl`.
    *
    *      If `template` is a function, it will be called with the following parameters:
    *
    *      - `{Array.<Object>}` - route parameters extracted from the current
    *        `$location.path()` by applying the current route
    *
    *    - `templateUrl` â€“ `{string=|function()=}` â€“ path or function that returns a path to an html
    *      template that should be used by {@link ngRoute.directive:ngView ngView}.
    *
    *      If `templateUrl` is a function, it will be called with the following parameters:
    *
    *      - `{Array.<Object>}` - route parameters extracted from the current
    *        `$location.path()` by applying the current route
    *
    *    - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
    *      be injected into the controller. If any of these dependencies are promises, the router
    *      will wait for them all to be resolved or one to be rejected before the controller is
    *      instantiated.
    *      If all the promises are resolved successfully, the values of the resolved promises are
    *      injected and {@link ngRoute.$route#$routeChangeSuccess $routeChangeSuccess} event is
    *      fired. If any of the promises are rejected the
    *      {@link ngRoute.$route#$routeChangeError $routeChangeError} event is fired. The map object
    *      is:
    *
    *      - `key` â€“ `{string}`: a name of a dependency to be injected into the controller.
    *      - `factory` - `{string|function}`: If `string` then it is an alias for a service.
    *        Otherwise if function, then it is {@link auto.$injector#invoke injected}
    *        and the return value is treated as the dependency. If the result is a promise, it is
    *        resolved before its value is injected into the controller. Be aware that
    *        `ngRoute.$routeParams` will still refer to the previous route within these resolve
    *        functions.  Use `$route.current.params` to access the new route parameters, instead.
    *
    *    - `redirectTo` â€“ {(string|function())=} â€“ value to update
    *      {@link ng.$location $location} path with and trigger route redirection.
    *
    *      If `redirectTo` is a function, it will be called with the following parameters:
    *
    *      - `{Object.<string>}` - route parameters extracted from the current
    *        `$location.path()` by applying the current route templateUrl.
    *      - `{string}` - current `$location.path()`
    *      - `{Object}` - current `$location.search()`
    *
    *      The custom `redirectTo` function is expected to return a string which will be used
    *      to update `$location.path()` and `$location.search()`.
    *
    *    - `[reloadOnSearch=true]` - {boolean=} - reload route when only `$location.search()`
    *      or `$location.hash()` changes.
    *
    *      If the option is set to `false` and url in the browser changes, then
    *      `$routeUpdate` event is broadcasted on the root scope.
    *
    *    - `[caseInsensitiveMatch=false]` - {boolean=} - match routes without being case sensitive
    *
    *      If the option is set to `true`, then the particular route can be matched without being
    *      case sensitive
    *
    * @returns {Object} self
    *
    * @description
    * Adds a new route definition to the `$route` service.
    */
   this.when = function(path, route) {
     routes[path] = angular.extend(
       {reloadOnSearch: true},
       route,
       path && pathRegExp(path, route)
     );

     // create redirection for trailing slashes
     if (path) {
       var redirectPath = (path[path.length-1] == '/')
             ? path.substr(0, path.length-1)
             : path +'/';

       routes[redirectPath] = angular.extend(
         {redirectTo: path},
         pathRegExp(redirectPath, route)
       );
     }

     return this;
   };

    /**
     * @param path {string} path
     * @param opts {Object} options
     * @return {?Object}
     *
     * @description
     * Normalizes the given path, returning a regular expression
     * and the original path.
     *
     * Inspired by pathRexp in visionmedia/express/lib/utils.js.
     */
   function pathRegExp(path, opts) {
     var insensitive = opts.caseInsensitiveMatch,
         ret = {
           originalPath: path,
           regexp: path
         },
         keys = ret.keys = [];

     path = path
       .replace(/([().])/g, '\\$1')
       .replace(/(\/)?:(\w+)([\?\*])?/g, function(_, slash, key, option){
         var optional = option === '?' ? option : null;
         var star = option === '*' ? option : null;
         keys.push({ name: key, optional: !!optional });
         slash = slash || '';
         return ''
           + (optional ? '' : slash)
           + '(?:'
           + (optional ? slash : '')
           + (star && '(.+?)' || '([^/]+)')
           + (optional || '')
           + ')'
           + (optional || '');
       })
       .replace(/([\/$\*])/g, '\\$1');

     ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
     return ret;
   }

   /**
    * @ngdoc method
    * @name $routeProvider#otherwise
    *
    * @description
    * Sets route definition that will be used on route change when no other route definition
    * is matched.
    *
    * @param {Object} params Mapping information to be assigned to `$route.current`.
    * @returns {Object} self
    */
   this.otherwise = function(params) {
     this.when(null, params);
     return this;
   };


   this.$get = ['$rootScope',
                '$location',
                '$routeParams',
                '$q',
                '$injector',
                '$http',
                '$templateCache',
                '$sce',
       function($rootScope, $location, $routeParams, $q, $injector, $http, $templateCache, $sce) {

     /**
      * @ngdoc service
      * @name $route
      * @requires $location
      * @requires $routeParams
      *
      * @property {Object} current Reference to the current route definition.
      * The route definition contains:
      *
      *   - `controller`: The controller constructor as define in route definition.
      *   - `locals`: A map of locals which is used by {@link ng.$controller $controller} service for
      *     controller instantiation. The `locals` contain
      *     the resolved values of the `resolve` map. Additionally the `locals` also contain:
      *
      *     - `$scope` - The current route scope.
      *     - `$template` - The current route template HTML.
      *
      * @property {Object} routes Object with all route configuration Objects as its properties.
      *
      * @description
      * `$route` is used for deep-linking URLs to controllers and views (HTML partials).
      * It watches `$location.url()` and tries to map the path to an existing route definition.
      *
      * Requires the {@link ngRoute `ngRoute`} module to be installed.
      *
      * You can define routes through {@link ngRoute.$routeProvider $routeProvider}'s API.
      *
      * The `$route` service is typically used in conjunction with the
      * {@link ngRoute.directive:ngView `ngView`} directive and the
      * {@link ngRoute.$routeParams `$routeParams`} service.
      *
      * @example
      * This example shows how changing the URL hash causes the `$route` to match a route against the
      * URL, and the `ngView` pulls in the partial.
      *
      * Note that this example is using {@link ng.directive:script inlined templates}
      * to get it working on jsfiddle as well.
      *
      * <example name="$route-service" module="ngRouteExample"
      *          deps="angular-route.js" fixBase="true">
      *   <file name="index.html">
      *     <div ng-controller="MainController">
      *       Choose:
      *       <a href="Book/Moby">Moby</a> |
      *       <a href="Book/Moby/ch/1">Moby: Ch1</a> |
      *       <a href="Book/Gatsby">Gatsby</a> |
      *       <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
      *       <a href="Book/Scarlet">Scarlet Letter</a><br/>
      *
      *       <div ng-view></div>
      *
      *       <hr />
      *
      *       <pre>$location.path() = {{$location.path()}}</pre>
      *       <pre>$route.current.templateUrl = {{$route.current.templateUrl}}</pre>
      *       <pre>$route.current.params = {{$route.current.params}}</pre>
      *       <pre>$route.current.scope.name = {{$route.current.scope.name}}</pre>
      *       <pre>$routeParams = {{$routeParams}}</pre>
      *     </div>
      *   </file>
      *
      *   <file name="book.html">
      *     controller: {{name}}<br />
      *     Book Id: {{params.bookId}}<br />
      *   </file>
      *
      *   <file name="chapter.html">
      *     controller: {{name}}<br />
      *     Book Id: {{params.bookId}}<br />
      *     Chapter Id: {{params.chapterId}}
      *   </file>
      *
      *   <file name="script.js">
      *     angular.module('ngRouteExample', ['ngRoute'])
      *
      *      .controller('MainController', function($scope, $route, $routeParams, $location) {
      *          $scope.$route = $route;
      *          $scope.$location = $location;
      *          $scope.$routeParams = $routeParams;
      *      })
      *
      *      .controller('BookController', function($scope, $routeParams) {
      *          $scope.name = "BookController";
      *          $scope.params = $routeParams;
      *      })
      *
      *      .controller('ChapterController', function($scope, $routeParams) {
      *          $scope.name = "ChapterController";
      *          $scope.params = $routeParams;
      *      })
      *
      *     .config(function($routeProvider, $locationProvider) {
      *       $routeProvider
      *        .when('/Book/:bookId', {
      *         templateUrl: 'book.html',
      *         controller: 'BookController',
      *         resolve: {
      *           // I will cause a 1 second delay
      *           delay: function($q, $timeout) {
      *             var delay = $q.defer();
      *             $timeout(delay.resolve, 1000);
      *             return delay.promise;
      *           }
      *         }
      *       })
      *       .when('/Book/:bookId/ch/:chapterId', {
      *         templateUrl: 'chapter.html',
      *         controller: 'ChapterController'
      *       });
      *
      *       // configure html5 to get links working on jsfiddle
      *       $locationProvider.html5Mode(true);
      *     });
      *
      *   </file>
      *
      *   <file name="protractor.js" type="protractor">
      *     it('should load and compile correct template', function() {
      *       element(by.linkText('Moby: Ch1')).click();
      *       var content = element(by.css('[ng-view]')).getText();
      *       expect(content).toMatch(/controller\: ChapterController/);
      *       expect(content).toMatch(/Book Id\: Moby/);
      *       expect(content).toMatch(/Chapter Id\: 1/);
      *
      *       element(by.partialLinkText('Scarlet')).click();
      *
      *       content = element(by.css('[ng-view]')).getText();
      *       expect(content).toMatch(/controller\: BookController/);
      *       expect(content).toMatch(/Book Id\: Scarlet/);
      *     });
      *   </file>
      * </example>
      */

     /**
      * @ngdoc event
      * @name $route#$routeChangeStart
      * @eventType broadcast on root scope
      * @description
      * Broadcasted before a route change. At this  point the route services starts
      * resolving all of the dependencies needed for the route change to occur.
      * Typically this involves fetching the view template as well as any dependencies
      * defined in `resolve` route property. Once  all of the dependencies are resolved
      * `$routeChangeSuccess` is fired.
      *
      * @param {Object} angularEvent Synthetic event object.
      * @param {Route} next Future route information.
      * @param {Route} current Current route information.
      */

     /**
      * @ngdoc event
      * @name $route#$routeChangeSuccess
      * @eventType broadcast on root scope
      * @description
      * Broadcasted after a route dependencies are resolved.
      * {@link ngRoute.directive:ngView ngView} listens for the directive
      * to instantiate the controller and render the view.
      *
      * @param {Object} angularEvent Synthetic event object.
      * @param {Route} current Current route information.
      * @param {Route|Undefined} previous Previous route information, or undefined if current is
      * first route entered.
      */

     /**
      * @ngdoc event
      * @name $route#$routeChangeError
      * @eventType broadcast on root scope
      * @description
      * Broadcasted if any of the resolve promises are rejected.
      *
      * @param {Object} angularEvent Synthetic event object
      * @param {Route} current Current route information.
      * @param {Route} previous Previous route information.
      * @param {Route} rejection Rejection of the promise. Usually the error of the failed promise.
      */

     /**
      * @ngdoc event
      * @name $route#$routeUpdate
      * @eventType broadcast on root scope
      * @description
      *
      * The `reloadOnSearch` property has been set to false, and we are reusing the same
      * instance of the Controller.
      */

     var forceReload = false,
         $route = {
           routes: routes,

           /**
            * @ngdoc method
            * @name $route#reload
            *
            * @description
            * Causes `$route` service to reload the current route even if
            * {@link ng.$location $location} hasn't changed.
            *
            * As a result of that, {@link ngRoute.directive:ngView ngView}
            * creates new scope, reinstantiates the controller.
            */
           reload: function() {
             forceReload = true;
             $rootScope.$evalAsync(updateRoute);
           }
         };

     $rootScope.$on('$locationChangeSuccess', updateRoute);

     return $route;

     /////////////////////////////////////////////////////

     /**
      * @param on {string} current url
      * @param route {Object} route regexp to match the url against
      * @return {?Object}
      *
      * @description
      * Check if the route matches the current url.
      *
      * Inspired by match in
      * visionmedia/express/lib/router/router.js.
      */
     function switchRouteMatcher(on, route) {
       var keys = route.keys,
           params = {};

       if (!route.regexp) return null;

       var m = route.regexp.exec(on);
       if (!m) return null;

       for (var i = 1, len = m.length; i < len; ++i) {
         var key = keys[i - 1];

         var val = 'string' == typeof m[i]
               ? decodeURIComponent(m[i])
               : m[i];

         if (key && val) {
           params[key.name] = val;
         }
       }
       return params;
     }

     function updateRoute() {
       var next = parseRoute(),
           last = $route.current;

       if (next && last && next.$$route === last.$$route
           && angular.equals(next.pathParams, last.pathParams)
           && !next.reloadOnSearch && !forceReload) {
         last.params = next.params;
         angular.copy(last.params, $routeParams);
         $rootScope.$broadcast('$routeUpdate', last);
       } else if (next || last) {
         forceReload = false;
         $rootScope.$broadcast('$routeChangeStart', next, last);
         $route.current = next;
         if (next) {
           if (next.redirectTo) {
             if (angular.isString(next.redirectTo)) {
               $location.path(interpolate(next.redirectTo, next.params)).search(next.params)
                        .replace();
             } else {
               $location.url(next.redirectTo(next.pathParams, $location.path(), $location.search()))
                        .replace();
             }
           }
         }

         $q.when(next).
           then(function() {
             if (next) {
               var locals = angular.extend({}, next.resolve),
                   template, templateUrl;

               angular.forEach(locals, function(value, key) {
                 locals[key] = angular.isString(value) ?
                     $injector.get(value) : $injector.invoke(value);
               });

               if (angular.isDefined(template = next.template)) {
                 if (angular.isFunction(template)) {
                   template = template(next.params);
                 }
               } else if (angular.isDefined(templateUrl = next.templateUrl)) {
                 if (angular.isFunction(templateUrl)) {
                   templateUrl = templateUrl(next.params);
                 }
                 templateUrl = $sce.getTrustedResourceUrl(templateUrl);
                 if (angular.isDefined(templateUrl)) {
                   next.loadedTemplateUrl = templateUrl;
                   template = $http.get(templateUrl, {cache: $templateCache}).
                       then(function(response) { return response.data; });
                 }
               }
               if (angular.isDefined(template)) {
                 locals['$template'] = template;
               }
               return $q.all(locals);
             }
           }).
           // after route change
           then(function(locals) {
             if (next == $route.current) {
               if (next) {
                 next.locals = locals;
                 angular.copy(next.params, $routeParams);
               }
               $rootScope.$broadcast('$routeChangeSuccess', next, last);
             }
           }, function(error) {
             if (next == $route.current) {
               $rootScope.$broadcast('$routeChangeError', next, last, error);
             }
           });
       }
     }


     /**
      * @returns {Object} the current active route, by matching it against the URL
      */
     function parseRoute() {
       // Match a route
       var params, match;
       angular.forEach(routes, function(route, path) {
         if (!match && (params = switchRouteMatcher($location.path(), route))) {
           match = inherit(route, {
             params: angular.extend({}, $location.search(), params),
             pathParams: params});
           match.$$route = route;
         }
       });
       // No route matched; fallback to "otherwise" route
       return match || routes[null] && inherit(routes[null], {params: {}, pathParams:{}});
     }

     /**
      * @returns {string} interpolation of the redirect path with the parameters
      */
     function interpolate(string, params) {
       var result = [];
       angular.forEach((string||'').split(':'), function(segment, i) {
         if (i === 0) {
           result.push(segment);
         } else {
           var segmentMatch = segment.match(/(\w+)(.*)/);
           var key = segmentMatch[1];
           result.push(params[key]);
           result.push(segmentMatch[2] || '');
           delete params[key];
         }
       });
       return result.join('');
     }
   }];
  }

  ngRouteModule.provider('$routeParams', $RouteParamsProvider);


  /**
  * @ngdoc service
  * @name $routeParams
  * @requires $route
  *
  * @description
  * The `$routeParams` service allows you to retrieve the current set of route parameters.
  *
  * Requires the {@link ngRoute `ngRoute`} module to be installed.
  *
  * The route parameters are a combination of {@link ng.$location `$location`}'s
  * {@link ng.$location#search `search()`} and {@link ng.$location#path `path()`}.
  * The `path` parameters are extracted when the {@link ngRoute.$route `$route`} path is matched.
  *
  * In case of parameter name collision, `path` params take precedence over `search` params.
  *
  * The service guarantees that the identity of the `$routeParams` object will remain unchanged
  * (but its properties will likely change) even when a route change occurs.
  *
  * Note that the `$routeParams` are only updated *after* a route change completes successfully.
  * This means that you cannot rely on `$routeParams` being correct in route resolve functions.
  * Instead you can use `$route.current.params` to access the new route's parameters.
  *
  * @example
  * ```js
  *  // Given:
  *  // URL: http://server.com/index.html#/Chapter/1/Section/2?search=moby
  *  // Route: /Chapter/:chapterId/Section/:sectionId
  *  //
  *  // Then
  *  $routeParams ==> {chapterId:1, sectionId:2, search:'moby'}
  * ```
  */
  function $RouteParamsProvider() {
   this.$get = function() { return {}; };
  }

  ngRouteModule.directive('ngView', ngViewFactory);
  ngRouteModule.directive('ngView', ngViewFillContentFactory);


  /**
  * @ngdoc directive
  * @name ngView
  * @restrict ECA
  *
  * @description
  * # Overview
  * `ngView` is a directive that complements the {@link ngRoute.$route $route} service by
  * including the rendered template of the current route into the main layout (`index.html`) file.
  * Every time the current route changes, the included view changes with it according to the
  * configuration of the `$route` service.
  *
  * Requires the {@link ngRoute `ngRoute`} module to be installed.
  *
  * @animations
  * enter - animation is used to bring new content into the browser.
  * leave - animation is used to animate existing content away.
  *
  * The enter and leave animation occur concurrently.
  *
  * @scope
  * @priority 400
  * @param {string=} onload Expression to evaluate whenever the view updates.
  *
  * @param {string=} autoscroll Whether `ngView` should call {@link ng.$anchorScroll
  *                  $anchorScroll} to scroll the viewport after the view is updated.
  *
  *                  - If the attribute is not set, disable scrolling.
  *                  - If the attribute is set without value, enable scrolling.
  *                  - Otherwise enable scrolling only if the `autoscroll` attribute value evaluated
  *                    as an expression yields a truthy value.
  * @example
     <example name="ngView-directive" module="ngViewExample"
              deps="angular-route.js;angular-animate.js"
              animations="true" fixBase="true">
       <file name="index.html">
         <div ng-controller="MainCtrl as main">
           Choose:
           <a href="Book/Moby">Moby</a> |
           <a href="Book/Moby/ch/1">Moby: Ch1</a> |
           <a href="Book/Gatsby">Gatsby</a> |
           <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
           <a href="Book/Scarlet">Scarlet Letter</a><br/>

           <div class="view-animate-container">
             <div ng-view class="view-animate"></div>
           </div>
           <hr />

           <pre>$location.path() = {{main.$location.path()}}</pre>
           <pre>$route.current.templateUrl = {{main.$route.current.templateUrl}}</pre>
           <pre>$route.current.params = {{main.$route.current.params}}</pre>
           <pre>$route.current.scope.name = {{main.$route.current.scope.name}}</pre>
           <pre>$routeParams = {{main.$routeParams}}</pre>
         </div>
       </file>

       <file name="book.html">
         <div>
           controller: {{book.name}}<br />
           Book Id: {{book.params.bookId}}<br />
         </div>
       </file>

       <file name="chapter.html">
         <div>
           controller: {{chapter.name}}<br />
           Book Id: {{chapter.params.bookId}}<br />
           Chapter Id: {{chapter.params.chapterId}}
         </div>
       </file>

       <file name="animations.css">
         .view-animate-container {
           position:relative;
           height:100px!important;
           position:relative;
           background:white;
           border:1px solid black;
           height:40px;
           overflow:hidden;
         }

         .view-animate {
           padding:10px;
         }

         .view-animate.ng-enter, .view-animate.ng-leave {
           -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;
           transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;

           display:block;
           width:100%;
           border-left:1px solid black;

           position:absolute;
           top:0;
           left:0;
           right:0;
           bottom:0;
           padding:10px;
         }

         .view-animate.ng-enter {
           left:100%;
         }
         .view-animate.ng-enter.ng-enter-active {
           left:0;
         }
         .view-animate.ng-leave.ng-leave-active {
           left:-100%;
         }
       </file>

       <file name="script.js">
         angular.module('ngViewExample', ['ngRoute', 'ngAnimate'])
           .config(['$routeProvider', '$locationProvider',
             function($routeProvider, $locationProvider) {
               $routeProvider
                 .when('/Book/:bookId', {
                   templateUrl: 'book.html',
                   controller: 'BookCtrl',
                   controllerAs: 'book'
                 })
                 .when('/Book/:bookId/ch/:chapterId', {
                   templateUrl: 'chapter.html',
                   controller: 'ChapterCtrl',
                   controllerAs: 'chapter'
                 });

               // configure html5 to get links working on jsfiddle
               $locationProvider.html5Mode(true);
           }])
           .controller('MainCtrl', ['$route', '$routeParams', '$location',
             function($route, $routeParams, $location) {
               this.$route = $route;
               this.$location = $location;
               this.$routeParams = $routeParams;
           }])
           .controller('BookCtrl', ['$routeParams', function($routeParams) {
             this.name = "BookCtrl";
             this.params = $routeParams;
           }])
           .controller('ChapterCtrl', ['$routeParams', function($routeParams) {
             this.name = "ChapterCtrl";
             this.params = $routeParams;
           }]);

       </file>

       <file name="protractor.js" type="protractor">
         it('should load and compile correct template', function() {
           element(by.linkText('Moby: Ch1')).click();
           var content = element(by.css('[ng-view]')).getText();
           expect(content).toMatch(/controller\: ChapterCtrl/);
           expect(content).toMatch(/Book Id\: Moby/);
           expect(content).toMatch(/Chapter Id\: 1/);

           element(by.partialLinkText('Scarlet')).click();

           content = element(by.css('[ng-view]')).getText();
           expect(content).toMatch(/controller\: BookCtrl/);
           expect(content).toMatch(/Book Id\: Scarlet/);
         });
       </file>
     </example>
  */


  /**
  * @ngdoc event
  * @name ngView#$viewContentLoaded
  * @eventType emit on the current ngView scope
  * @description
  * Emitted every time the ngView content is reloaded.
  */
  ngViewFactory.$inject = ['$route', '$anchorScroll', '$animate'];
  function ngViewFactory(   $route,   $anchorScroll,   $animate) {
   return {
     restrict: 'ECA',
     terminal: true,
     priority: 400,
     transclude: 'element',
     link: function(scope, $element, attr, ctrl, $transclude) {
         var currentScope,
             currentElement,
             previousElement,
             autoScrollExp = attr.autoscroll,
             onloadExp = attr.onload || '';

         scope.$on('$routeChangeSuccess', update);
         update();

         function cleanupLastView() {
           if(previousElement) {
             previousElement.remove();
             previousElement = null;
           }
           if(currentScope) {
             currentScope.$destroy();
             currentScope = null;
           }
           if(currentElement) {
             $animate.leave(currentElement, function() {
               previousElement = null;
             });
             previousElement = currentElement;
             currentElement = null;
           }
         }

         function update() {
           var locals = $route.current && $route.current.locals,
               template = locals && locals.$template;

           if (angular.isDefined(template)) {
             var newScope = scope.$new();
             var current = $route.current;

             // Note: This will also link all children of ng-view that were contained in the original
             // html. If that content contains controllers, ... they could pollute/change the scope.
             // However, using ng-view on an element with additional content does not make sense...
             // Note: We can't remove them in the cloneAttchFn of $transclude as that
             // function is called before linking the content, which would apply child
             // directives to non existing elements.
             var clone = $transclude(newScope, function(clone) {
               $animate.enter(clone, null, currentElement || $element, function onNgViewEnter () {
                 if (angular.isDefined(autoScrollExp)
                   && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                   $anchorScroll();
                 }
               });
               cleanupLastView();
             });

             currentElement = clone;
             currentScope = current.scope = newScope;
             currentScope.$emit('$viewContentLoaded');
             currentScope.$eval(onloadExp);
           } else {
             cleanupLastView();
           }
         }
     }
   };
  }

  // This directive is called during the $transclude call of the first `ngView` directive.
  // It will replace and compile the content of the element with the loaded template.
  // We need this directive so that the element content is already filled when
  // the link function of another directive on the same element as ngView
  // is called.
  ngViewFillContentFactory.$inject = ['$compile', '$controller', '$route'];
  function ngViewFillContentFactory($compile, $controller, $route) {
   return {
     restrict: 'ECA',
     priority: -400,
     link: function(scope, $element) {
       var current = $route.current,
           locals = current.locals;

       $element.html(locals.$template);

       var link = $compile($element.contents());

       if (current.controller) {
         locals.$scope = scope;
         var controller = $controller(current.controller, locals);
         if (current.controllerAs) {
           scope[current.controllerAs] = controller;
         }
         $element.data('$ngControllerController', controller);
         $element.children().data('$ngControllerController', controller);
       }

       link(scope);
     }
   };
  }

};

},{}],18:[function(require,module,exports){
/**
 * State-based routing for AngularJS
 * @version v0.2.10
 * @link http://angular-ui.github.com/
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

/* commonjs package manager support (eg componentjs) */
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
  module.exports = 'ui.router';
}

(function (window, angular, undefined) {
/*jshint globalstrict:true*/
/*global angular:false*/
'use strict';

var isDefined = angular.isDefined,
    isFunction = angular.isFunction,
    isString = angular.isString,
    isObject = angular.isObject,
    isArray = angular.isArray,
    forEach = angular.forEach,
    extend = angular.extend,
    copy = angular.copy;

function inherit(parent, extra) {
  return extend(new (extend(function() {}, { prototype: parent }))(), extra);
}

function merge(dst) {
  forEach(arguments, function(obj) {
    if (obj !== dst) {
      forEach(obj, function(value, key) {
        if (!dst.hasOwnProperty(key)) dst[key] = value;
      });
    }
  });
  return dst;
}

/**
 * Finds the common ancestor path between two states.
 *
 * @param {Object} first The first state.
 * @param {Object} second The second state.
 * @return {Array} Returns an array of state names in descending order, not including the root.
 */
function ancestors(first, second) {
  var path = [];

  for (var n in first.path) {
    if (first.path[n] !== second.path[n]) break;
    path.push(first.path[n]);
  }
  return path;
}

/**
 * IE8-safe wrapper for `Object.keys()`.
 *
 * @param {Object} object A JavaScript object.
 * @return {Array} Returns the keys of the object as an array.
 */
function keys(object) {
  if (Object.keys) {
    return Object.keys(object);
  }
  var result = [];

  angular.forEach(object, function(val, key) {
    result.push(key);
  });
  return result;
}

/**
 * IE8-safe wrapper for `Array.prototype.indexOf()`.
 *
 * @param {Array} array A JavaScript array.
 * @param {*} value A value to search the array for.
 * @return {Number} Returns the array index value of `value`, or `-1` if not present.
 */
function arraySearch(array, value) {
  if (Array.prototype.indexOf) {
    return array.indexOf(value, Number(arguments[2]) || 0);
  }
  var len = array.length >>> 0, from = Number(arguments[2]) || 0;
  from = (from < 0) ? Math.ceil(from) : Math.floor(from);

  if (from < 0) from += len;

  for (; from < len; from++) {
    if (from in array && array[from] === value) return from;
  }
  return -1;
}

/**
 * Merges a set of parameters with all parameters inherited between the common parents of the
 * current state and a given destination state.
 *
 * @param {Object} currentParams The value of the current state parameters ($stateParams).
 * @param {Object} newParams The set of parameters which will be composited with inherited params.
 * @param {Object} $current Internal definition of object representing the current state.
 * @param {Object} $to Internal definition of object representing state to transition to.
 */
function inheritParams(currentParams, newParams, $current, $to) {
  var parents = ancestors($current, $to), parentParams, inherited = {}, inheritList = [];

  for (var i in parents) {
    if (!parents[i].params || !parents[i].params.length) continue;
    parentParams = parents[i].params;

    for (var j in parentParams) {
      if (arraySearch(inheritList, parentParams[j]) >= 0) continue;
      inheritList.push(parentParams[j]);
      inherited[parentParams[j]] = currentParams[parentParams[j]];
    }
  }
  return extend({}, inherited, newParams);
}

/**
 * Normalizes a set of values to string or `null`, filtering them by a list of keys.
 *
 * @param {Array} keys The list of keys to normalize/return.
 * @param {Object} values An object hash of values to normalize.
 * @return {Object} Returns an object hash of normalized string values.
 */
function normalize(keys, values) {
  var normalized = {};

  forEach(keys, function (name) {
    var value = values[name];
    normalized[name] = (value != null) ? String(value) : null;
  });
  return normalized;
}

/**
 * Performs a non-strict comparison of the subset of two objects, defined by a list of keys.
 *
 * @param {Object} a The first object.
 * @param {Object} b The second object.
 * @param {Array} keys The list of keys within each object to compare. If the list is empty or not specified,
 *                     it defaults to the list of keys in `a`.
 * @return {Boolean} Returns `true` if the keys match, otherwise `false`.
 */
function equalForKeys(a, b, keys) {
  if (!keys) {
    keys = [];
    for (var n in a) keys.push(n); // Used instead of Object.keys() for IE8 compatibility
  }

  for (var i=0; i<keys.length; i++) {
    var k = keys[i];
    if (a[k] != b[k]) return false; // Not '===', values aren't necessarily normalized
  }
  return true;
}

/**
 * Returns the subset of an object, based on a list of keys.
 *
 * @param {Array} keys
 * @param {Object} values
 * @return {Boolean} Returns a subset of `values`.
 */
function filterByKeys(keys, values) {
  var filtered = {};

  forEach(keys, function (name) {
    filtered[name] = values[name];
  });
  return filtered;
}
/**
 * @ngdoc overview
 * @name ui.router.util
 *
 * @description
 * # ui.router.util sub-module
 *
 * This module is a dependency of other sub-modules. Do not include this module as a dependency
 * in your angular app (use {@link ui.router} module instead).
 *
 */
angular.module('ui.router.util', ['ng']);

/**
 * @ngdoc overview
 * @name ui.router.router
 * 
 * @requires ui.router.util
 *
 * @description
 * # ui.router.router sub-module
 *
 * This module is a dependency of other sub-modules. Do not include this module as a dependency
 * in your angular app (use {@link ui.router} module instead).
 */
angular.module('ui.router.router', ['ui.router.util']);

/**
 * @ngdoc overview
 * @name ui.router.state
 * 
 * @requires ui.router.router
 * @requires ui.router.util
 *
 * @description
 * # ui.router.state sub-module
 *
 * This module is a dependency of the main ui.router module. Do not include this module as a dependency
 * in your angular app (use {@link ui.router} module instead).
 * 
 */
angular.module('ui.router.state', ['ui.router.router', 'ui.router.util']);

/**
 * @ngdoc overview
 * @name ui.router
 *
 * @requires ui.router.state
 *
 * @description
 * # ui.router
 * 
 * ## The main module for ui.router 
 * There are several sub-modules included with the ui.router module, however only this module is needed
 * as a dependency within your angular app. The other modules are for organization purposes. 
 *
 * The modules are:
 * * ui.router - the main "umbrella" module
 * * ui.router.router - 
 * 
 * *You'll need to include **only** this module as the dependency within your angular app.*
 * 
 * <pre>
 * <!doctype html>
 * <html ng-app="myApp">
 * <head>
 *   <script src="js/angular.js"></script>
 *   <!-- Include the ui-router script -->
 *   <script src="js/angular-ui-router.min.js"></script>
 *   <script>
 *     // ...and add 'ui.router' as a dependency
 *     var myApp = angular.module('myApp', ['ui.router']);
 *   </script>
 * </head>
 * <body>
 * </body>
 * </html>
 * </pre>
 */
angular.module('ui.router', ['ui.router.state']);

angular.module('ui.router.compat', ['ui.router']);

/**
 * @ngdoc object
 * @name ui.router.util.$resolve
 *
 * @requires $q
 * @requires $injector
 *
 * @description
 * Manages resolution of (acyclic) graphs of promises.
 */
$Resolve.$inject = ['$q', '$injector'];
function $Resolve(  $q,    $injector) {
  
  var VISIT_IN_PROGRESS = 1,
      VISIT_DONE = 2,
      NOTHING = {},
      NO_DEPENDENCIES = [],
      NO_LOCALS = NOTHING,
      NO_PARENT = extend($q.when(NOTHING), { $$promises: NOTHING, $$values: NOTHING });
  

  /**
   * @ngdoc function
   * @name ui.router.util.$resolve#study
   * @methodOf ui.router.util.$resolve
   *
   * @description
   * Studies a set of invocables that are likely to be used multiple times.
   * <pre>
   * $resolve.study(invocables)(locals, parent, self)
   * </pre>
   * is equivalent to
   * <pre>
   * $resolve.resolve(invocables, locals, parent, self)
   * </pre>
   * but the former is more efficient (in fact `resolve` just calls `study` 
   * internally).
   *
   * @param {object} invocables Invocable objects
   * @return {function} a function to pass in locals, parent and self
   */
  this.study = function (invocables) {
    if (!isObject(invocables)) throw new Error("'invocables' must be an object");
    
    // Perform a topological sort of invocables to build an ordered plan
    var plan = [], cycle = [], visited = {};
    function visit(value, key) {
      if (visited[key] === VISIT_DONE) return;
      
      cycle.push(key);
      if (visited[key] === VISIT_IN_PROGRESS) {
        cycle.splice(0, cycle.indexOf(key));
        throw new Error("Cyclic dependency: " + cycle.join(" -> "));
      }
      visited[key] = VISIT_IN_PROGRESS;
      
      if (isString(value)) {
        plan.push(key, [ function() { return $injector.get(value); }], NO_DEPENDENCIES);
      } else {
        var params = $injector.annotate(value);
        forEach(params, function (param) {
          if (param !== key && invocables.hasOwnProperty(param)) visit(invocables[param], param);
        });
        plan.push(key, value, params);
      }
      
      cycle.pop();
      visited[key] = VISIT_DONE;
    }
    forEach(invocables, visit);
    invocables = cycle = visited = null; // plan is all that's required
    
    function isResolve(value) {
      return isObject(value) && value.then && value.$$promises;
    }
    
    return function (locals, parent, self) {
      if (isResolve(locals) && self === undefined) {
        self = parent; parent = locals; locals = null;
      }
      if (!locals) locals = NO_LOCALS;
      else if (!isObject(locals)) {
        throw new Error("'locals' must be an object");
      }       
      if (!parent) parent = NO_PARENT;
      else if (!isResolve(parent)) {
        throw new Error("'parent' must be a promise returned by $resolve.resolve()");
      }
      
      // To complete the overall resolution, we have to wait for the parent
      // promise and for the promise for each invokable in our plan.
      var resolution = $q.defer(),
          result = resolution.promise,
          promises = result.$$promises = {},
          values = extend({}, locals),
          wait = 1 + plan.length/3,
          merged = false;
          
      function done() {
        // Merge parent values we haven't got yet and publish our own $$values
        if (!--wait) {
          if (!merged) merge(values, parent.$$values); 
          result.$$values = values;
          result.$$promises = true; // keep for isResolve()
          resolution.resolve(values);
        }
      }
      
      function fail(reason) {
        result.$$failure = reason;
        resolution.reject(reason);
      }
      
      // Short-circuit if parent has already failed
      if (isDefined(parent.$$failure)) {
        fail(parent.$$failure);
        return result;
      }
      
      // Merge parent values if the parent has already resolved, or merge
      // parent promises and wait if the parent resolve is still in progress.
      if (parent.$$values) {
        merged = merge(values, parent.$$values);
        done();
      } else {
        extend(promises, parent.$$promises);
        parent.then(done, fail);
      }
      
      // Process each invocable in the plan, but ignore any where a local of the same name exists.
      for (var i=0, ii=plan.length; i<ii; i+=3) {
        if (locals.hasOwnProperty(plan[i])) done();
        else invoke(plan[i], plan[i+1], plan[i+2]);
      }
      
      function invoke(key, invocable, params) {
        // Create a deferred for this invocation. Failures will propagate to the resolution as well.
        var invocation = $q.defer(), waitParams = 0;
        function onfailure(reason) {
          invocation.reject(reason);
          fail(reason);
        }
        // Wait for any parameter that we have a promise for (either from parent or from this
        // resolve; in that case study() will have made sure it's ordered before us in the plan).
        forEach(params, function (dep) {
          if (promises.hasOwnProperty(dep) && !locals.hasOwnProperty(dep)) {
            waitParams++;
            promises[dep].then(function (result) {
              values[dep] = result;
              if (!(--waitParams)) proceed();
            }, onfailure);
          }
        });
        if (!waitParams) proceed();
        function proceed() {
          if (isDefined(result.$$failure)) return;
          try {
            invocation.resolve($injector.invoke(invocable, self, values));
            invocation.promise.then(function (result) {
              values[key] = result;
              done();
            }, onfailure);
          } catch (e) {
            onfailure(e);
          }
        }
        // Publish promise synchronously; invocations further down in the plan may depend on it.
        promises[key] = invocation.promise;
      }
      
      return result;
    };
  };
  
  /**
   * @ngdoc function
   * @name ui.router.util.$resolve#resolve
   * @methodOf ui.router.util.$resolve
   *
   * @description
   * Resolves a set of invocables. An invocable is a function to be invoked via 
   * `$injector.invoke()`, and can have an arbitrary number of dependencies. 
   * An invocable can either return a value directly,
   * or a `$q` promise. If a promise is returned it will be resolved and the 
   * resulting value will be used instead. Dependencies of invocables are resolved 
   * (in this order of precedence)
   *
   * - from the specified `locals`
   * - from another invocable that is part of this `$resolve` call
   * - from an invocable that is inherited from a `parent` call to `$resolve` 
   *   (or recursively
   * - from any ancestor `$resolve` of that parent).
   *
   * The return value of `$resolve` is a promise for an object that contains 
   * (in this order of precedence)
   *
   * - any `locals` (if specified)
   * - the resolved return values of all injectables
   * - any values inherited from a `parent` call to `$resolve` (if specified)
   *
   * The promise will resolve after the `parent` promise (if any) and all promises 
   * returned by injectables have been resolved. If any invocable 
   * (or `$injector.invoke`) throws an exception, or if a promise returned by an 
   * invocable is rejected, the `$resolve` promise is immediately rejected with the 
   * same error. A rejection of a `parent` promise (if specified) will likewise be 
   * propagated immediately. Once the `$resolve` promise has been rejected, no 
   * further invocables will be called.
   * 
   * Cyclic dependencies between invocables are not permitted and will caues `$resolve`
   * to throw an error. As a special case, an injectable can depend on a parameter 
   * with the same name as the injectable, which will be fulfilled from the `parent` 
   * injectable of the same name. This allows inherited values to be decorated. 
   * Note that in this case any other injectable in the same `$resolve` with the same
   * dependency would see the decorated value, not the inherited value.
   *
   * Note that missing dependencies -- unlike cyclic dependencies -- will cause an 
   * (asynchronous) rejection of the `$resolve` promise rather than a (synchronous) 
   * exception.
   *
   * Invocables are invoked eagerly as soon as all dependencies are available. 
   * This is true even for dependencies inherited from a `parent` call to `$resolve`.
   *
   * As a special case, an invocable can be a string, in which case it is taken to 
   * be a service name to be passed to `$injector.get()`. This is supported primarily 
   * for backwards-compatibility with the `resolve` property of `$routeProvider` 
   * routes.
   *
   * @param {object} invocables functions to invoke or 
   * `$injector` services to fetch.
   * @param {object} locals  values to make available to the injectables
   * @param {object} parent  a promise returned by another call to `$resolve`.
   * @param {object} self  the `this` for the invoked methods
   * @return {object} Promise for an object that contains the resolved return value
   * of all invocables, as well as any inherited and local values.
   */
  this.resolve = function (invocables, locals, parent, self) {
    return this.study(invocables)(locals, parent, self);
  };
}

angular.module('ui.router.util').service('$resolve', $Resolve);


/**
 * @ngdoc object
 * @name ui.router.util.$templateFactory
 *
 * @requires $http
 * @requires $templateCache
 * @requires $injector
 *
 * @description
 * Service. Manages loading of templates.
 */
$TemplateFactory.$inject = ['$http', '$templateCache', '$injector'];
function $TemplateFactory(  $http,   $templateCache,   $injector) {

  /**
   * @ngdoc function
   * @name ui.router.util.$templateFactory#fromConfig
   * @methodOf ui.router.util.$templateFactory
   *
   * @description
   * Creates a template from a configuration object. 
   *
   * @param {object} config Configuration object for which to load a template. 
   * The following properties are search in the specified order, and the first one 
   * that is defined is used to create the template:
   *
   * @param {string|object} config.template html string template or function to 
   * load via {@link ui.router.util.$templateFactory#fromString fromString}.
   * @param {string|object} config.templateUrl url to load or a function returning 
   * the url to load via {@link ui.router.util.$templateFactory#fromUrl fromUrl}.
   * @param {Function} config.templateProvider function to invoke via 
   * {@link ui.router.util.$templateFactory#fromProvider fromProvider}.
   * @param {object} params  Parameters to pass to the template function.
   * @param {object} locals Locals to pass to `invoke` if the template is loaded 
   * via a `templateProvider`. Defaults to `{ params: params }`.
   *
   * @return {string|object}  The template html as a string, or a promise for 
   * that string,or `null` if no template is configured.
   */
  this.fromConfig = function (config, params, locals) {
    return (
      isDefined(config.template) ? this.fromString(config.template, params) :
      isDefined(config.templateUrl) ? this.fromUrl(config.templateUrl, params) :
      isDefined(config.templateProvider) ? this.fromProvider(config.templateProvider, params, locals) :
      null
    );
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$templateFactory#fromString
   * @methodOf ui.router.util.$templateFactory
   *
   * @description
   * Creates a template from a string or a function returning a string.
   *
   * @param {string|object} template html template as a string or function that 
   * returns an html template as a string.
   * @param {object} params Parameters to pass to the template function.
   *
   * @return {string|object} The template html as a string, or a promise for that 
   * string.
   */
  this.fromString = function (template, params) {
    return isFunction(template) ? template(params) : template;
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$templateFactory#fromUrl
   * @methodOf ui.router.util.$templateFactory
   * 
   * @description
   * Loads a template from the a URL via `$http` and `$templateCache`.
   *
   * @param {string|Function} url url of the template to load, or a function 
   * that returns a url.
   * @param {Object} params Parameters to pass to the url function.
   * @return {string|Promise.<string>} The template html as a string, or a promise 
   * for that string.
   */
  this.fromUrl = function (url, params) {
    if (isFunction(url)) url = url(params);
    if (url == null) return null;
    else return $http
        .get(url, { cache: $templateCache })
        .then(function(response) { return response.data; });
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$templateFactory#fromUrl
   * @methodOf ui.router.util.$templateFactory
   *
   * @description
   * Creates a template by invoking an injectable provider function.
   *
   * @param {Function} provider Function to invoke via `$injector.invoke`
   * @param {Object} params Parameters for the template.
   * @param {Object} locals Locals to pass to `invoke`. Defaults to 
   * `{ params: params }`.
   * @return {string|Promise.<string>} The template html as a string, or a promise 
   * for that string.
   */
  this.fromProvider = function (provider, params, locals) {
    return $injector.invoke(provider, null, locals || { params: params });
  };
}

angular.module('ui.router.util').service('$templateFactory', $TemplateFactory);

/**
 * @ngdoc object
 * @name ui.router.util.type:UrlMatcher
 *
 * @description
 * Matches URLs against patterns and extracts named parameters from the path or the search
 * part of the URL. A URL pattern consists of a path pattern, optionally followed by '?' and a list
 * of search parameters. Multiple search parameter names are separated by '&'. Search parameters
 * do not influence whether or not a URL is matched, but their values are passed through into
 * the matched parameters returned by {@link ui.router.util.type:UrlMatcher#methods_exec exec}.
 * 
 * Path parameter placeholders can be specified using simple colon/catch-all syntax or curly brace
 * syntax, which optionally allows a regular expression for the parameter to be specified:
 *
 * * `':'` name - colon placeholder
 * * `'*'` name - catch-all placeholder
 * * `'{' name '}'` - curly placeholder
 * * `'{' name ':' regexp '}'` - curly placeholder with regexp. Should the regexp itself contain
 *   curly braces, they must be in matched pairs or escaped with a backslash.
 *
 * Parameter names may contain only word characters (latin letters, digits, and underscore) and
 * must be unique within the pattern (across both path and search parameters). For colon 
 * placeholders or curly placeholders without an explicit regexp, a path parameter matches any
 * number of characters other than '/'. For catch-all placeholders the path parameter matches
 * any number of characters.
 * 
 * Examples:
 * 
 * * `'/hello/'` - Matches only if the path is exactly '/hello/'. There is no special treatment for
 *   trailing slashes, and patterns have to match the entire path, not just a prefix.
 * * `'/user/:id'` - Matches '/user/bob' or '/user/1234!!!' or even '/user/' but not '/user' or
 *   '/user/bob/details'. The second path segment will be captured as the parameter 'id'.
 * * `'/user/{id}'` - Same as the previous example, but using curly brace syntax.
 * * `'/user/{id:[^/]*}'` - Same as the previous example.
 * * `'/user/{id:[0-9a-fA-F]{1,8}}'` - Similar to the previous example, but only matches if the id
 *   parameter consists of 1 to 8 hex digits.
 * * `'/files/{path:.*}'` - Matches any URL starting with '/files/' and captures the rest of the
 *   path into the parameter 'path'.
 * * `'/files/*path'` - ditto.
 *
 * @param {string} pattern  the pattern to compile into a matcher.
 *
 * @property {string} prefix  A static prefix of this pattern. The matcher guarantees that any
 *   URL matching this matcher (i.e. any string for which {@link ui.router.util.type:UrlMatcher#methods_exec exec()} returns
 *   non-null) will start with this prefix.
 *
 * @property {string} source  The pattern that was passed into the contructor
 *
 * @property {string} sourcePath  The path portion of the source property
 *
 * @property {string} sourceSearch  The search portion of the source property
 *
 * @property {string} regex  The constructed regex that will be used to match against the url when 
 *   it is time to determine which url will match.
 *
 * @returns {Object}  New UrlMatcher object
 */
function UrlMatcher(pattern) {

  // Find all placeholders and create a compiled pattern, using either classic or curly syntax:
  //   '*' name
  //   ':' name
  //   '{' name '}'
  //   '{' name ':' regexp '}'
  // The regular expression is somewhat complicated due to the need to allow curly braces
  // inside the regular expression. The placeholder regexp breaks down as follows:
  //    ([:*])(\w+)               classic placeholder ($1 / $2)
  //    \{(\w+)(?:\:( ... ))?\}   curly brace placeholder ($3) with optional regexp ... ($4)
  //    (?: ... | ... | ... )+    the regexp consists of any number of atoms, an atom being either
  //    [^{}\\]+                  - anything other than curly braces or backslash
  //    \\.                       - a backslash escape
  //    \{(?:[^{}\\]+|\\.)*\}     - a matched set of curly braces containing other atoms
  var placeholder = /([:*])(\w+)|\{(\w+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,
      names = {}, compiled = '^', last = 0, m,
      segments = this.segments = [],
      params = this.params = [];

  function addParameter(id) {
    if (!/^\w+(-+\w+)*$/.test(id)) throw new Error("Invalid parameter name '" + id + "' in pattern '" + pattern + "'");
    if (names[id]) throw new Error("Duplicate parameter name '" + id + "' in pattern '" + pattern + "'");
    names[id] = true;
    params.push(id);
  }

  function quoteRegExp(string) {
    return string.replace(/[\\\[\]\^$*+?.()|{}]/g, "\\$&");
  }

  this.source = pattern;

  // Split into static segments separated by path parameter placeholders.
  // The number of segments is always 1 more than the number of parameters.
  var id, regexp, segment;
  while ((m = placeholder.exec(pattern))) {
    id = m[2] || m[3]; // IE[78] returns '' for unmatched groups instead of null
    regexp = m[4] || (m[1] == '*' ? '.*' : '[^/]*');
    segment = pattern.substring(last, m.index);
    if (segment.indexOf('?') >= 0) break; // we're into the search part
    compiled += quoteRegExp(segment) + '(' + regexp + ')';
    addParameter(id);
    segments.push(segment);
    last = placeholder.lastIndex;
  }
  segment = pattern.substring(last);

  // Find any search parameter names and remove them from the last segment
  var i = segment.indexOf('?');
  if (i >= 0) {
    var search = this.sourceSearch = segment.substring(i);
    segment = segment.substring(0, i);
    this.sourcePath = pattern.substring(0, last+i);

    // Allow parameters to be separated by '?' as well as '&' to make concat() easier
    forEach(search.substring(1).split(/[&?]/), addParameter);
  } else {
    this.sourcePath = pattern;
    this.sourceSearch = '';
  }

  compiled += quoteRegExp(segment) + '$';
  segments.push(segment);
  this.regexp = new RegExp(compiled);
  this.prefix = segments[0];
}

/**
 * @ngdoc function
 * @name ui.router.util.type:UrlMatcher#concat
 * @methodOf ui.router.util.type:UrlMatcher
 *
 * @description
 * Returns a new matcher for a pattern constructed by appending the path part and adding the
 * search parameters of the specified pattern to this pattern. The current pattern is not
 * modified. This can be understood as creating a pattern for URLs that are relative to (or
 * suffixes of) the current pattern.
 *
 * @example
 * The following two matchers are equivalent:
 * ```
 * new UrlMatcher('/user/{id}?q').concat('/details?date');
 * new UrlMatcher('/user/{id}/details?q&date');
 * ```
 *
 * @param {string} pattern  The pattern to append.
 * @returns {ui.router.util.type:UrlMatcher}  A matcher for the concatenated pattern.
 */
UrlMatcher.prototype.concat = function (pattern) {
  // Because order of search parameters is irrelevant, we can add our own search
  // parameters to the end of the new pattern. Parse the new pattern by itself
  // and then join the bits together, but it's much easier to do this on a string level.
  return new UrlMatcher(this.sourcePath + pattern + this.sourceSearch);
};

UrlMatcher.prototype.toString = function () {
  return this.source;
};

/**
 * @ngdoc function
 * @name ui.router.util.type:UrlMatcher#exec
 * @methodOf ui.router.util.type:UrlMatcher
 *
 * @description
 * Tests the specified path against this matcher, and returns an object containing the captured
 * parameter values, or null if the path does not match. The returned object contains the values
 * of any search parameters that are mentioned in the pattern, but their value may be null if
 * they are not present in `searchParams`. This means that search parameters are always treated
 * as optional.
 *
 * @example
 * ```
 * new UrlMatcher('/user/{id}?q&r').exec('/user/bob', { x:'1', q:'hello' });
 * // returns { id:'bob', q:'hello', r:null }
 * ```
 *
 * @param {string} path  The URL path to match, e.g. `$location.path()`.
 * @param {Object} searchParams  URL search parameters, e.g. `$location.search()`.
 * @returns {Object}  The captured parameter values.
 */
UrlMatcher.prototype.exec = function (path, searchParams) {
  var m = this.regexp.exec(path);
  if (!m) return null;

  var params = this.params, nTotal = params.length,
    nPath = this.segments.length-1,
    values = {}, i;

  if (nPath !== m.length - 1) throw new Error("Unbalanced capture group in route '" + this.source + "'");

  for (i=0; i<nPath; i++) values[params[i]] = m[i+1];
  for (/**/; i<nTotal; i++) values[params[i]] = searchParams[params[i]];

  return values;
};

/**
 * @ngdoc function
 * @name ui.router.util.type:UrlMatcher#parameters
 * @methodOf ui.router.util.type:UrlMatcher
 *
 * @description
 * Returns the names of all path and search parameters of this pattern in an unspecified order.
 * 
 * @returns {Array.<string>}  An array of parameter names. Must be treated as read-only. If the
 *    pattern has no parameters, an empty array is returned.
 */
UrlMatcher.prototype.parameters = function () {
  return this.params;
};

/**
 * @ngdoc function
 * @name ui.router.util.type:UrlMatcher#format
 * @methodOf ui.router.util.type:UrlMatcher
 *
 * @description
 * Creates a URL that matches this pattern by substituting the specified values
 * for the path and search parameters. Null values for path parameters are
 * treated as empty strings.
 *
 * @example
 * ```
 * new UrlMatcher('/user/{id}?q').format({ id:'bob', q:'yes' });
 * // returns '/user/bob?q=yes'
 * ```
 *
 * @param {Object} values  the values to substitute for the parameters in this pattern.
 * @returns {string}  the formatted URL (path and optionally search part).
 */
UrlMatcher.prototype.format = function (values) {
  var segments = this.segments, params = this.params;
  if (!values) return segments.join('');

  var nPath = segments.length-1, nTotal = params.length,
    result = segments[0], i, search, value;

  for (i=0; i<nPath; i++) {
    value = values[params[i]];
    // TODO: Maybe we should throw on null here? It's not really good style to use '' and null interchangeabley
    if (value != null) result += encodeURIComponent(value);
    result += segments[i+1];
  }
  for (/**/; i<nTotal; i++) {
    value = values[params[i]];
    if (value != null) {
      result += (search ? '&' : '?') + params[i] + '=' + encodeURIComponent(value);
      search = true;
    }
  }

  return result;
};



/**
 * @ngdoc object
 * @name ui.router.util.$urlMatcherFactory
 *
 * @description
 * Factory for {@link ui.router.util.type:UrlMatcher} instances. The factory is also available to providers
 * under the name `$urlMatcherFactoryProvider`.
 */
function $UrlMatcherFactory() {

  /**
   * @ngdoc function
   * @name ui.router.util.$urlMatcherFactory#compile
   * @methodOf ui.router.util.$urlMatcherFactory
   *
   * @description
   * Creates a {@link ui.router.util.type:UrlMatcher} for the specified pattern.
   *   
   * @param {string} pattern  The URL pattern.
   * @returns {ui.router.util.type:UrlMatcher}  The UrlMatcher.
   */
  this.compile = function (pattern) {
    return new UrlMatcher(pattern);
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$urlMatcherFactory#isMatcher
   * @methodOf ui.router.util.$urlMatcherFactory
   *
   * @description
   * Returns true if the specified object is a UrlMatcher, or false otherwise.
   *
   * @param {Object} object  The object to perform the type check against.
   * @returns {Boolean}  Returns `true` if the object has the following functions: `exec`, `format`, and `concat`.
   */
  this.isMatcher = function (o) {
    return isObject(o) && isFunction(o.exec) && isFunction(o.format) && isFunction(o.concat);
  };
  
  /* No need to document $get, since it returns this */
  this.$get = function () {
    return this;
  };
}

// Register as a provider so it's available to other providers
angular.module('ui.router.util').provider('$urlMatcherFactory', $UrlMatcherFactory);

/**
 * @ngdoc object
 * @name ui.router.router.$urlRouterProvider
 *
 * @requires ui.router.util.$urlMatcherFactoryProvider
 *
 * @description
 * `$urlRouterProvider` has the responsibility of watching `$location`. 
 * When `$location` changes it runs through a list of rules one by one until a 
 * match is found. `$urlRouterProvider` is used behind the scenes anytime you specify 
 * a url in a state configuration. All urls are compiled into a UrlMatcher object.
 *
 * There are several methods on `$urlRouterProvider` that make it useful to use directly
 * in your module config.
 */
$UrlRouterProvider.$inject = ['$urlMatcherFactoryProvider'];
function $UrlRouterProvider(  $urlMatcherFactory) {
  var rules = [], 
      otherwise = null;

  // Returns a string that is a prefix of all strings matching the RegExp
  function regExpPrefix(re) {
    var prefix = /^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{}]+)*)/.exec(re.source);
    return (prefix != null) ? prefix[1].replace(/\\(.)/g, "$1") : '';
  }

  // Interpolates matched values into a String.replace()-style pattern
  function interpolate(pattern, match) {
    return pattern.replace(/\$(\$|\d{1,2})/, function (m, what) {
      return match[what === '$' ? 0 : Number(what)];
    });
  }

  /**
   * @ngdoc function
   * @name ui.router.router.$urlRouterProvider#rule
   * @methodOf ui.router.router.$urlRouterProvider
   *
   * @description
   * Defines rules that are used by `$urlRouterProvider to find matches for
   * specific URLs.
   *
   * @example
   * <pre>
   * var app = angular.module('app', ['ui.router.router']);
   *
   * app.config(function ($urlRouterProvider) {
   *   // Here's an example of how you might allow case insensitive urls
   *   $urlRouterProvider.rule(function ($injector, $location) {
   *     var path = $location.path(),
   *         normalized = path.toLowerCase();
   *
   *     if (path !== normalized) {
   *       return normalized;
   *     }
   *   });
   * });
   * </pre>
   *
   * @param {object} rule Handler function that takes `$injector` and `$location`
   * services as arguments. You can use them to return a valid path as a string.
   *
   * @return {object} $urlRouterProvider - $urlRouterProvider instance
   */
  this.rule =
    function (rule) {
      if (!isFunction(rule)) throw new Error("'rule' must be a function");
      rules.push(rule);
      return this;
    };

  /**
   * @ngdoc object
   * @name ui.router.router.$urlRouterProvider#otherwise
   * @methodOf ui.router.router.$urlRouterProvider
   *
   * @description
   * Defines a path that is used when an invalied route is requested.
   *
   * @example
   * <pre>
   * var app = angular.module('app', ['ui.router.router']);
   *
   * app.config(function ($urlRouterProvider) {
   *   // if the path doesn't match any of the urls you configured
   *   // otherwise will take care of routing the user to the
   *   // specified url
   *   $urlRouterProvider.otherwise('/index');
   *
   *   // Example of using function rule as param
   *   $urlRouterProvider.otherwise(function ($injector, $location) {
   *     ...
   *   });
   * });
   * </pre>
   *
   * @param {string|object} rule The url path you want to redirect to or a function 
   * rule that returns the url path. The function version is passed two params: 
   * `$injector` and `$location` services.
   *
   * @return {object} $urlRouterProvider - $urlRouterProvider instance
   */
  this.otherwise =
    function (rule) {
      if (isString(rule)) {
        var redirect = rule;
        rule = function () { return redirect; };
      }
      else if (!isFunction(rule)) throw new Error("'rule' must be a function");
      otherwise = rule;
      return this;
    };


  function handleIfMatch($injector, handler, match) {
    if (!match) return false;
    var result = $injector.invoke(handler, handler, { $match: match });
    return isDefined(result) ? result : true;
  }

  /**
   * @ngdoc function
   * @name ui.router.router.$urlRouterProvider#when
   * @methodOf ui.router.router.$urlRouterProvider
   *
   * @description
   * Registers a handler for a given url matching. if handle is a string, it is
   * treated as a redirect, and is interpolated according to the syyntax of match
   * (i.e. like String.replace() for RegExp, or like a UrlMatcher pattern otherwise).
   *
   * If the handler is a function, it is injectable. It gets invoked if `$location`
   * matches. You have the option of inject the match object as `$match`.
   *
   * The handler can return
   *
   * - **falsy** to indicate that the rule didn't match after all, then `$urlRouter`
   *   will continue trying to find another one that matches.
   * - **string** which is treated as a redirect and passed to `$location.url()`
   * - **void** or any **truthy** value tells `$urlRouter` that the url was handled.
   *
   * @example
   * <pre>
   * var app = angular.module('app', ['ui.router.router']);
   *
   * app.config(function ($urlRouterProvider) {
   *   $urlRouterProvider.when($state.url, function ($match, $stateParams) {
   *     if ($state.$current.navigable !== state ||
   *         !equalForKeys($match, $stateParams) {
   *      $state.transitionTo(state, $match, false);
   *     }
   *   });
   * });
   * </pre>
   *
   * @param {string|object} what The incoming path that you want to redirect.
   * @param {string|object} handler The path you want to redirect your user to.
   */
  this.when =
    function (what, handler) {
      var redirect, handlerIsString = isString(handler);
      if (isString(what)) what = $urlMatcherFactory.compile(what);

      if (!handlerIsString && !isFunction(handler) && !isArray(handler))
        throw new Error("invalid 'handler' in when()");

      var strategies = {
        matcher: function (what, handler) {
          if (handlerIsString) {
            redirect = $urlMatcherFactory.compile(handler);
            handler = ['$match', function ($match) { return redirect.format($match); }];
          }
          return extend(function ($injector, $location) {
            return handleIfMatch($injector, handler, what.exec($location.path(), $location.search()));
          }, {
            prefix: isString(what.prefix) ? what.prefix : ''
          });
        },
        regex: function (what, handler) {
          if (what.global || what.sticky) throw new Error("when() RegExp must not be global or sticky");

          if (handlerIsString) {
            redirect = handler;
            handler = ['$match', function ($match) { return interpolate(redirect, $match); }];
          }
          return extend(function ($injector, $location) {
            return handleIfMatch($injector, handler, what.exec($location.path()));
          }, {
            prefix: regExpPrefix(what)
          });
        }
      };

      var check = { matcher: $urlMatcherFactory.isMatcher(what), regex: what instanceof RegExp };

      for (var n in check) {
        if (check[n]) {
          return this.rule(strategies[n](what, handler));
        }
      }

      throw new Error("invalid 'what' in when()");
    };

  /**
   * @ngdoc object
   * @name ui.router.router.$urlRouter
   *
   * @requires $location
   * @requires $rootScope
   * @requires $injector
   *
   * @description
   *
   */
  this.$get =
    [        '$location', '$rootScope', '$injector',
    function ($location,   $rootScope,   $injector) {
      // TODO: Optimize groups of rules with non-empty prefix into some sort of decision tree
      function update(evt) {
        if (evt && evt.defaultPrevented) return;
        function check(rule) {
          var handled = rule($injector, $location);
          if (handled) {
            if (isString(handled)) $location.replace().url(handled);
            return true;
          }
          return false;
        }
        var n=rules.length, i;
        for (i=0; i<n; i++) {
          if (check(rules[i])) return;
        }
        // always check otherwise last to allow dynamic updates to the set of rules
        if (otherwise) check(otherwise);
      }

      $rootScope.$on('$locationChangeSuccess', update);

      return {
        /**
         * @ngdoc function
         * @name ui.router.router.$urlRouter#sync
         * @methodOf ui.router.router.$urlRouter
         *
         * @description
         * Triggers an update; the same update that happens when the address bar url changes, aka `$locationChangeSuccess`.
         * This method is useful when you need to use `preventDefault()` on the `$locationChangeSuccess` event, 
         * perform some custom logic (route protection, auth, config, redirection, etc) and then finally proceed 
         * with the transition by calling `$urlRouter.sync()`.
         *
         * @example
         * <pre>
         * angular.module('app', ['ui.router']);
         *   .run(function($rootScope, $urlRouter) {
         *     $rootScope.$on('$locationChangeSuccess', function(evt) {
         *       // Halt state change from even starting
         *       evt.preventDefault();
         *       // Perform custom logic
         *       var meetsRequirement = ...
         *       // Continue with the update and state transition if logic allows
         *       if (meetsRequirement) $urlRouter.sync();
         *     });
         * });
         * </pre>
         */
        sync: function () {
          update();
        }
      };
    }];
}

angular.module('ui.router.router').provider('$urlRouter', $UrlRouterProvider);

/**
 * @ngdoc object
 * @name ui.router.state.$stateProvider
 *
 * @requires ui.router.router.$urlRouterProvider
 * @requires ui.router.util.$urlMatcherFactoryProvider
 * @requires $locationProvider
 *
 * @description
 * The new `$stateProvider` works similar to Angular's v1 router, but it focuses purely
 * on state.
 *
 * A state corresponds to a "place" in the application in terms of the overall UI and
 * navigation. A state describes (via the controller / template / view properties) what
 * the UI looks like and does at that place.
 *
 * States often have things in common, and the primary way of factoring out these
 * commonalities in this model is via the state hierarchy, i.e. parent/child states aka
 * nested states.
 *
 * The `$stateProvider` provides interfaces to declare these states for your app.
 */
$StateProvider.$inject = ['$urlRouterProvider', '$urlMatcherFactoryProvider', '$locationProvider'];
function $StateProvider(   $urlRouterProvider,   $urlMatcherFactory,           $locationProvider) {

  var root, states = {}, $state, queue = {}, abstractKey = 'abstract';

  // Builds state properties from definition passed to registerState()
  var stateBuilder = {

    // Derive parent state from a hierarchical name only if 'parent' is not explicitly defined.
    // state.children = [];
    // if (parent) parent.children.push(state);
    parent: function(state) {
      if (isDefined(state.parent) && state.parent) return findState(state.parent);
      // regex matches any valid composite state name
      // would match "contact.list" but not "contacts"
      var compositeName = /^(.+)\.[^.]+$/.exec(state.name);
      return compositeName ? findState(compositeName[1]) : root;
    },

    // inherit 'data' from parent and override by own values (if any)
    data: function(state) {
      if (state.parent && state.parent.data) {
        state.data = state.self.data = extend({}, state.parent.data, state.data);
      }
      return state.data;
    },

    // Build a URLMatcher if necessary, either via a relative or absolute URL
    url: function(state) {
      var url = state.url;

      if (isString(url)) {
        if (url.charAt(0) == '^') {
          return $urlMatcherFactory.compile(url.substring(1));
        }
        return (state.parent.navigable || root).url.concat(url);
      }

      if ($urlMatcherFactory.isMatcher(url) || url == null) {
        return url;
      }
      throw new Error("Invalid url '" + url + "' in state '" + state + "'");
    },

    // Keep track of the closest ancestor state that has a URL (i.e. is navigable)
    navigable: function(state) {
      return state.url ? state : (state.parent ? state.parent.navigable : null);
    },

    // Derive parameters for this state and ensure they're a super-set of parent's parameters
    params: function(state) {
      if (!state.params) {
        return state.url ? state.url.parameters() : state.parent.params;
      }
      if (!isArray(state.params)) throw new Error("Invalid params in state '" + state + "'");
      if (state.url) throw new Error("Both params and url specicified in state '" + state + "'");
      return state.params;
    },

    // If there is no explicit multi-view configuration, make one up so we don't have
    // to handle both cases in the view directive later. Note that having an explicit
    // 'views' property will mean the default unnamed view properties are ignored. This
    // is also a good time to resolve view names to absolute names, so everything is a
    // straight lookup at link time.
    views: function(state) {
      var views = {};

      forEach(isDefined(state.views) ? state.views : { '': state }, function (view, name) {
        if (name.indexOf('@') < 0) name += '@' + state.parent.name;
        views[name] = view;
      });
      return views;
    },

    ownParams: function(state) {
      if (!state.parent) {
        return state.params;
      }
      var paramNames = {}; forEach(state.params, function (p) { paramNames[p] = true; });

      forEach(state.parent.params, function (p) {
        if (!paramNames[p]) {
          throw new Error("Missing required parameter '" + p + "' in state '" + state.name + "'");
        }
        paramNames[p] = false;
      });
      var ownParams = [];

      forEach(paramNames, function (own, p) {
        if (own) ownParams.push(p);
      });
      return ownParams;
    },

    // Keep a full path from the root down to this state as this is needed for state activation.
    path: function(state) {
      return state.parent ? state.parent.path.concat(state) : []; // exclude root from path
    },

    // Speed up $state.contains() as it's used a lot
    includes: function(state) {
      var includes = state.parent ? extend({}, state.parent.includes) : {};
      includes[state.name] = true;
      return includes;
    },

    $delegates: {}
  };

  function isRelative(stateName) {
    return stateName.indexOf(".") === 0 || stateName.indexOf("^") === 0;
  }

  function findState(stateOrName, base) {
    var isStr = isString(stateOrName),
        name  = isStr ? stateOrName : stateOrName.name,
        path  = isRelative(name);

    if (path) {
      if (!base) throw new Error("No reference point given for path '"  + name + "'");
      var rel = name.split("."), i = 0, pathLength = rel.length, current = base;

      for (; i < pathLength; i++) {
        if (rel[i] === "" && i === 0) {
          current = base;
          continue;
        }
        if (rel[i] === "^") {
          if (!current.parent) throw new Error("Path '" + name + "' not valid for state '" + base.name + "'");
          current = current.parent;
          continue;
        }
        break;
      }
      rel = rel.slice(i).join(".");
      name = current.name + (current.name && rel ? "." : "") + rel;
    }
    var state = states[name];

    if (state && (isStr || (!isStr && (state === stateOrName || state.self === stateOrName)))) {
      return state;
    }
    return undefined;
  }

  function queueState(parentName, state) {
    if (!queue[parentName]) {
      queue[parentName] = [];
    }
    queue[parentName].push(state);
  }

  function registerState(state) {
    // Wrap a new object around the state so we can store our private details easily.
    state = inherit(state, {
      self: state,
      resolve: state.resolve || {},
      toString: function() { return this.name; }
    });

    var name = state.name;
    if (!isString(name) || name.indexOf('@') >= 0) throw new Error("State must have a valid name");
    if (states.hasOwnProperty(name)) throw new Error("State '" + name + "'' is already defined");

    // Get parent name
    var parentName = (name.indexOf('.') !== -1) ? name.substring(0, name.lastIndexOf('.'))
        : (isString(state.parent)) ? state.parent
        : '';

    // If parent is not registered yet, add state to queue and register later
    if (parentName && !states[parentName]) {
      return queueState(parentName, state.self);
    }

    for (var key in stateBuilder) {
      if (isFunction(stateBuilder[key])) state[key] = stateBuilder[key](state, stateBuilder.$delegates[key]);
    }
    states[name] = state;

    // Register the state in the global state list and with $urlRouter if necessary.
    if (!state[abstractKey] && state.url) {
      $urlRouterProvider.when(state.url, ['$match', '$stateParams', function ($match, $stateParams) {
        if ($state.$current.navigable != state || !equalForKeys($match, $stateParams)) {
          $state.transitionTo(state, $match, { location: false });
        }
      }]);
    }

    // Register any queued children
    if (queue[name]) {
      for (var i = 0; i < queue[name].length; i++) {
        registerState(queue[name][i]);
      }
    }

    return state;
  }

  // Checks text to see if it looks like a glob.
  function isGlob (text) {
    return text.indexOf('*') > -1;
  }

  // Returns true if glob matches current $state name.
  function doesStateMatchGlob (glob) {
    var globSegments = glob.split('.'),
        segments = $state.$current.name.split('.');

    //match greedy starts
    if (globSegments[0] === '**') {
       segments = segments.slice(segments.indexOf(globSegments[1]));
       segments.unshift('**');
    }
    //match greedy ends
    if (globSegments[globSegments.length - 1] === '**') {
       segments.splice(segments.indexOf(globSegments[globSegments.length - 2]) + 1, Number.MAX_VALUE);
       segments.push('**');
    }

    if (globSegments.length != segments.length) {
      return false;
    }

    //match single stars
    for (var i = 0, l = globSegments.length; i < l; i++) {
      if (globSegments[i] === '*') {
        segments[i] = '*';
      }
    }

    return segments.join('') === globSegments.join('');
  }


  // Implicit root state that is always active
  root = registerState({
    name: '',
    url: '^',
    views: null,
    'abstract': true
  });
  root.navigable = null;


  /**
   * @ngdoc function
   * @name ui.router.state.$stateProvider#decorator
   * @methodOf ui.router.state.$stateProvider
   *
   * @description
   * Allows you to extend (carefully) or override (at your own peril) the 
   * `stateBuilder` object used internally by `$stateProvider`. This can be used 
   * to add custom functionality to ui-router, for example inferring templateUrl 
   * based on the state name.
   *
   * When passing only a name, it returns the current (original or decorated) builder
   * function that matches `name`.
   *
   * The builder functions that can be decorated are listed below. Though not all
   * necessarily have a good use case for decoration, that is up to you to decide.
   *
   * In addition, users can attach custom decorators, which will generate new 
   * properties within the state's internal definition. There is currently no clear 
   * use-case for this beyond accessing internal states (i.e. $state.$current), 
   * however, expect this to become increasingly relevant as we introduce additional 
   * meta-programming features.
   *
   * **Warning**: Decorators should not be interdependent because the order of 
   * execution of the builder functions in non-deterministic. Builder functions 
   * should only be dependent on the state definition object and super function.
   *
   *
   * Existing builder functions and current return values:
   *
   * - **parent** `{object}` - returns the parent state object.
   * - **data** `{object}` - returns state data, including any inherited data that is not
   *   overridden by own values (if any).
   * - **url** `{object}` - returns a {link ui.router.util.type:UrlMatcher} or null.
   * - **navigable** `{object}` - returns closest ancestor state that has a URL (aka is 
   *   navigable).
   * - **params** `{object}` - returns an array of state params that are ensured to 
   *   be a super-set of parent's params.
   * - **views** `{object}` - returns a views object where each key is an absolute view 
   *   name (i.e. "viewName@stateName") and each value is the config object 
   *   (template, controller) for the view. Even when you don't use the views object 
   *   explicitly on a state config, one is still created for you internally.
   *   So by decorating this builder function you have access to decorating template 
   *   and controller properties.
   * - **ownParams** `{object}` - returns an array of params that belong to the state, 
   *   not including any params defined by ancestor states.
   * - **path** `{string}` - returns the full path from the root down to this state. 
   *   Needed for state activation.
   * - **includes** `{object}` - returns an object that includes every state that 
   *   would pass a '$state.includes()' test.
   *
   * @example
   * <pre>
   * // Override the internal 'views' builder with a function that takes the state
   * // definition, and a reference to the internal function being overridden:
   * $stateProvider.decorator('views', function ($state, parent) {
   *   var result = {},
   *       views = parent(state);
   *
   *   angular.forEach(view, function (config, name) {
   *     var autoName = (state.name + '.' + name).replace('.', '/');
   *     config.templateUrl = config.templateUrl || '/partials/' + autoName + '.html';
   *     result[name] = config;
   *   });
   *   return result;
   * });
   *
   * $stateProvider.state('home', {
   *   views: {
   *     'contact.list': { controller: 'ListController' },
   *     'contact.item': { controller: 'ItemController' }
   *   }
   * });
   *
   * // ...
   *
   * $state.go('home');
   * // Auto-populates list and item views with /partials/home/contact/list.html,
   * // and /partials/home/contact/item.html, respectively.
   * </pre>
   *
   * @param {string} name The name of the builder function to decorate. 
   * @param {object} func A function that is responsible for decorating the original 
   * builder function. The function receives two parameters:
   *
   *   - `{object}` - state - The state config object.
   *   - `{object}` - super - The original builder function.
   *
   * @return {object} $stateProvider - $stateProvider instance
   */
  this.decorator = decorator;
  function decorator(name, func) {
    /*jshint validthis: true */
    if (isString(name) && !isDefined(func)) {
      return stateBuilder[name];
    }
    if (!isFunction(func) || !isString(name)) {
      return this;
    }
    if (stateBuilder[name] && !stateBuilder.$delegates[name]) {
      stateBuilder.$delegates[name] = stateBuilder[name];
    }
    stateBuilder[name] = func;
    return this;
  }

  /**
   * @ngdoc function
   * @name ui.router.state.$stateProvider#state
   * @methodOf ui.router.state.$stateProvider
   *
   * @description
   * Registers a state configuration under a given state name. The stateConfig object
   * has the following acceptable properties.
   *
   * <a id='template'></a>
   *
   * - **`template`** - {string|function=} - html template as a string or a function that returns
   *   an html template as a string which should be used by the uiView directives. This property 
   *   takes precedence over templateUrl.
   *   
   *   If `template` is a function, it will be called with the following parameters:
   *
   *   - {array.&lt;object&gt;} - state parameters extracted from the current $location.path() by
   *     applying the current state
   *
   * <a id='templateUrl'></a>
   *
   * - **`templateUrl`** - {string|function=} - path or function that returns a path to an html 
   *   template that should be used by uiView.
   *   
   *   If `templateUrl` is a function, it will be called with the following parameters:
   *
   *   - {array.&lt;object&gt;} - state parameters extracted from the current $location.path() by 
   *     applying the current state
   *
   * <a id='templateProvider'></a>
   *
   * - **`templateProvider`** - {function=} - Provider function that returns HTML content
   *   string.
   *
   * <a id='controller'></a>
   *
   * - **`controller`** - {string|function=} -  Controller fn that should be associated with newly 
   *   related scope or the name of a registered controller if passed as a string.
   *
   * <a id='controllerProvider'></a>
   *
   * - **`controllerProvider`** - {function=} - Injectable provider function that returns
   *   the actual controller or string.
   *
   * <a id='controllerAs'></a>
   * 
   * - **`controllerAs`** – {string=} – A controller alias name. If present the controller will be 
   *   published to scope under the controllerAs name.
   *
   * <a id='resolve'></a>
   *
   * - **`resolve`** - {object.&lt;string, function&gt;=} - An optional map of dependencies which 
   *   should be injected into the controller. If any of these dependencies are promises, 
   *   the router will wait for them all to be resolved or one to be rejected before the 
   *   controller is instantiated. If all the promises are resolved successfully, the values 
   *   of the resolved promises are injected and $stateChangeSuccess event is fired. If any 
   *   of the promises are rejected the $stateChangeError event is fired. The map object is:
   *   
   *   - key - {string}: name of dependency to be injected into controller
   *   - factory - {string|function}: If string then it is alias for service. Otherwise if function, 
   *     it is injected and return value it treated as dependency. If result is a promise, it is 
   *     resolved before its value is injected into controller.
   *
   * <a id='url'></a>
   *
   * - **`url`** - {string=} - A url with optional parameters. When a state is navigated or
   *   transitioned to, the `$stateParams` service will be populated with any 
   *   parameters that were passed.
   *
   * <a id='params'></a>
   *
   * - **`params`** - {object=} - An array of parameter names or regular expressions. Only 
   *   use this within a state if you are not using url. Otherwise you can specify your
   *   parameters within the url. When a state is navigated or transitioned to, the 
   *   $stateParams service will be populated with any parameters that were passed.
   *
   * <a id='views'></a>
   *
   * - **`views`** - {object=} - Use the views property to set up multiple views or to target views
   *   manually/explicitly.
   *
   * <a id='abstract'></a>
   *
   * - **`abstract`** - {boolean=} - An abstract state will never be directly activated, 
   *   but can provide inherited properties to its common children states.
   *
   * <a id='onEnter'></a>
   *
   * - **`onEnter`** - {object=} - Callback function for when a state is entered. Good way
   *   to trigger an action or dispatch an event, such as opening a dialog.
   *
   * <a id='onExit'></a>
   *
   * - **`onExit`** - {object=} - Callback function for when a state is exited. Good way to
   *   trigger an action or dispatch an event, such as opening a dialog.
   *
   * <a id='reloadOnSearch'></a>
   *
   * - **`reloadOnSearch = true`** - {boolean=} - If `false`, will not retrigger the same state 
   *   just because a search/query parameter has changed (via $location.search() or $location.hash()). 
   *   Useful for when you'd like to modify $location.search() without triggering a reload.
   *
   * <a id='data'></a>
   *
   * - **`data`** - {object=} - Arbitrary data object, useful for custom configuration.
   *
   * @example
   * <pre>
   * // Some state name examples
   *
   * // stateName can be a single top-level name (must be unique).
   * $stateProvider.state("home", {});
   *
   * // Or it can be a nested state name. This state is a child of the 
   * // above "home" state.
   * $stateProvider.state("home.newest", {});
   *
   * // Nest states as deeply as needed.
   * $stateProvider.state("home.newest.abc.xyz.inception", {});
   *
   * // state() returns $stateProvider, so you can chain state declarations.
   * $stateProvider
   *   .state("home", {})
   *   .state("about", {})
   *   .state("contacts", {});
   * </pre>
   *
   * @param {string} name A unique state name, e.g. "home", "about", "contacts". 
   * To create a parent/child state use a dot, e.g. "about.sales", "home.newest".
   * @param {object} definition State configuration object.
   */
  this.state = state;
  function state(name, definition) {
    /*jshint validthis: true */
    if (isObject(name)) definition = name;
    else definition.name = name;
    registerState(definition);
    return this;
  }

  /**
   * @ngdoc object
   * @name ui.router.state.$state
   *
   * @requires $rootScope
   * @requires $q
   * @requires ui.router.state.$view
   * @requires $injector
   * @requires ui.router.util.$resolve
   * @requires ui.router.state.$stateParams
   *
   * @property {object} params A param object, e.g. {sectionId: section.id)}, that 
   * you'd like to test against the current active state.
   * @property {object} current A reference to the state's config object. However 
   * you passed it in. Useful for accessing custom data.
   * @property {object} transition Currently pending transition. A promise that'll 
   * resolve or reject.
   *
   * @description
   * `$state` service is responsible for representing states as well as transitioning
   * between them. It also provides interfaces to ask for current state or even states
   * you're coming from.
   */
  // $urlRouter is injected just to ensure it gets instantiated
  this.$get = $get;
  $get.$inject = ['$rootScope', '$q', '$view', '$injector', '$resolve', '$stateParams', '$location', '$urlRouter', '$browser'];
  function $get(   $rootScope,   $q,   $view,   $injector,   $resolve,   $stateParams,   $location,   $urlRouter,   $browser) {

    var TransitionSuperseded = $q.reject(new Error('transition superseded'));
    var TransitionPrevented = $q.reject(new Error('transition prevented'));
    var TransitionAborted = $q.reject(new Error('transition aborted'));
    var TransitionFailed = $q.reject(new Error('transition failed'));
    var currentLocation = $location.url();
    var baseHref = $browser.baseHref();

    function syncUrl() {
      if ($location.url() !== currentLocation) {
        $location.url(currentLocation);
        $location.replace();
      }
    }

    root.locals = { resolve: null, globals: { $stateParams: {} } };
    $state = {
      params: {},
      current: root.self,
      $current: root,
      transition: null
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#reload
     * @methodOf ui.router.state.$state
     *
     * @description
     * A method that force reloads the current state. All resolves are re-resolved, events are not re-fired, 
     * and controllers reinstantiated (bug with controllers reinstantiating right now, fixing soon).
     *
     * @example
     * <pre>
     * var app angular.module('app', ['ui.router']);
     *
     * app.controller('ctrl', function ($scope, $state) {
     *   $scope.reload = function(){
     *     $state.reload();
     *   }
     * });
     * </pre>
     *
     * `reload()` is just an alias for:
     * <pre>
     * $state.transitionTo($state.current, $stateParams, { 
     *   reload: true, inherit: false, notify: false 
     * });
     * </pre>
     */
    $state.reload = function reload() {
      $state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: false });
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#go
     * @methodOf ui.router.state.$state
     *
     * @description
     * Convenience method for transitioning to a new state. `$state.go` calls 
     * `$state.transitionTo` internally but automatically sets options to 
     * `{ location: true, inherit: true, relative: $state.$current, notify: true }`. 
     * This allows you to easily use an absolute or relative to path and specify 
     * only the parameters you'd like to update (while letting unspecified parameters 
     * inherit from the currently active ancestor states).
     *
     * @example
     * <pre>
     * var app = angular.module('app', ['ui.router']);
     *
     * app.controller('ctrl', function ($scope, $state) {
     *   $scope.changeState = function () {
     *     $state.go('contact.detail');
     *   };
     * });
     * </pre>
     * <img src='../ngdoc_assets/StateGoExamples.png'/>
     *
     * @param {string} to Absolute state name or relative state path. Some examples:
     *
     * - `$state.go('contact.detail')` - will go to the `contact.detail` state
     * - `$state.go('^')` - will go to a parent state
     * - `$state.go('^.sibling')` - will go to a sibling state
     * - `$state.go('.child.grandchild')` - will go to grandchild state
     *
     * @param {object=} params A map of the parameters that will be sent to the state, 
     * will populate $stateParams. Any parameters that are not specified will be inherited from currently 
     * defined parameters. This allows, for example, going to a sibling state that shares parameters
     * specified in a parent state. Parameter inheritance only works between common ancestor states, I.e.
     * transitioning to a sibling will get you the parameters for all parents, transitioning to a child
     * will get you all current parameters, etc.
     * @param {object=} options Options object. The options are:
     *
     * - **`location`** - {boolean=true|string=} - If `true` will update the url in the location bar, if `false`
     *    will not. If string, must be `"replace"`, which will update url and also replace last history record.
     * - **`inherit`** - {boolean=true}, If `true` will inherit url parameters from current url.
     * - **`relative`** - {object=$state.$current}, When transitioning with relative path (e.g '^'), 
     *    defines which state to be relative from.
     * - **`notify`** - {boolean=true}, If `true` will broadcast $stateChangeStart and $stateChangeSuccess events.
     * - **`reload`** (v0.2.5) - {boolean=false}, If `true` will force transition even if the state or params 
     *    have not changed, aka a reload of the same state. It differs from reloadOnSearch because you'd
     *    use this when you want to force a reload when *everything* is the same, including search params.
     *
     * @returns {promise} A promise representing the state of the new transition.
     *
     * Possible success values:
     *
     * - $state.current
     *
     * <br/>Possible rejection values:
     *
     * - 'transition superseded' - when a newer transition has been started after this one
     * - 'transition prevented' - when `event.preventDefault()` has been called in a `$stateChangeStart` listener
     * - 'transition aborted' - when `event.preventDefault()` has been called in a `$stateNotFound` listener or
     *   when a `$stateNotFound` `event.retry` promise errors.
     * - 'transition failed' - when a state has been unsuccessfully found after 2 tries.
     * - *resolve error* - when an error has occurred with a `resolve`
     *
     */
    $state.go = function go(to, params, options) {
      return this.transitionTo(to, params, extend({ inherit: true, relative: $state.$current }, options));
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#transitionTo
     * @methodOf ui.router.state.$state
     *
     * @description
     * Low-level method for transitioning to a new state. {@link ui.router.state.$state#methods_go $state.go}
     * uses `transitionTo` internally. `$state.go` is recommended in most situations.
     *
     * @example
     * <pre>
     * var app = angular.module('app', ['ui.router']);
     *
     * app.controller('ctrl', function ($scope, $state) {
     *   $scope.changeState = function () {
     *     $state.transitionTo('contact.detail');
     *   };
     * });
     * </pre>
     *
     * @param {string} to State name.
     * @param {object=} toParams A map of the parameters that will be sent to the state,
     * will populate $stateParams.
     * @param {object=} options Options object. The options are:
     *
     * - **`location`** - {boolean=true|string=} - If `true` will update the url in the location bar, if `false`
     *    will not. If string, must be `"replace"`, which will update url and also replace last history record.
     * - **`inherit`** - {boolean=false}, If `true` will inherit url parameters from current url.
     * - **`relative`** - {object=}, When transitioning with relative path (e.g '^'), 
     *    defines which state to be relative from.
     * - **`notify`** - {boolean=true}, If `true` will broadcast $stateChangeStart and $stateChangeSuccess events.
     * - **`reload`** (v0.2.5) - {boolean=false}, If `true` will force transition even if the state or params 
     *    have not changed, aka a reload of the same state. It differs from reloadOnSearch because you'd
     *    use this when you want to force a reload when *everything* is the same, including search params.
     *
     * @returns {promise} A promise representing the state of the new transition. See
     * {@link ui.router.state.$state#methods_go $state.go}.
     */
    $state.transitionTo = function transitionTo(to, toParams, options) {
      toParams = toParams || {};
      options = extend({
        location: true, inherit: false, relative: null, notify: true, reload: false, $retry: false
      }, options || {});

      var from = $state.$current, fromParams = $state.params, fromPath = from.path;
      var evt, toState = findState(to, options.relative);

      if (!isDefined(toState)) {
        // Broadcast not found event and abort the transition if prevented
        var redirect = { to: to, toParams: toParams, options: options };

        /**
         * @ngdoc event
         * @name ui.router.state.$state#$stateNotFound
         * @eventOf ui.router.state.$state
         * @eventType broadcast on root scope
         * @description
         * Fired when a requested state **cannot be found** using the provided state name during transition.
         * The event is broadcast allowing any handlers a single chance to deal with the error (usually by
         * lazy-loading the unfound state). A special `unfoundState` object is passed to the listener handler,
         * you can see its three properties in the example. You can use `event.preventDefault()` to abort the
         * transition and the promise returned from `go` will be rejected with a `'transition aborted'` value.
         *
         * @param {Object} event Event object.
         * @param {Object} unfoundState Unfound State information. Contains: `to, toParams, options` properties.
         * @param {State} fromState Current state object.
         * @param {Object} fromParams Current state params.
         *
         * @example
         *
         * <pre>
         * // somewhere, assume lazy.state has not been defined
         * $state.go("lazy.state", {a:1, b:2}, {inherit:false});
         *
         * // somewhere else
         * $scope.$on('$stateNotFound',
         * function(event, unfoundState, fromState, fromParams){
         *     console.log(unfoundState.to); // "lazy.state"
         *     console.log(unfoundState.toParams); // {a:1, b:2}
         *     console.log(unfoundState.options); // {inherit:false} + default options
         * })
         * </pre>
         */
        evt = $rootScope.$broadcast('$stateNotFound', redirect, from.self, fromParams);
        if (evt.defaultPrevented) {
          syncUrl();
          return TransitionAborted;
        }

        // Allow the handler to return a promise to defer state lookup retry
        if (evt.retry) {
          if (options.$retry) {
            syncUrl();
            return TransitionFailed;
          }
          var retryTransition = $state.transition = $q.when(evt.retry);
          retryTransition.then(function() {
            if (retryTransition !== $state.transition) return TransitionSuperseded;
            redirect.options.$retry = true;
            return $state.transitionTo(redirect.to, redirect.toParams, redirect.options);
          }, function() {
            return TransitionAborted;
          });
          syncUrl();
          return retryTransition;
        }

        // Always retry once if the $stateNotFound was not prevented
        // (handles either redirect changed or state lazy-definition)
        to = redirect.to;
        toParams = redirect.toParams;
        options = redirect.options;
        toState = findState(to, options.relative);
        if (!isDefined(toState)) {
          if (options.relative) throw new Error("Could not resolve '" + to + "' from state '" + options.relative + "'");
          throw new Error("No such state '" + to + "'");
        }
      }
      if (toState[abstractKey]) throw new Error("Cannot transition to abstract state '" + to + "'");
      if (options.inherit) toParams = inheritParams($stateParams, toParams || {}, $state.$current, toState);
      to = toState;

      var toPath = to.path;

      // Starting from the root of the path, keep all levels that haven't changed
      var keep, state, locals = root.locals, toLocals = [];
      for (keep = 0, state = toPath[keep];
           state && state === fromPath[keep] && equalForKeys(toParams, fromParams, state.ownParams) && !options.reload;
           keep++, state = toPath[keep]) {
        locals = toLocals[keep] = state.locals;
      }

      // If we're going to the same state and all locals are kept, we've got nothing to do.
      // But clear 'transition', as we still want to cancel any other pending transitions.
      // TODO: We may not want to bump 'transition' if we're called from a location change that we've initiated ourselves,
      // because we might accidentally abort a legitimate transition initiated from code?
      if (shouldTriggerReload(to, from, locals, options) ) {
        if ( to.self.reloadOnSearch !== false )
          syncUrl();
        $state.transition = null;
        return $q.when($state.current);
      }

      // Normalize/filter parameters before we pass them to event handlers etc.
      toParams = normalize(to.params, toParams || {});

      // Broadcast start event and cancel the transition if requested
      if (options.notify) {
        /**
         * @ngdoc event
         * @name ui.router.state.$state#$stateChangeStart
         * @eventOf ui.router.state.$state
         * @eventType broadcast on root scope
         * @description
         * Fired when the state transition **begins**. You can use `event.preventDefault()`
         * to prevent the transition from happening and then the transition promise will be
         * rejected with a `'transition prevented'` value.
         *
         * @param {Object} event Event object.
         * @param {State} toState The state being transitioned to.
         * @param {Object} toParams The params supplied to the `toState`.
         * @param {State} fromState The current state, pre-transition.
         * @param {Object} fromParams The params supplied to the `fromState`.
         *
         * @example
         *
         * <pre>
         * $rootScope.$on('$stateChangeStart',
         * function(event, toState, toParams, fromState, fromParams){
         *     event.preventDefault();
         *     // transitionTo() promise will be rejected with
         *     // a 'transition prevented' error
         * })
         * </pre>
         */
        evt = $rootScope.$broadcast('$stateChangeStart', to.self, toParams, from.self, fromParams);
        if (evt.defaultPrevented) {
          syncUrl();
          return TransitionPrevented;
        }
      }

      // Resolve locals for the remaining states, but don't update any global state just
      // yet -- if anything fails to resolve the current state needs to remain untouched.
      // We also set up an inheritance chain for the locals here. This allows the view directive
      // to quickly look up the correct definition for each view in the current state. Even
      // though we create the locals object itself outside resolveState(), it is initially
      // empty and gets filled asynchronously. We need to keep track of the promise for the
      // (fully resolved) current locals, and pass this down the chain.
      var resolved = $q.when(locals);
      for (var l=keep; l<toPath.length; l++, state=toPath[l]) {
        locals = toLocals[l] = inherit(locals);
        resolved = resolveState(state, toParams, state===to, resolved, locals);
      }

      // Once everything is resolved, we are ready to perform the actual transition
      // and return a promise for the new state. We also keep track of what the
      // current promise is, so that we can detect overlapping transitions and
      // keep only the outcome of the last transition.
      var transition = $state.transition = resolved.then(function () {
        var l, entering, exiting;

        if ($state.transition !== transition) return TransitionSuperseded;

        // Exit 'from' states not kept
        for (l=fromPath.length-1; l>=keep; l--) {
          exiting = fromPath[l];
          if (exiting.self.onExit) {
            $injector.invoke(exiting.self.onExit, exiting.self, exiting.locals.globals);
          }
          exiting.locals = null;
        }

        // Enter 'to' states not kept
        for (l=keep; l<toPath.length; l++) {
          entering = toPath[l];
          entering.locals = toLocals[l];
          if (entering.self.onEnter) {
            $injector.invoke(entering.self.onEnter, entering.self, entering.locals.globals);
          }
        }

        // Run it again, to catch any transitions in callbacks
        if ($state.transition !== transition) return TransitionSuperseded;

        // Update globals in $state
        $state.$current = to;
        $state.current = to.self;
        $state.params = toParams;
        copy($state.params, $stateParams);
        $state.transition = null;

        // Update $location
        var toNav = to.navigable;
        if (options.location && toNav) {
          $location.url(toNav.url.format(toNav.locals.globals.$stateParams));

          if (options.location === 'replace') {
            $location.replace();
          }
        }

        if (options.notify) {
        /**
         * @ngdoc event
         * @name ui.router.state.$state#$stateChangeSuccess
         * @eventOf ui.router.state.$state
         * @eventType broadcast on root scope
         * @description
         * Fired once the state transition is **complete**.
         *
         * @param {Object} event Event object.
         * @param {State} toState The state being transitioned to.
         * @param {Object} toParams The params supplied to the `toState`.
         * @param {State} fromState The current state, pre-transition.
         * @param {Object} fromParams The params supplied to the `fromState`.
         */
          $rootScope.$broadcast('$stateChangeSuccess', to.self, toParams, from.self, fromParams);
        }
        currentLocation = $location.url();

        return $state.current;
      }, function (error) {
        if ($state.transition !== transition) return TransitionSuperseded;

        $state.transition = null;
        /**
         * @ngdoc event
         * @name ui.router.state.$state#$stateChangeError
         * @eventOf ui.router.state.$state
         * @eventType broadcast on root scope
         * @description
         * Fired when an **error occurs** during transition. It's important to note that if you
         * have any errors in your resolve functions (javascript errors, non-existent services, etc)
         * they will not throw traditionally. You must listen for this $stateChangeError event to
         * catch **ALL** errors.
         *
         * @param {Object} event Event object.
         * @param {State} toState The state being transitioned to.
         * @param {Object} toParams The params supplied to the `toState`.
         * @param {State} fromState The current state, pre-transition.
         * @param {Object} fromParams The params supplied to the `fromState`.
         * @param {Error} error The resolve error object.
         */
        $rootScope.$broadcast('$stateChangeError', to.self, toParams, from.self, fromParams, error);
        syncUrl();

        return $q.reject(error);
      });

      return transition;
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#is
     * @methodOf ui.router.state.$state
     *
     * @description
     * Similar to {@link ui.router.state.$state#methods_includes $state.includes},
     * but only checks for the full state name. If params is supplied then it will be 
     * tested for strict equality against the current active params object, so all params 
     * must match with none missing and no extras.
     *
     * @example
     * <pre>
     * $state.is('contact.details.item'); // returns true
     * $state.is(contactDetailItemStateObject); // returns true
     *
     * // everything else would return false
     * </pre>
     *
     * @param {string|object} stateName The state name or state object you'd like to check.
     * @param {object=} params A param object, e.g. `{sectionId: section.id}`, that you'd like 
     * to test against the current active state.
     * @returns {boolean} Returns true if it is the state.
     */
    $state.is = function is(stateOrName, params) {
      var state = findState(stateOrName);

      if (!isDefined(state)) {
        return undefined;
      }

      if ($state.$current !== state) {
        return false;
      }

      return isDefined(params) && params !== null ? angular.equals($stateParams, params) : true;
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#includes
     * @methodOf ui.router.state.$state
     *
     * @description
     * A method to determine if the current active state is equal to or is the child of the 
     * state stateName. If any params are passed then they will be tested for a match as well.
     * Not all the parameters need to be passed, just the ones you'd like to test for equality.
     *
     * @example
     * <pre>
     * $state.$current.name = 'contacts.details.item';
     *
     * $state.includes("contacts"); // returns true
     * $state.includes("contacts.details"); // returns true
     * $state.includes("contacts.details.item"); // returns true
     * $state.includes("contacts.list"); // returns false
     * $state.includes("about"); // returns false
     * </pre>
     *
     * @description
     * Basic globing patterns will also work.
     *
     * @example
     * <pre>
     * $state.$current.name = 'contacts.details.item.url';
     *
     * $state.includes("*.details.*.*"); // returns true
     * $state.includes("*.details.**"); // returns true
     * $state.includes("**.item.**"); // returns true
     * $state.includes("*.details.item.url"); // returns true
     * $state.includes("*.details.*.url"); // returns true
     * $state.includes("*.details.*"); // returns false
     * $state.includes("item.**"); // returns false
     * </pre>
     *
     * @param {string} stateOrName A partial name to be searched for within the current state name.
     * @param {object} params A param object, e.g. `{sectionId: section.id}`, 
     * that you'd like to test against the current active state.
     * @returns {boolean} Returns true if it does include the state
     */

    $state.includes = function includes(stateOrName, params) {
      if (isString(stateOrName) && isGlob(stateOrName)) {
        if (doesStateMatchGlob(stateOrName)) {
          stateOrName = $state.$current.name;
        } else {
          return false;
        }
      }

      var state = findState(stateOrName);
      if (!isDefined(state)) {
        return undefined;
      }

      if (!isDefined($state.$current.includes[state.name])) {
        return false;
      }

      var validParams = true;
      angular.forEach(params, function(value, key) {
        if (!isDefined($stateParams[key]) || $stateParams[key] !== value) {
          validParams = false;
        }
      });
      return validParams;
    };


    /**
     * @ngdoc function
     * @name ui.router.state.$state#href
     * @methodOf ui.router.state.$state
     *
     * @description
     * A url generation method that returns the compiled url for the given state populated with the given params.
     *
     * @example
     * <pre>
     * expect($state.href("about.person", { person: "bob" })).toEqual("/about/bob");
     * </pre>
     *
     * @param {string|object} stateOrName The state name or state object you'd like to generate a url from.
     * @param {object=} params An object of parameter values to fill the state's required parameters.
     * @param {object=} options Options object. The options are:
     *
     * - **`lossy`** - {boolean=true} -  If true, and if there is no url associated with the state provided in the
     *    first parameter, then the constructed href url will be built from the first navigable ancestor (aka
     *    ancestor with a valid url).
     * - **`inherit`** - {boolean=false}, If `true` will inherit url parameters from current url.
     * - **`relative`** - {object=$state.$current}, When transitioning with relative path (e.g '^'), 
     *    defines which state to be relative from.
     * - **`absolute`** - {boolean=false},  If true will generate an absolute url, e.g. "http://www.example.com/fullurl".
     * 
     * @returns {string} compiled state url
     */
    $state.href = function href(stateOrName, params, options) {
      options = extend({ lossy: true, inherit: false, absolute: false, relative: $state.$current }, options || {});
      var state = findState(stateOrName, options.relative);
      if (!isDefined(state)) return null;

      params = inheritParams($stateParams, params || {}, $state.$current, state);
      var nav = (state && options.lossy) ? state.navigable : state;
      var url = (nav && nav.url) ? nav.url.format(normalize(state.params, params || {})) : null;
      if (!$locationProvider.html5Mode() && url) {
        url = "#" + $locationProvider.hashPrefix() + url;
      }

      if (baseHref !== '/') {
        if ($locationProvider.html5Mode()) {
          url = baseHref.slice(0, -1) + url;
        } else if (options.absolute){
          url = baseHref.slice(1) + url;
        }
      }

      if (options.absolute && url) {
        url = $location.protocol() + '://' + 
              $location.host() + 
              ($location.port() == 80 || $location.port() == 443 ? '' : ':' + $location.port()) + 
              (!$locationProvider.html5Mode() && url ? '/' : '') + 
              url;
      }
      return url;
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#get
     * @methodOf ui.router.state.$state
     *
     * @description
     * Returns the state configuration object for any specific state or all states.
     *
     * @param {string|object=} stateOrName If provided, will only get the config for
     * the requested state. If not provided, returns an array of ALL state configs.
     * @returns {object|array} State configuration object or array of all objects.
     */
    $state.get = function (stateOrName, context) {
      if (!isDefined(stateOrName)) {
        var list = [];
        forEach(states, function(state) { list.push(state.self); });
        return list;
      }
      var state = findState(stateOrName, context);
      return (state && state.self) ? state.self : null;
    };

    function resolveState(state, params, paramsAreFiltered, inherited, dst) {
      // Make a restricted $stateParams with only the parameters that apply to this state if
      // necessary. In addition to being available to the controller and onEnter/onExit callbacks,
      // we also need $stateParams to be available for any $injector calls we make during the
      // dependency resolution process.
      var $stateParams = (paramsAreFiltered) ? params : filterByKeys(state.params, params);
      var locals = { $stateParams: $stateParams };

      // Resolve 'global' dependencies for the state, i.e. those not specific to a view.
      // We're also including $stateParams in this; that way the parameters are restricted
      // to the set that should be visible to the state, and are independent of when we update
      // the global $state and $stateParams values.
      dst.resolve = $resolve.resolve(state.resolve, locals, dst.resolve, state);
      var promises = [ dst.resolve.then(function (globals) {
        dst.globals = globals;
      }) ];
      if (inherited) promises.push(inherited);

      // Resolve template and dependencies for all views.
      forEach(state.views, function (view, name) {
        var injectables = (view.resolve && view.resolve !== state.resolve ? view.resolve : {});
        injectables.$template = [ function () {
          return $view.load(name, { view: view, locals: locals, params: $stateParams, notify: false }) || '';
        }];

        promises.push($resolve.resolve(injectables, locals, dst.resolve, state).then(function (result) {
          // References to the controller (only instantiated at link time)
          if (isFunction(view.controllerProvider) || isArray(view.controllerProvider)) {
            var injectLocals = angular.extend({}, injectables, locals);
            result.$$controller = $injector.invoke(view.controllerProvider, null, injectLocals);
          } else {
            result.$$controller = view.controller;
          }
          // Provide access to the state itself for internal use
          result.$$state = state;
          result.$$controllerAs = view.controllerAs;
          dst[name] = result;
        }));
      });

      // Wait for all the promises and then return the activation object
      return $q.all(promises).then(function (values) {
        return dst;
      });
    }

    return $state;
  }

  function shouldTriggerReload(to, from, locals, options) {
    if ( to === from && ((locals === from.locals && !options.reload) || (to.self.reloadOnSearch === false)) ) {
      return true;
    }
  }
}

angular.module('ui.router.state')
  .value('$stateParams', {})
  .provider('$state', $StateProvider);


$ViewProvider.$inject = [];
function $ViewProvider() {

  this.$get = $get;
  /**
   * @ngdoc object
   * @name ui.router.state.$view
   *
   * @requires ui.router.util.$templateFactory
   * @requires $rootScope
   *
   * @description
   *
   */
  $get.$inject = ['$rootScope', '$templateFactory'];
  function $get(   $rootScope,   $templateFactory) {
    return {
      // $view.load('full.viewName', { template: ..., controller: ..., resolve: ..., async: false, params: ... })
      /**
       * @ngdoc function
       * @name ui.router.state.$view#load
       * @methodOf ui.router.state.$view
       *
       * @description
       *
       * @param {string} name name
       * @param {object} options option object.
       */
      load: function load(name, options) {
        var result, defaults = {
          template: null, controller: null, view: null, locals: null, notify: true, async: true, params: {}
        };
        options = extend(defaults, options);

        if (options.view) {
          result = $templateFactory.fromConfig(options.view, options.params, options.locals);
        }
        if (result && options.notify) {
        /**
         * @ngdoc event
         * @name ui.router.state.$state#$viewContentLoading
         * @eventOf ui.router.state.$view
         * @eventType broadcast on root scope
         * @description
         *
         * Fired once the view **begins loading**, *before* the DOM is rendered.
         *
         * @param {Object} event Event object.
         * @param {Object} viewConfig The view config properties (template, controller, etc).
         *
         * @example
         *
         * <pre>
         * $scope.$on('$viewContentLoading',
         * function(event, viewConfig){
         *     // Access to all the view config properties.
         *     // and one special property 'targetView'
         *     // viewConfig.targetView
         * });
         * </pre>
         */
          $rootScope.$broadcast('$viewContentLoading', options);
        }
        return result;
      }
    };
  }
}

angular.module('ui.router.state').provider('$view', $ViewProvider);

/**
 * @ngdoc object
 * @name ui.router.state.$uiViewScrollProvider
 *
 * @description
 * Provider that returns the {@link ui.router.state.$uiViewScroll} service function.
 */
function $ViewScrollProvider() {

  var useAnchorScroll = false;

  /**
   * @ngdoc function
   * @name ui.router.state.$uiViewScrollProvider#useAnchorScroll
   * @methodOf ui.router.state.$uiViewScrollProvider
   *
   * @description
   * Reverts back to using the core [`$anchorScroll`](http://docs.angularjs.org/api/ng.$anchorScroll) service for
   * scrolling based on the url anchor.
   */
  this.useAnchorScroll = function () {
    useAnchorScroll = true;
  };

  /**
   * @ngdoc object
   * @name ui.router.state.$uiViewScroll
   *
   * @requires $anchorScroll
   * @requires $timeout
   *
   * @description
   * When called with a jqLite element, it scrolls the element into view (after a
   * `$timeout` so the DOM has time to refresh).
   *
   * If you prefer to rely on `$anchorScroll` to scroll the view to the anchor,
   * this can be enabled by calling {@link ui.router.state.$uiViewScrollProvider#methods_useAnchorScroll `$uiViewScrollProvider.useAnchorScroll()`}.
   */
  this.$get = ['$anchorScroll', '$timeout', function ($anchorScroll, $timeout) {
    if (useAnchorScroll) {
      return $anchorScroll;
    }

    return function ($element) {
      $timeout(function () {
        $element[0].scrollIntoView();
      }, 0, false);
    };
  }];
}

angular.module('ui.router.state').provider('$uiViewScroll', $ViewScrollProvider);

/**
 * @ngdoc directive
 * @name ui.router.state.directive:ui-view
 *
 * @requires ui.router.state.$state
 * @requires $compile
 * @requires $controller
 * @requires $injector
 * @requires ui.router.state.$uiViewScroll
 * @requires $document
 *
 * @restrict ECA
 *
 * @description
 * The ui-view directive tells $state where to place your templates.
 *
 * @param {string=} ui-view A view name. The name should be unique amongst the other views in the
 * same state. You can have views of the same name that live in different states.
 *
 * @param {string=} autoscroll It allows you to set the scroll behavior of the browser window
 * when a view is populated. By default, $anchorScroll is overridden by ui-router's custom scroll
 * service, {@link ui.router.state.$uiViewScroll}. This custom service let's you
 * scroll ui-view elements into view when they are populated during a state activation.
 *
 * *Note: To revert back to old [`$anchorScroll`](http://docs.angularjs.org/api/ng.$anchorScroll)
 * functionality, call `$uiViewScrollProvider.useAnchorScroll()`.*
 *
 * @param {string=} onload Expression to evaluate whenever the view updates.
 * 
 * @example
 * A view can be unnamed or named. 
 * <pre>
 * <!-- Unnamed -->
 * <div ui-view></div> 
 * 
 * <!-- Named -->
 * <div ui-view="viewName"></div>
 * </pre>
 *
 * You can only have one unnamed view within any template (or root html). If you are only using a 
 * single view and it is unnamed then you can populate it like so:
 * <pre>
 * <div ui-view></div> 
 * $stateProvider.state("home", {
 *   template: "<h1>HELLO!</h1>"
 * })
 * </pre>
 * 
 * The above is a convenient shortcut equivalent to specifying your view explicitly with the {@link ui.router.state.$stateProvider#views `views`}
 * config property, by name, in this case an empty name:
 * <pre>
 * $stateProvider.state("home", {
 *   views: {
 *     "": {
 *       template: "<h1>HELLO!</h1>"
 *     }
 *   }    
 * })
 * </pre>
 * 
 * But typically you'll only use the views property if you name your view or have more than one view 
 * in the same template. There's not really a compelling reason to name a view if its the only one, 
 * but you could if you wanted, like so:
 * <pre>
 * <div ui-view="main"></div>
 * </pre> 
 * <pre>
 * $stateProvider.state("home", {
 *   views: {
 *     "main": {
 *       template: "<h1>HELLO!</h1>"
 *     }
 *   }    
 * })
 * </pre>
 * 
 * Really though, you'll use views to set up multiple views:
 * <pre>
 * <div ui-view></div>
 * <div ui-view="chart"></div> 
 * <div ui-view="data"></div> 
 * </pre>
 * 
 * <pre>
 * $stateProvider.state("home", {
 *   views: {
 *     "": {
 *       template: "<h1>HELLO!</h1>"
 *     },
 *     "chart": {
 *       template: "<chart_thing/>"
 *     },
 *     "data": {
 *       template: "<data_thing/>"
 *     }
 *   }    
 * })
 * </pre>
 *
 * Examples for `autoscroll`:
 *
 * <pre>
 * <!-- If autoscroll present with no expression,
 *      then scroll ui-view into view -->
 * <ui-view autoscroll/>
 *
 * <!-- If autoscroll present with valid expression,
 *      then scroll ui-view into view if expression evaluates to true -->
 * <ui-view autoscroll='true'/>
 * <ui-view autoscroll='false'/>
 * <ui-view autoscroll='scopeVariable'/>
 * </pre>
 */
$ViewDirective.$inject = ['$state', '$injector', '$uiViewScroll'];
function $ViewDirective(   $state,   $injector,   $uiViewScroll) {

  function getService() {
    return ($injector.has) ? function(service) {
      return $injector.has(service) ? $injector.get(service) : null;
    } : function(service) {
      try {
        return $injector.get(service);
      } catch (e) {
        return null;
      }
    };
  }

  var service = getService(),
      $animator = service('$animator'),
      $animate = service('$animate');

  // Returns a set of DOM manipulation functions based on which Angular version
  // it should use
  function getRenderer(attrs, scope) {
    var statics = function() {
      return {
        enter: function (element, target, cb) { target.after(element); cb(); },
        leave: function (element, cb) { element.remove(); cb(); }
      };
    };

    if ($animate) {
      return {
        enter: function(element, target, cb) { $animate.enter(element, null, target, cb); },
        leave: function(element, cb) { $animate.leave(element, cb); }
      };
    }

    if ($animator) {
      var animate = $animator && $animator(scope, attrs);

      return {
        enter: function(element, target, cb) {animate.enter(element, null, target); cb(); },
        leave: function(element, cb) { animate.leave(element); cb(); }
      };
    }

    return statics();
  }

  var directive = {
    restrict: 'ECA',
    terminal: true,
    priority: 400,
    transclude: 'element',
    compile: function (tElement, tAttrs, $transclude) {
      return function (scope, $element, attrs) {
        var previousEl, currentEl, currentScope, latestLocals,
            onloadExp     = attrs.onload || '',
            autoScrollExp = attrs.autoscroll,
            renderer      = getRenderer(attrs, scope);

        scope.$on('$stateChangeSuccess', function() {
          updateView(false);
        });
        scope.$on('$viewContentLoading', function() {
          updateView(false);
        });

        updateView(true);

        function cleanupLastView() {
          if (previousEl) {
            previousEl.remove();
            previousEl = null;
          }

          if (currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }

          if (currentEl) {
            renderer.leave(currentEl, function() {
              previousEl = null;
            });

            previousEl = currentEl;
            currentEl = null;
          }
        }

        function updateView(firstTime) {
          var newScope        = scope.$new(),
              name            = currentEl && currentEl.data('$uiViewName'),
              previousLocals  = name && $state.$current && $state.$current.locals[name];

          if (!firstTime && previousLocals === latestLocals) return; // nothing to do

          var clone = $transclude(newScope, function(clone) {
            renderer.enter(clone, $element, function onUiViewEnter() {
              if (angular.isDefined(autoScrollExp) && !autoScrollExp || scope.$eval(autoScrollExp)) {
                $uiViewScroll(clone);
              }
            });
            cleanupLastView();
          });

          latestLocals = $state.$current.locals[clone.data('$uiViewName')];

          currentEl = clone;
          currentScope = newScope;
          /**
           * @ngdoc event
           * @name ui.router.state.directive:ui-view#$viewContentLoaded
           * @eventOf ui.router.state.directive:ui-view
           * @eventType emits on ui-view directive scope
           * @description           *
           * Fired once the view is **loaded**, *after* the DOM is rendered.
           *
           * @param {Object} event Event object.
           */
          currentScope.$emit('$viewContentLoaded');
          currentScope.$eval(onloadExp);
        }
      };
    }
  };

  return directive;
}

$ViewDirectiveFill.$inject = ['$compile', '$controller', '$state'];
function $ViewDirectiveFill ($compile, $controller, $state) {
  return {
    restrict: 'ECA',
    priority: -400,
    compile: function (tElement) {
      var initial = tElement.html();
      return function (scope, $element, attrs) {
        var name      = attrs.uiView || attrs.name || '',
            inherited = $element.inheritedData('$uiView');

        if (name.indexOf('@') < 0) {
          name = name + '@' + (inherited ? inherited.state.name : '');
        }

        $element.data('$uiViewName', name);

        var current = $state.$current,
            locals  = current && current.locals[name];

        if (! locals) {
          return;
        }

        $element.data('$uiView', { name: name, state: locals.$$state });
        $element.html(locals.$template ? locals.$template : initial);

        var link = $compile($element.contents());

        if (locals.$$controller) {
          locals.$scope = scope;
          var controller = $controller(locals.$$controller, locals);
          if (locals.$$controllerAs) {
            scope[locals.$$controllerAs] = controller;
          }
          $element.data('$ngControllerController', controller);
          $element.children().data('$ngControllerController', controller);
        }

        link(scope);
      };
    }
  };
}

angular.module('ui.router.state').directive('uiView', $ViewDirective);
angular.module('ui.router.state').directive('uiView', $ViewDirectiveFill);

function parseStateRef(ref) {
  var parsed = ref.replace(/\n/g, " ").match(/^([^(]+?)\s*(\((.*)\))?$/);
  if (!parsed || parsed.length !== 4) throw new Error("Invalid state ref '" + ref + "'");
  return { state: parsed[1], paramExpr: parsed[3] || null };
}

function stateContext(el) {
  var stateData = el.parent().inheritedData('$uiView');

  if (stateData && stateData.state && stateData.state.name) {
    return stateData.state;
  }
}

/**
 * @ngdoc directive
 * @name ui.router.state.directive:ui-sref
 *
 * @requires ui.router.state.$state
 * @requires $timeout
 *
 * @restrict A
 *
 * @description
 * A directive that binds a link (`<a>` tag) to a state. If the state has an associated 
 * URL, the directive will automatically generate & update the `href` attribute via 
 * the {@link ui.router.state.$state#methods_href $state.href()} method. Clicking 
 * the link will trigger a state transition with optional parameters. 
 *
 * Also middle-clicking, right-clicking, and ctrl-clicking on the link will be 
 * handled natively by the browser.
 *
 * You can also use relative state paths within ui-sref, just like the relative 
 * paths passed to `$state.go()`. You just need to be aware that the path is relative
 * to the state that the link lives in, in other words the state that loaded the 
 * template containing the link.
 *
 * You can specify options to pass to {@link ui.router.state.$state#go $state.go()}
 * using the `ui-sref-opts` attribute. Options are restricted to `location`, `inherit`,
 * and `reload`.
 *
 * @example
 * Here's an example of how you'd use ui-sref and how it would compile. If you have the 
 * following template:
 * <pre>
 * <a ui-sref="home">Home</a> | <a ui-sref="about">About</a>
 * 
 * <ul>
 *     <li ng-repeat="contact in contacts">
 *         <a ui-sref="contacts.detail({ id: contact.id })">{{ contact.name }}</a>
 *     </li>
 * </ul>
 * </pre>
 * 
 * Then the compiled html would be (assuming Html5Mode is off):
 * <pre>
 * <a href="#/home" ui-sref="home">Home</a> | <a href="#/about" ui-sref="about">About</a>
 * 
 * <ul>
 *     <li ng-repeat="contact in contacts">
 *         <a href="#/contacts/1" ui-sref="contacts.detail({ id: contact.id })">Joe</a>
 *     </li>
 *     <li ng-repeat="contact in contacts">
 *         <a href="#/contacts/2" ui-sref="contacts.detail({ id: contact.id })">Alice</a>
 *     </li>
 *     <li ng-repeat="contact in contacts">
 *         <a href="#/contacts/3" ui-sref="contacts.detail({ id: contact.id })">Bob</a>
 *     </li>
 * </ul>
 *
 * <a ui-sref="home" ui-sref-opts="{reload: true}">Home</a>
 * </pre>
 *
 * @param {string} ui-sref 'stateName' can be any valid absolute or relative state
 * @param {Object} ui-sref-opts options to pass to {@link ui.router.state.$state#go $state.go()}
 */
$StateRefDirective.$inject = ['$state', '$timeout'];
function $StateRefDirective($state, $timeout) {
  var allowedOptions = ['location', 'inherit', 'reload'];

  return {
    restrict: 'A',
    require: '?^uiSrefActive',
    link: function(scope, element, attrs, uiSrefActive) {
      var ref = parseStateRef(attrs.uiSref);
      var params = null, url = null, base = stateContext(element) || $state.$current;
      var isForm = element[0].nodeName === "FORM";
      var attr = isForm ? "action" : "href", nav = true;

      var options = {
        relative: base
      };
      var optionsOverride = scope.$eval(attrs.uiSrefOpts) || {};
      angular.forEach(allowedOptions, function(option) {
        if (option in optionsOverride) {
          options[option] = optionsOverride[option];
        }
      });

      var update = function(newVal) {
        if (newVal) params = newVal;
        if (!nav) return;

        var newHref = $state.href(ref.state, params, options);

        if (uiSrefActive) {
          uiSrefActive.$$setStateInfo(ref.state, params);
        }
        if (!newHref) {
          nav = false;
          return false;
        }
        element[0][attr] = newHref;
      };

      if (ref.paramExpr) {
        scope.$watch(ref.paramExpr, function(newVal, oldVal) {
          if (newVal !== params) update(newVal);
        }, true);
        params = scope.$eval(ref.paramExpr);
      }
      update();

      if (isForm) return;

      element.bind("click", function(e) {
        var button = e.which || e.button;
        if ( !(button > 1 || e.ctrlKey || e.metaKey || e.shiftKey || element.attr('target')) ) {
          // HACK: This is to allow ng-clicks to be processed before the transition is initiated:
          $timeout(function() {
            $state.go(ref.state, params, options);
          });
          e.preventDefault();
        }
      });
    }
  };
}

/**
 * @ngdoc directive
 * @name ui.router.state.directive:ui-sref-active
 *
 * @requires ui.router.state.$state
 * @requires ui.router.state.$stateParams
 * @requires $interpolate
 *
 * @restrict A
 *
 * @description
 * A directive working alongside ui-sref to add classes to an element when the 
 * related ui-sref directive's state is active, and removing them when it is inactive.
 * The primary use-case is to simplify the special appearance of navigation menus 
 * relying on `ui-sref`, by having the "active" state's menu button appear different,
 * distinguishing it from the inactive menu items.
 *
 * @example
 * Given the following template:
 * <pre>
 * <ul>
 *   <li ui-sref-active="active" class="item">
 *     <a href ui-sref="app.user({user: 'bilbobaggins'})">@bilbobaggins</a>
 *   </li>
 * </ul>
 * </pre>
 * 
 * When the app state is "app.user", and contains the state parameter "user" with value "bilbobaggins", 
 * the resulting HTML will appear as (note the 'active' class):
 * <pre>
 * <ul>
 *   <li ui-sref-active="active" class="item active">
 *     <a ui-sref="app.user({user: 'bilbobaggins'})" href="/users/bilbobaggins">@bilbobaggins</a>
 *   </li>
 * </ul>
 * </pre>
 * 
 * The class name is interpolated **once** during the directives link time (any further changes to the 
 * interpolated value are ignored). 
 * 
 * Multiple classes may be specified in a space-separated format:
 * <pre>
 * <ul>
 *   <li ui-sref-active='class1 class2 class3'>
 *     <a ui-sref="app.user">link</a>
 *   </li>
 * </ul>
 * </pre>
 */
$StateActiveDirective.$inject = ['$state', '$stateParams', '$interpolate'];
function $StateActiveDirective($state, $stateParams, $interpolate) {
  return {
    restrict: "A",
    controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
      var state, params, activeClass;

      // There probably isn't much point in $observing this
      activeClass = $interpolate($attrs.uiSrefActive || '', false)($scope);

      // Allow uiSref to communicate with uiSrefActive
      this.$$setStateInfo = function(newState, newParams) {
        state = $state.get(newState, stateContext($element));
        params = newParams;
        update();
      };

      $scope.$on('$stateChangeSuccess', update);

      // Update route state
      function update() {
        if ($state.$current.self === state && matchesParams()) {
          $element.addClass(activeClass);
        } else {
          $element.removeClass(activeClass);
        }
      }

      function matchesParams() {
        return !params || equalForKeys(params, $stateParams);
      }
    }]
  };
}

angular.module('ui.router.state')
  .directive('uiSref', $StateRefDirective)
  .directive('uiSrefActive', $StateActiveDirective);

/**
 * @ngdoc filter
 * @name ui.router.state.filter:isState
 *
 * @requires ui.router.state.$state
 *
 * @description
 * Translates to {@link ui.router.state.$state#methods_is $state.is("stateName")}.
 */
$IsStateFilter.$inject = ['$state'];
function $IsStateFilter($state) {
  return function(state) {
    return $state.is(state);
  };
}

/**
 * @ngdoc filter
 * @name ui.router.state.filter:includedByState
 *
 * @requires ui.router.state.$state
 *
 * @description
 * Translates to {@link ui.router.state.$state#methods_includes $state.includes('fullOrPartialStateName')}.
 */
$IncludedByStateFilter.$inject = ['$state'];
function $IncludedByStateFilter($state) {
  return function(state) {
    return $state.includes(state);
  };
}

angular.module('ui.router.state')
  .filter('isState', $IsStateFilter)
  .filter('includedByState', $IncludedByStateFilter);

/*
 * @ngdoc object
 * @name ui.router.compat.$routeProvider
 *
 * @requires ui.router.state.$stateProvider
 * @requires ui.router.router.$urlRouterProvider
 *
 * @description
 * `$routeProvider` of the `ui.router.compat` module overwrites the existing
 * `routeProvider` from the core. This is done to provide compatibility between
 * the UI Router and the core router.
 *
 * It also provides a `when()` method to register routes that map to certain urls.
 * Behind the scenes it actually delegates either to 
 * {@link ui.router.router.$urlRouterProvider $urlRouterProvider} or to the 
 * {@link ui.router.state.$stateProvider $stateProvider} to postprocess the given 
 * router definition object.
 */
$RouteProvider.$inject = ['$stateProvider', '$urlRouterProvider'];
function $RouteProvider(  $stateProvider,    $urlRouterProvider) {

  var routes = [];

  onEnterRoute.$inject = ['$$state'];
  function onEnterRoute(   $$state) {
    /*jshint validthis: true */
    this.locals = $$state.locals.globals;
    this.params = this.locals.$stateParams;
  }

  function onExitRoute() {
    /*jshint validthis: true */
    this.locals = null;
    this.params = null;
  }

  this.when = when;
  /*
   * @ngdoc function
   * @name ui.router.compat.$routeProvider#when
   * @methodOf ui.router.compat.$routeProvider
   *
   * @description
   * Registers a route with a given route definition object. The route definition
   * object has the same interface the angular core route definition object has.
   * 
   * @example
   * <pre>
   * var app = angular.module('app', ['ui.router.compat']);
   *
   * app.config(function ($routeProvider) {
   *   $routeProvider.when('home', {
   *     controller: function () { ... },
   *     templateUrl: 'path/to/template'
   *   });
   * });
   * </pre>
   *
   * @param {string} url URL as string
   * @param {object} route Route definition object
   *
   * @return {object} $routeProvider - $routeProvider instance
   */
  function when(url, route) {
    /*jshint validthis: true */
    if (route.redirectTo != null) {
      // Redirect, configure directly on $urlRouterProvider
      var redirect = route.redirectTo, handler;
      if (isString(redirect)) {
        handler = redirect; // leave $urlRouterProvider to handle
      } else if (isFunction(redirect)) {
        // Adapt to $urlRouterProvider API
        handler = function (params, $location) {
          return redirect(params, $location.path(), $location.search());
        };
      } else {
        throw new Error("Invalid 'redirectTo' in when()");
      }
      $urlRouterProvider.when(url, handler);
    } else {
      // Regular route, configure as state
      $stateProvider.state(inherit(route, {
        parent: null,
        name: 'route:' + encodeURIComponent(url),
        url: url,
        onEnter: onEnterRoute,
        onExit: onExitRoute
      }));
    }
    routes.push(route);
    return this;
  }

  /*
   * @ngdoc object
   * @name ui.router.compat.$route
   *
   * @requires ui.router.state.$state
   * @requires $rootScope
   * @requires $routeParams
   *
   * @property {object} routes - Array of registered routes.
   * @property {object} params - Current route params as object.
   * @property {string} current - Name of the current route.
   *
   * @description
   * The `$route` service provides interfaces to access defined routes. It also let's
   * you access route params through `$routeParams` service, so you have fully
   * control over all the stuff you would actually get from angular's core `$route`
   * service.
   */
  this.$get = $get;
  $get.$inject = ['$state', '$rootScope', '$routeParams'];
  function $get(   $state,   $rootScope,   $routeParams) {

    var $route = {
      routes: routes,
      params: $routeParams,
      current: undefined
    };

    function stateAsRoute(state) {
      return (state.name !== '') ? state : undefined;
    }

    $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
      $rootScope.$broadcast('$routeChangeStart', stateAsRoute(to), stateAsRoute(from));
    });

    $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
      $route.current = stateAsRoute(to);
      $rootScope.$broadcast('$routeChangeSuccess', stateAsRoute(to), stateAsRoute(from));
      copy(toParams, $route.params);
    });

    $rootScope.$on('$stateChangeError', function (ev, to, toParams, from, fromParams, error) {
      $rootScope.$broadcast('$routeChangeError', stateAsRoute(to), stateAsRoute(from), error);
    });

    return $route;
  }
}

angular.module('ui.router.compat')
  .provider('$route', $RouteProvider)
  .directive('ngView', $ViewDirective);
})(window, window.angular);
},{}],19:[function(require,module,exports){
require('./lib/angular.min.js');

module.exports = angular;

},{"./lib/angular.min.js":20}],20:[function(require,module,exports){
/*
 AngularJS v1.2.18
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(T,V,s){'use strict';function t(b){return function(){var a=arguments[0],c,a="["+(b?b+":":"")+a+"] http://errors.angularjs.org/1.2.18/"+(b?b+"/":"")+a;for(c=1;c<arguments.length;c++)a=a+(1==c?"?":"&")+"p"+(c-1)+"="+encodeURIComponent("function"==typeof arguments[c]?arguments[c].toString().replace(/ \{[\s\S]*$/,""):"undefined"==typeof arguments[c]?"undefined":"string"!=typeof arguments[c]?JSON.stringify(arguments[c]):arguments[c]);return Error(a)}}function db(b){if(null==b||Ea(b))return!1;
var a=b.length;return 1===b.nodeType&&a?!0:C(b)||O(b)||0===a||"number"===typeof a&&0<a&&a-1 in b}function q(b,a,c){var d;if(b)if(Q(b))for(d in b)"prototype"==d||("length"==d||"name"==d||b.hasOwnProperty&&!b.hasOwnProperty(d))||a.call(c,b[d],d);else if(b.forEach&&b.forEach!==q)b.forEach(a,c);else if(db(b))for(d=0;d<b.length;d++)a.call(c,b[d],d);else for(d in b)b.hasOwnProperty(d)&&a.call(c,b[d],d);return b}function Wb(b){var a=[],c;for(c in b)b.hasOwnProperty(c)&&a.push(c);return a.sort()}function Sc(b,
a,c){for(var d=Wb(b),e=0;e<d.length;e++)a.call(c,b[d[e]],d[e]);return d}function Xb(b){return function(a,c){b(c,a)}}function eb(){for(var b=ja.length,a;b;){b--;a=ja[b].charCodeAt(0);if(57==a)return ja[b]="A",ja.join("");if(90==a)ja[b]="0";else return ja[b]=String.fromCharCode(a+1),ja.join("")}ja.unshift("0");return ja.join("")}function Yb(b,a){a?b.$$hashKey=a:delete b.$$hashKey}function J(b){var a=b.$$hashKey;q(arguments,function(a){a!==b&&q(a,function(a,c){b[c]=a})});Yb(b,a);return b}function Z(b){return parseInt(b,
10)}function Zb(b,a){return J(new (J(function(){},{prototype:b})),a)}function y(){}function Fa(b){return b}function $(b){return function(){return b}}function D(b){return"undefined"===typeof b}function B(b){return"undefined"!==typeof b}function U(b){return null!=b&&"object"===typeof b}function C(b){return"string"===typeof b}function yb(b){return"number"===typeof b}function Na(b){return"[object Date]"===wa.call(b)}function Q(b){return"function"===typeof b}function fb(b){return"[object RegExp]"===wa.call(b)}
function Ea(b){return b&&b.document&&b.location&&b.alert&&b.setInterval}function Tc(b){return!(!b||!(b.nodeName||b.prop&&b.attr&&b.find))}function Uc(b,a,c){var d=[];q(b,function(b,g,f){d.push(a.call(c,b,g,f))});return d}function Oa(b,a){if(b.indexOf)return b.indexOf(a);for(var c=0;c<b.length;c++)if(a===b[c])return c;return-1}function Pa(b,a){var c=Oa(b,a);0<=c&&b.splice(c,1);return a}function Ga(b,a,c,d){if(Ea(b)||b&&b.$evalAsync&&b.$watch)throw Qa("cpws");if(a){if(b===a)throw Qa("cpi");c=c||[];
d=d||[];if(U(b)){var e=Oa(c,b);if(-1!==e)return d[e];c.push(b);d.push(a)}if(O(b))for(var g=a.length=0;g<b.length;g++)e=Ga(b[g],null,c,d),U(b[g])&&(c.push(b[g]),d.push(e)),a.push(e);else{var f=a.$$hashKey;q(a,function(b,c){delete a[c]});for(g in b)e=Ga(b[g],null,c,d),U(b[g])&&(c.push(b[g]),d.push(e)),a[g]=e;Yb(a,f)}}else(a=b)&&(O(b)?a=Ga(b,[],c,d):Na(b)?a=new Date(b.getTime()):fb(b)?a=RegExp(b.source):U(b)&&(a=Ga(b,{},c,d)));return a}function ka(b,a){if(O(b)){a=a||[];for(var c=0;c<b.length;c++)a[c]=
b[c]}else if(U(b))for(c in a=a||{},b)!zb.call(b,c)||"$"===c.charAt(0)&&"$"===c.charAt(1)||(a[c]=b[c]);return a||b}function xa(b,a){if(b===a)return!0;if(null===b||null===a)return!1;if(b!==b&&a!==a)return!0;var c=typeof b,d;if(c==typeof a&&"object"==c)if(O(b)){if(!O(a))return!1;if((c=b.length)==a.length){for(d=0;d<c;d++)if(!xa(b[d],a[d]))return!1;return!0}}else{if(Na(b))return Na(a)&&b.getTime()==a.getTime();if(fb(b)&&fb(a))return b.toString()==a.toString();if(b&&b.$evalAsync&&b.$watch||a&&a.$evalAsync&&
a.$watch||Ea(b)||Ea(a)||O(a))return!1;c={};for(d in b)if("$"!==d.charAt(0)&&!Q(b[d])){if(!xa(b[d],a[d]))return!1;c[d]=!0}for(d in a)if(!c.hasOwnProperty(d)&&"$"!==d.charAt(0)&&a[d]!==s&&!Q(a[d]))return!1;return!0}return!1}function $b(){return V.securityPolicy&&V.securityPolicy.isActive||V.querySelector&&!(!V.querySelector("[ng-csp]")&&!V.querySelector("[data-ng-csp]"))}function Ab(b,a){var c=2<arguments.length?ya.call(arguments,2):[];return!Q(a)||a instanceof RegExp?a:c.length?function(){return arguments.length?
a.apply(b,c.concat(ya.call(arguments,0))):a.apply(b,c)}:function(){return arguments.length?a.apply(b,arguments):a.call(b)}}function Vc(b,a){var c=a;"string"===typeof b&&"$"===b.charAt(0)?c=s:Ea(a)?c="$WINDOW":a&&V===a?c="$DOCUMENT":a&&(a.$evalAsync&&a.$watch)&&(c="$SCOPE");return c}function ra(b,a){return"undefined"===typeof b?s:JSON.stringify(b,Vc,a?"  ":null)}function ac(b){return C(b)?JSON.parse(b):b}function Ra(b){"function"===typeof b?b=!0:b&&0!==b.length?(b=L(""+b),b=!("f"==b||"0"==b||"false"==
b||"no"==b||"n"==b||"[]"==b)):b=!1;return b}function ga(b){b=w(b).clone();try{b.empty()}catch(a){}var c=w("<div>").append(b).html();try{return 3===b[0].nodeType?L(c):c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/,function(a,b){return"<"+L(b)})}catch(d){return L(c)}}function bc(b){try{return decodeURIComponent(b)}catch(a){}}function cc(b){var a={},c,d;q((b||"").split("&"),function(b){b&&(c=b.split("="),d=bc(c[0]),B(d)&&(b=B(c[1])?bc(c[1]):!0,a[d]?O(a[d])?a[d].push(b):a[d]=[a[d],b]:a[d]=b))});return a}
function Bb(b){var a=[];q(b,function(b,d){O(b)?q(b,function(b){a.push(za(d,!0)+(!0===b?"":"="+za(b,!0)))}):a.push(za(d,!0)+(!0===b?"":"="+za(b,!0)))});return a.length?a.join("&"):""}function gb(b){return za(b,!0).replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+")}function za(b,a){return encodeURIComponent(b).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,a?"%20":"+")}function Wc(b,a){function c(a){a&&d.push(a)}var d=[b],e,g,f=["ng:app",
"ng-app","x-ng-app","data-ng-app"],k=/\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;q(f,function(a){f[a]=!0;c(V.getElementById(a));a=a.replace(":","\\:");b.querySelectorAll&&(q(b.querySelectorAll("."+a),c),q(b.querySelectorAll("."+a+"\\:"),c),q(b.querySelectorAll("["+a+"]"),c))});q(d,function(a){if(!e){var b=k.exec(" "+a.className+" ");b?(e=a,g=(b[2]||"").replace(/\s+/g,",")):q(a.attributes,function(b){!e&&f[b.name]&&(e=a,g=b.value)})}});e&&a(e,g?[g]:[])}function dc(b,a){var c=function(){b=w(b);if(b.injector()){var c=
b[0]===V?"document":ga(b);throw Qa("btstrpd",c);}a=a||[];a.unshift(["$provide",function(a){a.value("$rootElement",b)}]);a.unshift("ng");c=ec(a);c.invoke(["$rootScope","$rootElement","$compile","$injector","$animate",function(a,b,c,d,e){a.$apply(function(){b.data("$injector",d);c(b)(a)})}]);return c},d=/^NG_DEFER_BOOTSTRAP!/;if(T&&!d.test(T.name))return c();T.name=T.name.replace(d,"");Sa.resumeBootstrap=function(b){q(b,function(b){a.push(b)});c()}}function hb(b,a){a=a||"_";return b.replace(Xc,function(b,
d){return(d?a:"")+b.toLowerCase()})}function Cb(b,a,c){if(!b)throw Qa("areq",a||"?",c||"required");return b}function Ta(b,a,c){c&&O(b)&&(b=b[b.length-1]);Cb(Q(b),a,"not a function, got "+(b&&"object"==typeof b?b.constructor.name||"Object":typeof b));return b}function Aa(b,a){if("hasOwnProperty"===b)throw Qa("badname",a);}function fc(b,a,c){if(!a)return b;a=a.split(".");for(var d,e=b,g=a.length,f=0;f<g;f++)d=a[f],b&&(b=(e=b)[d]);return!c&&Q(b)?Ab(e,b):b}function Db(b){var a=b[0];b=b[b.length-1];if(a===
b)return w(a);var c=[a];do{a=a.nextSibling;if(!a)break;c.push(a)}while(a!==b);return w(c)}function Yc(b){var a=t("$injector"),c=t("ng");b=b.angular||(b.angular={});b.$$minErr=b.$$minErr||t;return b.module||(b.module=function(){var b={};return function(e,g,f){if("hasOwnProperty"===e)throw c("badname","module");g&&b.hasOwnProperty(e)&&(b[e]=null);return b[e]||(b[e]=function(){function b(a,d,e){return function(){c[e||"push"]([a,d,arguments]);return n}}if(!g)throw a("nomod",e);var c=[],d=[],l=b("$injector",
"invoke"),n={_invokeQueue:c,_runBlocks:d,requires:g,name:e,provider:b("$provide","provider"),factory:b("$provide","factory"),service:b("$provide","service"),value:b("$provide","value"),constant:b("$provide","constant","unshift"),animation:b("$animateProvider","register"),filter:b("$filterProvider","register"),controller:b("$controllerProvider","register"),directive:b("$compileProvider","directive"),config:l,run:function(a){d.push(a);return this}};f&&l(f);return n}())}}())}function Zc(b){J(b,{bootstrap:dc,
copy:Ga,extend:J,equals:xa,element:w,forEach:q,injector:ec,noop:y,bind:Ab,toJson:ra,fromJson:ac,identity:Fa,isUndefined:D,isDefined:B,isString:C,isFunction:Q,isObject:U,isNumber:yb,isElement:Tc,isArray:O,version:$c,isDate:Na,lowercase:L,uppercase:Ha,callbacks:{counter:0},$$minErr:t,$$csp:$b});Ua=Yc(T);try{Ua("ngLocale")}catch(a){Ua("ngLocale",[]).provider("$locale",ad)}Ua("ng",["ngLocale"],["$provide",function(a){a.provider({$$sanitizeUri:bd});a.provider("$compile",gc).directive({a:cd,input:hc,textarea:hc,
form:dd,script:ed,select:fd,style:gd,option:hd,ngBind:id,ngBindHtml:jd,ngBindTemplate:kd,ngClass:ld,ngClassEven:md,ngClassOdd:nd,ngCloak:od,ngController:pd,ngForm:qd,ngHide:rd,ngIf:sd,ngInclude:td,ngInit:ud,ngNonBindable:vd,ngPluralize:wd,ngRepeat:xd,ngShow:yd,ngStyle:zd,ngSwitch:Ad,ngSwitchWhen:Bd,ngSwitchDefault:Cd,ngOptions:Dd,ngTransclude:Ed,ngModel:Fd,ngList:Gd,ngChange:Hd,required:ic,ngRequired:ic,ngValue:Id}).directive({ngInclude:Jd}).directive(Eb).directive(jc);a.provider({$anchorScroll:Kd,
$animate:Ld,$browser:Md,$cacheFactory:Nd,$controller:Od,$document:Pd,$exceptionHandler:Qd,$filter:kc,$interpolate:Rd,$interval:Sd,$http:Td,$httpBackend:Ud,$location:Vd,$log:Wd,$parse:Xd,$rootScope:Yd,$q:Zd,$sce:$d,$sceDelegate:ae,$sniffer:be,$templateCache:ce,$timeout:de,$window:ee,$$rAF:fe,$$asyncCallback:ge})}])}function Va(b){return b.replace(he,function(a,b,d,e){return e?d.toUpperCase():d}).replace(ie,"Moz$1")}function Fb(b,a,c,d){function e(b){var e=c&&b?[this.filter(b)]:[this],m=a,h,l,n,p,r,
v;if(!d||null!=b)for(;e.length;)for(h=e.shift(),l=0,n=h.length;l<n;l++)for(p=w(h[l]),m?p.triggerHandler("$destroy"):m=!m,r=0,p=(v=p.children()).length;r<p;r++)e.push(Ba(v[r]));return g.apply(this,arguments)}var g=Ba.fn[b],g=g.$original||g;e.$original=g;Ba.fn[b]=e}function R(b){if(b instanceof R)return b;C(b)&&(b=aa(b));if(!(this instanceof R)){if(C(b)&&"<"!=b.charAt(0))throw Gb("nosel");return new R(b)}if(C(b)){var a=b;b=V;var c;if(c=je.exec(a))b=[b.createElement(c[1])];else{var d=b,e;b=d.createDocumentFragment();
c=[];if(Hb.test(a)){d=b.appendChild(d.createElement("div"));e=(ke.exec(a)||["",""])[1].toLowerCase();e=da[e]||da._default;d.innerHTML="<div>&#160;</div>"+e[1]+a.replace(le,"<$1></$2>")+e[2];d.removeChild(d.firstChild);for(a=e[0];a--;)d=d.lastChild;a=0;for(e=d.childNodes.length;a<e;++a)c.push(d.childNodes[a]);d=b.firstChild;d.textContent=""}else c.push(d.createTextNode(a));b.textContent="";b.innerHTML="";b=c}Ib(this,b);w(V.createDocumentFragment()).append(this)}else Ib(this,b)}function Jb(b){return b.cloneNode(!0)}
function Ia(b){lc(b);var a=0;for(b=b.childNodes||[];a<b.length;a++)Ia(b[a])}function mc(b,a,c,d){if(B(d))throw Gb("offargs");var e=la(b,"events");la(b,"handle")&&(D(a)?q(e,function(a,c){Wa(b,c,a);delete e[c]}):q(a.split(" "),function(a){D(c)?(Wa(b,a,e[a]),delete e[a]):Pa(e[a]||[],c)}))}function lc(b,a){var c=b[ib],d=Xa[c];d&&(a?delete Xa[c].data[a]:(d.handle&&(d.events.$destroy&&d.handle({},"$destroy"),mc(b)),delete Xa[c],b[ib]=s))}function la(b,a,c){var d=b[ib],d=Xa[d||-1];if(B(c))d||(b[ib]=d=++me,
d=Xa[d]={}),d[a]=c;else return d&&d[a]}function nc(b,a,c){var d=la(b,"data"),e=B(c),g=!e&&B(a),f=g&&!U(a);d||f||la(b,"data",d={});if(e)d[a]=c;else if(g){if(f)return d&&d[a];J(d,a)}else return d}function Kb(b,a){return b.getAttribute?-1<(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").indexOf(" "+a+" "):!1}function jb(b,a){a&&b.setAttribute&&q(a.split(" "),function(a){b.setAttribute("class",aa((" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").replace(" "+aa(a)+" "," ")))})}
function kb(b,a){if(a&&b.setAttribute){var c=(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ");q(a.split(" "),function(a){a=aa(a);-1===c.indexOf(" "+a+" ")&&(c+=a+" ")});b.setAttribute("class",aa(c))}}function Ib(b,a){if(a){a=a.nodeName||!B(a.length)||Ea(a)?[a]:a;for(var c=0;c<a.length;c++)b.push(a[c])}}function oc(b,a){return lb(b,"$"+(a||"ngController")+"Controller")}function lb(b,a,c){b=w(b);9==b[0].nodeType&&(b=b.find("html"));for(a=O(a)?a:[a];b.length;){for(var d=b[0],e=0,g=a.length;e<
g;e++)if((c=b.data(a[e]))!==s)return c;b=w(d.parentNode||11===d.nodeType&&d.host)}}function pc(b){for(var a=0,c=b.childNodes;a<c.length;a++)Ia(c[a]);for(;b.firstChild;)b.removeChild(b.firstChild)}function qc(b,a){var c=mb[a.toLowerCase()];return c&&rc[b.nodeName]&&c}function ne(b,a){var c=function(c,e){c.preventDefault||(c.preventDefault=function(){c.returnValue=!1});c.stopPropagation||(c.stopPropagation=function(){c.cancelBubble=!0});c.target||(c.target=c.srcElement||V);if(D(c.defaultPrevented)){var g=
c.preventDefault;c.preventDefault=function(){c.defaultPrevented=!0;g.call(c)};c.defaultPrevented=!1}c.isDefaultPrevented=function(){return c.defaultPrevented||!1===c.returnValue};var f=ka(a[e||c.type]||[]);q(f,function(a){a.call(b,c)});8>=S?(c.preventDefault=null,c.stopPropagation=null,c.isDefaultPrevented=null):(delete c.preventDefault,delete c.stopPropagation,delete c.isDefaultPrevented)};c.elem=b;return c}function Ja(b){var a=typeof b,c;"object"==a&&null!==b?"function"==typeof(c=b.$$hashKey)?c=
b.$$hashKey():c===s&&(c=b.$$hashKey=eb()):c=b;return a+":"+c}function Ya(b){q(b,this.put,this)}function sc(b){var a,c;"function"==typeof b?(a=b.$inject)||(a=[],b.length&&(c=b.toString().replace(oe,""),c=c.match(pe),q(c[1].split(qe),function(b){b.replace(re,function(b,c,d){a.push(d)})})),b.$inject=a):O(b)?(c=b.length-1,Ta(b[c],"fn"),a=b.slice(0,c)):Ta(b,"fn",!0);return a}function ec(b){function a(a){return function(b,c){if(U(b))q(b,Xb(a));else return a(b,c)}}function c(a,b){Aa(a,"service");if(Q(b)||
O(b))b=n.instantiate(b);if(!b.$get)throw Za("pget",a);return l[a+k]=b}function d(a,b){return c(a,{$get:b})}function e(a){var b=[],c,d,g,k;q(a,function(a){if(!h.get(a)){h.put(a,!0);try{if(C(a))for(c=Ua(a),b=b.concat(e(c.requires)).concat(c._runBlocks),d=c._invokeQueue,g=0,k=d.length;g<k;g++){var f=d[g],m=n.get(f[0]);m[f[1]].apply(m,f[2])}else Q(a)?b.push(n.invoke(a)):O(a)?b.push(n.invoke(a)):Ta(a,"module")}catch(l){throw O(a)&&(a=a[a.length-1]),l.message&&(l.stack&&-1==l.stack.indexOf(l.message))&&
(l=l.message+"\n"+l.stack),Za("modulerr",a,l.stack||l.message||l);}}});return b}function g(a,b){function c(d){if(a.hasOwnProperty(d)){if(a[d]===f)throw Za("cdep",d+" <- "+m.join(" <- "));return a[d]}try{return m.unshift(d),a[d]=f,a[d]=b(d)}catch(e){throw a[d]===f&&delete a[d],e;}finally{m.shift()}}function d(a,b,e){var g=[],k=sc(a),f,m,h;m=0;for(f=k.length;m<f;m++){h=k[m];if("string"!==typeof h)throw Za("itkn",h);g.push(e&&e.hasOwnProperty(h)?e[h]:c(h))}a.$inject||(a=a[f]);return a.apply(b,g)}return{invoke:d,
instantiate:function(a,b){var c=function(){},e;c.prototype=(O(a)?a[a.length-1]:a).prototype;c=new c;e=d(a,c,b);return U(e)||Q(e)?e:c},get:c,annotate:sc,has:function(b){return l.hasOwnProperty(b+k)||a.hasOwnProperty(b)}}}var f={},k="Provider",m=[],h=new Ya,l={$provide:{provider:a(c),factory:a(d),service:a(function(a,b){return d(a,["$injector",function(a){return a.instantiate(b)}])}),value:a(function(a,b){return d(a,$(b))}),constant:a(function(a,b){Aa(a,"constant");l[a]=b;p[a]=b}),decorator:function(a,
b){var c=n.get(a+k),d=c.$get;c.$get=function(){var a=r.invoke(d,c);return r.invoke(b,null,{$delegate:a})}}}},n=l.$injector=g(l,function(){throw Za("unpr",m.join(" <- "));}),p={},r=p.$injector=g(p,function(a){a=n.get(a+k);return r.invoke(a.$get,a)});q(e(b),function(a){r.invoke(a||y)});return r}function Kd(){var b=!0;this.disableAutoScrolling=function(){b=!1};this.$get=["$window","$location","$rootScope",function(a,c,d){function e(a){var b=null;q(a,function(a){b||"a"!==L(a.nodeName)||(b=a)});return b}
function g(){var b=c.hash(),d;b?(d=f.getElementById(b))?d.scrollIntoView():(d=e(f.getElementsByName(b)))?d.scrollIntoView():"top"===b&&a.scrollTo(0,0):a.scrollTo(0,0)}var f=a.document;b&&d.$watch(function(){return c.hash()},function(){d.$evalAsync(g)});return g}]}function ge(){this.$get=["$$rAF","$timeout",function(b,a){return b.supported?function(a){return b(a)}:function(b){return a(b,0,!1)}}]}function se(b,a,c,d){function e(a){try{a.apply(null,ya.call(arguments,1))}finally{if(v--,0===v)for(;I.length;)try{I.pop()()}catch(b){c.error(b)}}}
function g(a,b){(function ba(){q(x,function(a){a()});u=b(ba,a)})()}function f(){z=null;M!=k.url()&&(M=k.url(),q(ha,function(a){a(k.url())}))}var k=this,m=a[0],h=b.location,l=b.history,n=b.setTimeout,p=b.clearTimeout,r={};k.isMock=!1;var v=0,I=[];k.$$completeOutstandingRequest=e;k.$$incOutstandingRequestCount=function(){v++};k.notifyWhenNoOutstandingRequests=function(a){q(x,function(a){a()});0===v?a():I.push(a)};var x=[],u;k.addPollFn=function(a){D(u)&&g(100,n);x.push(a);return a};var M=h.href,F=a.find("base"),
z=null;k.url=function(a,c){h!==b.location&&(h=b.location);l!==b.history&&(l=b.history);if(a){if(M!=a)return M=a,d.history?c?l.replaceState(null,"",a):(l.pushState(null,"",a),F.attr("href",F.attr("href"))):(z=a,c?h.replace(a):h.href=a),k}else return z||h.href.replace(/%27/g,"'")};var ha=[],P=!1;k.onUrlChange=function(a){if(!P){if(d.history)w(b).on("popstate",f);if(d.hashchange)w(b).on("hashchange",f);else k.addPollFn(f);P=!0}ha.push(a);return a};k.baseHref=function(){var a=F.attr("href");return a?
a.replace(/^(https?\:)?\/\/[^\/]*/,""):""};var N={},ca="",E=k.baseHref();k.cookies=function(a,b){var d,e,g,k;if(a)b===s?m.cookie=escape(a)+"=;path="+E+";expires=Thu, 01 Jan 1970 00:00:00 GMT":C(b)&&(d=(m.cookie=escape(a)+"="+escape(b)+";path="+E).length+1,4096<d&&c.warn("Cookie '"+a+"' possibly not set or overflowed because it was too large ("+d+" > 4096 bytes)!"));else{if(m.cookie!==ca)for(ca=m.cookie,d=ca.split("; "),N={},g=0;g<d.length;g++)e=d[g],k=e.indexOf("="),0<k&&(a=unescape(e.substring(0,
k)),N[a]===s&&(N[a]=unescape(e.substring(k+1))));return N}};k.defer=function(a,b){var c;v++;c=n(function(){delete r[c];e(a)},b||0);r[c]=!0;return c};k.defer.cancel=function(a){return r[a]?(delete r[a],p(a),e(y),!0):!1}}function Md(){this.$get=["$window","$log","$sniffer","$document",function(b,a,c,d){return new se(b,d,a,c)}]}function Nd(){this.$get=function(){function b(b,d){function e(a){a!=n&&(p?p==a&&(p=a.n):p=a,g(a.n,a.p),g(a,n),n=a,n.n=null)}function g(a,b){a!=b&&(a&&(a.p=b),b&&(b.n=a))}if(b in
a)throw t("$cacheFactory")("iid",b);var f=0,k=J({},d,{id:b}),m={},h=d&&d.capacity||Number.MAX_VALUE,l={},n=null,p=null;return a[b]={put:function(a,b){if(h<Number.MAX_VALUE){var c=l[a]||(l[a]={key:a});e(c)}if(!D(b))return a in m||f++,m[a]=b,f>h&&this.remove(p.key),b},get:function(a){if(h<Number.MAX_VALUE){var b=l[a];if(!b)return;e(b)}return m[a]},remove:function(a){if(h<Number.MAX_VALUE){var b=l[a];if(!b)return;b==n&&(n=b.p);b==p&&(p=b.n);g(b.n,b.p);delete l[a]}delete m[a];f--},removeAll:function(){m=
{};f=0;l={};n=p=null},destroy:function(){l=k=m=null;delete a[b]},info:function(){return J({},k,{size:f})}}}var a={};b.info=function(){var b={};q(a,function(a,e){b[e]=a.info()});return b};b.get=function(b){return a[b]};return b}}function ce(){this.$get=["$cacheFactory",function(b){return b("templates")}]}function gc(b,a){var c={},d="Directive",e=/^\s*directive\:\s*([\d\w_\-]+)\s+(.*)$/,g=/(([\d\w_\-]+)(?:\:([^;]+))?;?)/,f=/^(on[a-z]+|formaction)$/;this.directive=function m(a,e){Aa(a,"directive");C(a)?
(Cb(e,"directiveFactory"),c.hasOwnProperty(a)||(c[a]=[],b.factory(a+d,["$injector","$exceptionHandler",function(b,d){var e=[];q(c[a],function(c,g){try{var f=b.invoke(c);Q(f)?f={compile:$(f)}:!f.compile&&f.link&&(f.compile=$(f.link));f.priority=f.priority||0;f.index=g;f.name=f.name||a;f.require=f.require||f.controller&&f.name;f.restrict=f.restrict||"A";e.push(f)}catch(m){d(m)}});return e}])),c[a].push(e)):q(a,Xb(m));return this};this.aHrefSanitizationWhitelist=function(b){return B(b)?(a.aHrefSanitizationWhitelist(b),
this):a.aHrefSanitizationWhitelist()};this.imgSrcSanitizationWhitelist=function(b){return B(b)?(a.imgSrcSanitizationWhitelist(b),this):a.imgSrcSanitizationWhitelist()};this.$get=["$injector","$interpolate","$exceptionHandler","$http","$templateCache","$parse","$controller","$rootScope","$document","$sce","$animate","$$sanitizeUri",function(a,b,l,n,p,r,v,I,x,u,M,F){function z(a,b,c,d,e){a instanceof w||(a=w(a));q(a,function(b,c){3==b.nodeType&&b.nodeValue.match(/\S+/)&&(a[c]=w(b).wrap("<span></span>").parent()[0])});
var g=P(a,b,a,c,d,e);ha(a,"ng-scope");return function(b,c,d,e){Cb(b,"scope");var f=c?Ka.clone.call(a):a;q(d,function(a,b){f.data("$"+b+"Controller",a)});d=0;for(var m=f.length;d<m;d++){var h=f[d].nodeType;1!==h&&9!==h||f.eq(d).data("$scope",b)}c&&c(f,b);g&&g(b,f,f,e);return f}}function ha(a,b){try{a.addClass(b)}catch(c){}}function P(a,b,c,d,e,g){function f(a,c,d,e){var g,h,l,r,n,p,v;g=c.length;var K=Array(g);for(n=0;n<g;n++)K[n]=c[n];v=n=0;for(p=m.length;n<p;v++)h=K[v],c=m[n++],g=m[n++],l=w(h),c?
(c.scope?(r=a.$new(),l.data("$scope",r)):r=a,l=c.transcludeOnThisElement?N(a,c.transclude,e):!c.templateOnThisElement&&e?e:!e&&b?N(a,b):null,c(g,r,h,d,l)):g&&g(a,h.childNodes,s,e)}for(var m=[],h,l,r,n,p=0;p<a.length;p++)h=new Lb,l=ca(a[p],[],h,0===p?d:s,e),(g=l.length?H(l,a[p],h,b,c,null,[],[],g):null)&&g.scope&&ha(w(a[p]),"ng-scope"),h=g&&g.terminal||!(r=a[p].childNodes)||!r.length?null:P(r,g?(g.transcludeOnThisElement||!g.templateOnThisElement)&&g.transclude:b),m.push(g,h),n=n||g||h,g=null;return n?
f:null}function N(a,b,c){return function(d,e,g){var f=!1;d||(d=a.$new(),f=d.$$transcluded=!0);e=b(d,e,g,c);if(f)e.on("$destroy",function(){d.$destroy()});return e}}function ca(a,b,c,d,f){var m=c.$attr,h;switch(a.nodeType){case 1:ba(b,ma(La(a).toLowerCase()),"E",d,f);var l,r,n;h=a.attributes;for(var p=0,v=h&&h.length;p<v;p++){var x=!1,I=!1;l=h[p];if(!S||8<=S||l.specified){r=l.name;n=ma(r);W.test(n)&&(r=hb(n.substr(6),"-"));var M=n.replace(/(Start|End)$/,"");n===M+"Start"&&(x=r,I=r.substr(0,r.length-
5)+"end",r=r.substr(0,r.length-6));n=ma(r.toLowerCase());m[n]=r;c[n]=l=aa(l.value);qc(a,n)&&(c[n]=!0);R(a,b,l,n);ba(b,n,"A",d,f,x,I)}}a=a.className;if(C(a)&&""!==a)for(;h=g.exec(a);)n=ma(h[2]),ba(b,n,"C",d,f)&&(c[n]=aa(h[3])),a=a.substr(h.index+h[0].length);break;case 3:t(b,a.nodeValue);break;case 8:try{if(h=e.exec(a.nodeValue))n=ma(h[1]),ba(b,n,"M",d,f)&&(c[n]=aa(h[2]))}catch(u){}}b.sort(D);return b}function E(a,b,c){var d=[],e=0;if(b&&a.hasAttribute&&a.hasAttribute(b)){do{if(!a)throw ia("uterdir",
b,c);1==a.nodeType&&(a.hasAttribute(b)&&e++,a.hasAttribute(c)&&e--);d.push(a);a=a.nextSibling}while(0<e)}else d.push(a);return w(d)}function A(a,b,c){return function(d,e,g,f,h){e=E(e[0],b,c);return a(d,e,g,f,h)}}function H(a,c,d,e,g,f,m,n,p){function x(a,b,c,d){if(a){c&&(a=A(a,c,d));a.require=G.require;a.directiveName=na;if(N===G||G.$$isolateScope)a=uc(a,{isolateScope:!0});m.push(a)}if(b){c&&(b=A(b,c,d));b.require=G.require;b.directiveName=na;if(N===G||G.$$isolateScope)b=uc(b,{isolateScope:!0});n.push(b)}}
function I(a,b,c,d){var e,g="data",f=!1;if(C(b)){for(;"^"==(e=b.charAt(0))||"?"==e;)b=b.substr(1),"^"==e&&(g="inheritedData"),f=f||"?"==e;e=null;d&&"data"===g&&(e=d[b]);e=e||c[g]("$"+b+"Controller");if(!e&&!f)throw ia("ctreq",b,a);}else O(b)&&(e=[],q(b,function(b){e.push(I(a,b,c,d))}));return e}function M(a,e,g,f,p){function x(a,b){var c;2>arguments.length&&(b=a,a=s);Ca&&(c=ca);return p(a,b,c)}var u,K,z,F,A,E,ca={},nb;u=c===g?d:ka(d,new Lb(w(g),d.$attr));K=u.$$element;if(N){var ba=/^\s*([@=&])(\??)\s*(\w*)\s*$/;
f=w(g);E=e.$new(!0);!H||H!==N&&H!==N.$$originalDirective?f.data("$isolateScopeNoTemplate",E):f.data("$isolateScope",E);ha(f,"ng-isolate-scope");q(N.scope,function(a,c){var d=a.match(ba)||[],g=d[3]||c,f="?"==d[2],d=d[1],m,l,n,p;E.$$isolateBindings[c]=d+g;switch(d){case "@":u.$observe(g,function(a){E[c]=a});u.$$observers[g].$$scope=e;u[g]&&(E[c]=b(u[g])(e));break;case "=":if(f&&!u[g])break;l=r(u[g]);p=l.literal?xa:function(a,b){return a===b};n=l.assign||function(){m=E[c]=l(e);throw ia("nonassign",u[g],
N.name);};m=E[c]=l(e);E.$watch(function(){var a=l(e);p(a,E[c])||(p(a,m)?n(e,a=E[c]):E[c]=a);return m=a},null,l.literal);break;case "&":l=r(u[g]);E[c]=function(a){return l(e,a)};break;default:throw ia("iscp",N.name,c,a);}})}nb=p&&x;P&&q(P,function(a){var b={$scope:a===N||a.$$isolateScope?E:e,$element:K,$attrs:u,$transclude:nb},c;A=a.controller;"@"==A&&(A=u[a.name]);c=v(A,b);ca[a.name]=c;Ca||K.data("$"+a.name+"Controller",c);a.controllerAs&&(b.$scope[a.controllerAs]=c)});f=0;for(z=m.length;f<z;f++)try{F=
m[f],F(F.isolateScope?E:e,K,u,F.require&&I(F.directiveName,F.require,K,ca),nb)}catch(G){l(G,ga(K))}f=e;N&&(N.template||null===N.templateUrl)&&(f=E);a&&a(f,g.childNodes,s,p);for(f=n.length-1;0<=f;f--)try{F=n[f],F(F.isolateScope?E:e,K,u,F.require&&I(F.directiveName,F.require,K,ca),nb)}catch(B){l(B,ga(K))}}p=p||{};for(var u=-Number.MAX_VALUE,F,P=p.controllerDirectives,N=p.newIsolateScopeDirective,H=p.templateDirective,ba=p.nonTlbTranscludeDirective,D=!1,J=!1,Ca=p.hasElementTranscludeDirective,t=d.$$element=
w(c),G,na,X,T=e,R,S=0,oa=a.length;S<oa;S++){G=a[S];var W=G.$$start,Y=G.$$end;W&&(t=E(c,W,Y));X=s;if(u>G.priority)break;if(X=G.scope)F=F||G,G.templateUrl||(L("new/isolated scope",N,G,t),U(X)&&(N=G));na=G.name;!G.templateUrl&&G.controller&&(X=G.controller,P=P||{},L("'"+na+"' controller",P[na],G,t),P[na]=G);if(X=G.transclude)D=!0,G.$$tlb||(L("transclusion",ba,G,t),ba=G),"element"==X?(Ca=!0,u=G.priority,X=E(c,W,Y),t=d.$$element=w(V.createComment(" "+na+": "+d[na]+" ")),c=t[0],ob(g,w(ya.call(X,0)),c),
T=z(X,e,u,f&&f.name,{nonTlbTranscludeDirective:ba})):(X=w(Jb(c)).contents(),t.empty(),T=z(X,e));if(G.template)if(J=!0,L("template",H,G,t),H=G,X=Q(G.template)?G.template(t,d):G.template,X=Z(X),G.replace){f=G;X=Hb.test(X)?w(aa(X)):[];c=X[0];if(1!=X.length||1!==c.nodeType)throw ia("tplrt",na,"");ob(g,t,c);oa={$attr:{}};X=ca(c,[],oa);var te=a.splice(S+1,a.length-(S+1));N&&tc(X);a=a.concat(X).concat(te);B(d,oa);oa=a.length}else t.html(X);if(G.templateUrl)J=!0,L("template",H,G,t),H=G,G.replace&&(f=G),M=
y(a.splice(S,a.length-S),t,d,g,D&&T,m,n,{controllerDirectives:P,newIsolateScopeDirective:N,templateDirective:H,nonTlbTranscludeDirective:ba}),oa=a.length;else if(G.compile)try{R=G.compile(t,d,T),Q(R)?x(null,R,W,Y):R&&x(R.pre,R.post,W,Y)}catch($){l($,ga(t))}G.terminal&&(M.terminal=!0,u=Math.max(u,G.priority))}M.scope=F&&!0===F.scope;M.transcludeOnThisElement=D;M.templateOnThisElement=J;M.transclude=T;p.hasElementTranscludeDirective=Ca;return M}function tc(a){for(var b=0,c=a.length;b<c;b++)a[b]=Zb(a[b],
{$$isolateScope:!0})}function ba(b,e,g,f,h,r,n){if(e===h)return null;h=null;if(c.hasOwnProperty(e)){var p;e=a.get(e+d);for(var v=0,x=e.length;v<x;v++)try{p=e[v],(f===s||f>p.priority)&&-1!=p.restrict.indexOf(g)&&(r&&(p=Zb(p,{$$start:r,$$end:n})),b.push(p),h=p)}catch(I){l(I)}}return h}function B(a,b){var c=b.$attr,d=a.$attr,e=a.$$element;q(a,function(d,e){"$"!=e.charAt(0)&&(b[e]&&b[e]!==d&&(d+=("style"===e?";":" ")+b[e]),a.$set(e,d,!0,c[e]))});q(b,function(b,g){"class"==g?(ha(e,b),a["class"]=(a["class"]?
a["class"]+" ":"")+b):"style"==g?(e.attr("style",e.attr("style")+";"+b),a.style=(a.style?a.style+";":"")+b):"$"==g.charAt(0)||a.hasOwnProperty(g)||(a[g]=b,d[g]=c[g])})}function y(a,b,c,d,e,g,f,h){var m=[],l,r,v=b[0],x=a.shift(),I=J({},x,{templateUrl:null,transclude:null,replace:null,$$originalDirective:x}),M=Q(x.templateUrl)?x.templateUrl(b,c):x.templateUrl;b.empty();n.get(u.getTrustedResourceUrl(M),{cache:p}).success(function(n){var p,u;n=Z(n);if(x.replace){n=Hb.test(n)?w(aa(n)):[];p=n[0];if(1!=
n.length||1!==p.nodeType)throw ia("tplrt",x.name,M);n={$attr:{}};ob(d,b,p);var z=ca(p,[],n);U(x.scope)&&tc(z);a=z.concat(a);B(c,n)}else p=v,b.html(n);a.unshift(I);l=H(a,p,c,e,b,x,g,f,h);q(d,function(a,c){a==p&&(d[c]=b[0])});for(r=P(b[0].childNodes,e);m.length;){n=m.shift();u=m.shift();var F=m.shift(),A=m.shift(),z=b[0];if(u!==v){var E=u.className;h.hasElementTranscludeDirective&&x.replace||(z=Jb(p));ob(F,w(u),z);ha(w(z),E)}u=l.transcludeOnThisElement?N(n,l.transclude,A):A;l(r,n,z,d,u)}m=null}).error(function(a,
b,c,d){throw ia("tpload",d.url);});return function(a,b,c,d,e){a=e;m?(m.push(b),m.push(c),m.push(d),m.push(a)):(l.transcludeOnThisElement&&(a=N(b,l.transclude,e)),l(r,b,c,d,a))}}function D(a,b){var c=b.priority-a.priority;return 0!==c?c:a.name!==b.name?a.name<b.name?-1:1:a.index-b.index}function L(a,b,c,d){if(b)throw ia("multidir",b.name,c.name,a,ga(d));}function t(a,c){var d=b(c,!0);d&&a.push({priority:0,compile:function(a){var b=a.parent().length;b&&ha(a.parent(),"ng-binding");return function(a,
c){var e=c.parent(),g=e.data("$binding")||[];g.push(d);e.data("$binding",g);b||ha(e,"ng-binding");a.$watch(d,function(a){c[0].nodeValue=a})}}})}function T(a,b){if("srcdoc"==b)return u.HTML;var c=La(a);if("xlinkHref"==b||"FORM"==c&&"action"==b||"IMG"!=c&&("src"==b||"ngSrc"==b))return u.RESOURCE_URL}function R(a,c,d,e){var g=b(d,!0);if(g){if("multiple"===e&&"SELECT"===La(a))throw ia("selmulti",ga(a));c.push({priority:100,compile:function(){return{pre:function(c,d,m){d=m.$$observers||(m.$$observers=
{});if(f.test(e))throw ia("nodomevents");if(g=b(m[e],!0,T(a,e)))m[e]=g(c),(d[e]||(d[e]=[])).$$inter=!0,(m.$$observers&&m.$$observers[e].$$scope||c).$watch(g,function(a,b){"class"===e&&a!=b?m.$updateClass(a,b):m.$set(e,a)})}}}})}}function ob(a,b,c){var d=b[0],e=b.length,g=d.parentNode,f,m;if(a)for(f=0,m=a.length;f<m;f++)if(a[f]==d){a[f++]=c;m=f+e-1;for(var h=a.length;f<h;f++,m++)m<h?a[f]=a[m]:delete a[f];a.length-=e-1;break}g&&g.replaceChild(c,d);a=V.createDocumentFragment();a.appendChild(d);c[w.expando]=
d[w.expando];d=1;for(e=b.length;d<e;d++)g=b[d],w(g).remove(),a.appendChild(g),delete b[d];b[0]=c;b.length=1}function uc(a,b){return J(function(){return a.apply(null,arguments)},a,b)}var Lb=function(a,b){this.$$element=a;this.$attr=b||{}};Lb.prototype={$normalize:ma,$addClass:function(a){a&&0<a.length&&M.addClass(this.$$element,a)},$removeClass:function(a){a&&0<a.length&&M.removeClass(this.$$element,a)},$updateClass:function(a,b){var c=vc(a,b),d=vc(b,a);0===c.length?M.removeClass(this.$$element,d):
0===d.length?M.addClass(this.$$element,c):M.setClass(this.$$element,c,d)},$set:function(a,b,c,d){var e=qc(this.$$element[0],a);e&&(this.$$element.prop(a,b),d=e);this[a]=b;d?this.$attr[a]=d:(d=this.$attr[a])||(this.$attr[a]=d=hb(a,"-"));e=La(this.$$element);if("A"===e&&"href"===a||"IMG"===e&&"src"===a)this[a]=b=F(b,"src"===a);!1!==c&&(null===b||b===s?this.$$element.removeAttr(d):this.$$element.attr(d,b));(c=this.$$observers)&&q(c[a],function(a){try{a(b)}catch(c){l(c)}})},$observe:function(a,b){var c=
this,d=c.$$observers||(c.$$observers={}),e=d[a]||(d[a]=[]);e.push(b);I.$evalAsync(function(){e.$$inter||b(c[a])});return b}};var Ca=b.startSymbol(),oa=b.endSymbol(),Z="{{"==Ca||"}}"==oa?Fa:function(a){return a.replace(/\{\{/g,Ca).replace(/}}/g,oa)},W=/^ngAttr[A-Z]/;return z}]}function ma(b){return Va(b.replace(ue,""))}function vc(b,a){var c="",d=b.split(/\s+/),e=a.split(/\s+/),g=0;a:for(;g<d.length;g++){for(var f=d[g],k=0;k<e.length;k++)if(f==e[k])continue a;c+=(0<c.length?" ":"")+f}return c}function Od(){var b=
{},a=/^(\S+)(\s+as\s+(\w+))?$/;this.register=function(a,d){Aa(a,"controller");U(a)?J(b,a):b[a]=d};this.$get=["$injector","$window",function(c,d){return function(e,g){var f,k,m;C(e)&&(f=e.match(a),k=f[1],m=f[3],e=b.hasOwnProperty(k)?b[k]:fc(g.$scope,k,!0)||fc(d,k,!0),Ta(e,k,!0));f=c.instantiate(e,g);if(m){if(!g||"object"!=typeof g.$scope)throw t("$controller")("noscp",k||e.name,m);g.$scope[m]=f}return f}}]}function Pd(){this.$get=["$window",function(b){return w(b.document)}]}function Qd(){this.$get=
["$log",function(b){return function(a,c){b.error.apply(b,arguments)}}]}function wc(b){var a={},c,d,e;if(!b)return a;q(b.split("\n"),function(b){e=b.indexOf(":");c=L(aa(b.substr(0,e)));d=aa(b.substr(e+1));c&&(a[c]=a[c]?a[c]+(", "+d):d)});return a}function xc(b){var a=U(b)?b:s;return function(c){a||(a=wc(b));return c?a[L(c)]||null:a}}function yc(b,a,c){if(Q(c))return c(b,a);q(c,function(c){b=c(b,a)});return b}function Td(){var b=/^\s*(\[|\{[^\{])/,a=/[\}\]]\s*$/,c=/^\)\]\}',?\n/,d={"Content-Type":"application/json;charset=utf-8"},
e=this.defaults={transformResponse:[function(d){C(d)&&(d=d.replace(c,""),b.test(d)&&a.test(d)&&(d=ac(d)));return d}],transformRequest:[function(a){return U(a)&&"[object File]"!==wa.call(a)&&"[object Blob]"!==wa.call(a)?ra(a):a}],headers:{common:{Accept:"application/json, text/plain, */*"},post:ka(d),put:ka(d),patch:ka(d)},xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN"},g=this.interceptors=[],f=this.responseInterceptors=[];this.$get=["$httpBackend","$browser","$cacheFactory","$rootScope",
"$q","$injector",function(a,b,c,d,n,p){function r(a){function b(a){var d=J({},a,{data:yc(a.data,a.headers,c.transformResponse)});return 200<=a.status&&300>a.status?d:n.reject(d)}var c={method:"get",transformRequest:e.transformRequest,transformResponse:e.transformResponse},d=function(a){function b(a){var c;q(a,function(b,d){Q(b)&&(c=b(),null!=c?a[d]=c:delete a[d])})}var c=e.headers,d=J({},a.headers),g,f,c=J({},c.common,c[L(a.method)]);b(c);b(d);a:for(g in c){a=L(g);for(f in d)if(L(f)===a)continue a;
d[g]=c[g]}return d}(a);J(c,a);c.headers=d;c.method=Ha(c.method);var g=[function(a){d=a.headers;var c=yc(a.data,xc(d),a.transformRequest);D(a.data)&&q(d,function(a,b){"content-type"===L(b)&&delete d[b]});D(a.withCredentials)&&!D(e.withCredentials)&&(a.withCredentials=e.withCredentials);return v(a,c,d).then(b,b)},s],f=n.when(c);for(q(u,function(a){(a.request||a.requestError)&&g.unshift(a.request,a.requestError);(a.response||a.responseError)&&g.push(a.response,a.responseError)});g.length;){a=g.shift();
var m=g.shift(),f=f.then(a,m)}f.success=function(a){f.then(function(b){a(b.data,b.status,b.headers,c)});return f};f.error=function(a){f.then(null,function(b){a(b.data,b.status,b.headers,c)});return f};return f}function v(c,g,f){function h(a,b,c,e){A&&(200<=a&&300>a?A.put(w,[a,b,wc(c),e]):A.remove(w));p(b,a,c,e);d.$$phase||d.$apply()}function p(a,b,d,e){b=Math.max(b,0);(200<=b&&300>b?u.resolve:u.reject)({data:a,status:b,headers:xc(d),config:c,statusText:e})}function v(){var a=Oa(r.pendingRequests,
c);-1!==a&&r.pendingRequests.splice(a,1)}var u=n.defer(),q=u.promise,A,H,w=I(c.url,c.params);r.pendingRequests.push(c);q.then(v,v);(c.cache||e.cache)&&(!1!==c.cache&&"GET"==c.method)&&(A=U(c.cache)?c.cache:U(e.cache)?e.cache:x);if(A)if(H=A.get(w),B(H)){if(H.then)return H.then(v,v),H;O(H)?p(H[1],H[0],ka(H[2]),H[3]):p(H,200,{},"OK")}else A.put(w,q);D(H)&&((H=Mb(c.url)?b.cookies()[c.xsrfCookieName||e.xsrfCookieName]:s)&&(f[c.xsrfHeaderName||e.xsrfHeaderName]=H),a(c.method,w,g,h,f,c.timeout,c.withCredentials,
c.responseType));return q}function I(a,b){if(!b)return a;var c=[];Sc(b,function(a,b){null===a||D(a)||(O(a)||(a=[a]),q(a,function(a){U(a)&&(a=ra(a));c.push(za(b)+"="+za(a))}))});0<c.length&&(a+=(-1==a.indexOf("?")?"?":"&")+c.join("&"));return a}var x=c("$http"),u=[];q(g,function(a){u.unshift(C(a)?p.get(a):p.invoke(a))});q(f,function(a,b){var c=C(a)?p.get(a):p.invoke(a);u.splice(b,0,{response:function(a){return c(n.when(a))},responseError:function(a){return c(n.reject(a))}})});r.pendingRequests=[];
(function(a){q(arguments,function(a){r[a]=function(b,c){return r(J(c||{},{method:a,url:b}))}})})("get","delete","head","jsonp");(function(a){q(arguments,function(a){r[a]=function(b,c,d){return r(J(d||{},{method:a,url:b,data:c}))}})})("post","put");r.defaults=e;return r}]}function ve(b){if(8>=S&&(!b.match(/^(get|post|head|put|delete|options)$/i)||!T.XMLHttpRequest))return new T.ActiveXObject("Microsoft.XMLHTTP");if(T.XMLHttpRequest)return new T.XMLHttpRequest;throw t("$httpBackend")("noxhr");}function Ud(){this.$get=
["$browser","$window","$document",function(b,a,c){return we(b,ve,b.defer,a.angular.callbacks,c[0])}]}function we(b,a,c,d,e){function g(a,b,c){var g=e.createElement("script"),f=null;g.type="text/javascript";g.src=a;g.async=!0;f=function(a){Wa(g,"load",f);Wa(g,"error",f);e.body.removeChild(g);g=null;var k=-1,v="unknown";a&&("load"!==a.type||d[b].called||(a={type:"error"}),v=a.type,k="error"===a.type?404:200);c&&c(k,v)};pb(g,"load",f);pb(g,"error",f);8>=S&&(g.onreadystatechange=function(){C(g.readyState)&&
/loaded|complete/.test(g.readyState)&&(g.onreadystatechange=null,f({type:"load"}))});e.body.appendChild(g);return f}var f=-1;return function(e,m,h,l,n,p,r,v){function I(){u=f;F&&F();z&&z.abort()}function x(a,d,e,g,f){P&&c.cancel(P);F=z=null;0===d&&(d=e?200:"file"==sa(m).protocol?404:0);a(1223===d?204:d,e,g,f||"");b.$$completeOutstandingRequest(y)}var u;b.$$incOutstandingRequestCount();m=m||b.url();if("jsonp"==L(e)){var M="_"+(d.counter++).toString(36);d[M]=function(a){d[M].data=a;d[M].called=!0};
var F=g(m.replace("JSON_CALLBACK","angular.callbacks."+M),M,function(a,b){x(l,a,d[M].data,"",b);d[M]=y})}else{var z=a(e);z.open(e,m,!0);q(n,function(a,b){B(a)&&z.setRequestHeader(b,a)});z.onreadystatechange=function(){if(z&&4==z.readyState){var a=null,b=null;u!==f&&(a=z.getAllResponseHeaders(),b="response"in z?z.response:z.responseText);x(l,u||z.status,b,a,z.statusText||"")}};r&&(z.withCredentials=!0);if(v)try{z.responseType=v}catch(s){if("json"!==v)throw s;}z.send(h||null)}if(0<p)var P=c(I,p);else p&&
p.then&&p.then(I)}}function Rd(){var b="{{",a="}}";this.startSymbol=function(a){return a?(b=a,this):b};this.endSymbol=function(b){return b?(a=b,this):a};this.$get=["$parse","$exceptionHandler","$sce",function(c,d,e){function g(g,h,l){for(var n,p,r=0,v=[],I=g.length,x=!1,u=[];r<I;)-1!=(n=g.indexOf(b,r))&&-1!=(p=g.indexOf(a,n+f))?(r!=n&&v.push(g.substring(r,n)),v.push(r=c(x=g.substring(n+f,p))),r.exp=x,r=p+k,x=!0):(r!=I&&v.push(g.substring(r)),r=I);(I=v.length)||(v.push(""),I=1);if(l&&1<v.length)throw zc("noconcat",
g);if(!h||x)return u.length=I,r=function(a){try{for(var b=0,c=I,f;b<c;b++){if("function"==typeof(f=v[b]))if(f=f(a),f=l?e.getTrusted(l,f):e.valueOf(f),null==f)f="";else switch(typeof f){case "string":break;case "number":f=""+f;break;default:f=ra(f)}u[b]=f}return u.join("")}catch(k){a=zc("interr",g,k.toString()),d(a)}},r.exp=g,r.parts=v,r}var f=b.length,k=a.length;g.startSymbol=function(){return b};g.endSymbol=function(){return a};return g}]}function Sd(){this.$get=["$rootScope","$window","$q",function(b,
a,c){function d(d,f,k,m){var h=a.setInterval,l=a.clearInterval,n=c.defer(),p=n.promise,r=0,v=B(m)&&!m;k=B(k)?k:0;p.then(null,null,d);p.$$intervalId=h(function(){n.notify(r++);0<k&&r>=k&&(n.resolve(r),l(p.$$intervalId),delete e[p.$$intervalId]);v||b.$apply()},f);e[p.$$intervalId]=n;return p}var e={};d.cancel=function(a){return a&&a.$$intervalId in e?(e[a.$$intervalId].reject("canceled"),clearInterval(a.$$intervalId),delete e[a.$$intervalId],!0):!1};return d}]}function ad(){this.$get=function(){return{id:"en-us",
NUMBER_FORMATS:{DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{minInt:1,minFrac:0,maxFrac:3,posPre:"",posSuf:"",negPre:"-",negSuf:"",gSize:3,lgSize:3},{minInt:1,minFrac:2,maxFrac:2,posPre:"\u00a4",posSuf:"",negPre:"(\u00a4",negSuf:")",gSize:3,lgSize:3}],CURRENCY_SYM:"$"},DATETIME_FORMATS:{MONTH:"January February March April May June July August September October November December".split(" "),SHORTMONTH:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),DAY:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
SHORTDAY:"Sun Mon Tue Wed Thu Fri Sat".split(" "),AMPMS:["AM","PM"],medium:"MMM d, y h:mm:ss a","short":"M/d/yy h:mm a",fullDate:"EEEE, MMMM d, y",longDate:"MMMM d, y",mediumDate:"MMM d, y",shortDate:"M/d/yy",mediumTime:"h:mm:ss a",shortTime:"h:mm a"},pluralCat:function(b){return 1===b?"one":"other"}}}}function Nb(b){b=b.split("/");for(var a=b.length;a--;)b[a]=gb(b[a]);return b.join("/")}function Ac(b,a,c){b=sa(b,c);a.$$protocol=b.protocol;a.$$host=b.hostname;a.$$port=Z(b.port)||xe[b.protocol]||null}
function Bc(b,a,c){var d="/"!==b.charAt(0);d&&(b="/"+b);b=sa(b,c);a.$$path=decodeURIComponent(d&&"/"===b.pathname.charAt(0)?b.pathname.substring(1):b.pathname);a.$$search=cc(b.search);a.$$hash=decodeURIComponent(b.hash);a.$$path&&"/"!=a.$$path.charAt(0)&&(a.$$path="/"+a.$$path)}function pa(b,a){if(0===a.indexOf(b))return a.substr(b.length)}function $a(b){var a=b.indexOf("#");return-1==a?b:b.substr(0,a)}function Ob(b){return b.substr(0,$a(b).lastIndexOf("/")+1)}function Cc(b,a){this.$$html5=!0;a=a||
"";var c=Ob(b);Ac(b,this,b);this.$$parse=function(a){var e=pa(c,a);if(!C(e))throw Pb("ipthprfx",a,c);Bc(e,this,b);this.$$path||(this.$$path="/");this.$$compose()};this.$$compose=function(){var a=Bb(this.$$search),b=this.$$hash?"#"+gb(this.$$hash):"";this.$$url=Nb(this.$$path)+(a?"?"+a:"")+b;this.$$absUrl=c+this.$$url.substr(1)};this.$$rewrite=function(d){var e;if((e=pa(b,d))!==s)return d=e,(e=pa(a,e))!==s?c+(pa("/",e)||e):b+d;if((e=pa(c,d))!==s)return c+e;if(c==d+"/")return c}}function Qb(b,a){var c=
Ob(b);Ac(b,this,b);this.$$parse=function(d){var e=pa(b,d)||pa(c,d),e="#"==e.charAt(0)?pa(a,e):this.$$html5?e:"";if(!C(e))throw Pb("ihshprfx",d,a);Bc(e,this,b);d=this.$$path;var g=/^\/[A-Z]:(\/.*)/;0===e.indexOf(b)&&(e=e.replace(b,""));g.exec(e)||(d=(e=g.exec(d))?e[1]:d);this.$$path=d;this.$$compose()};this.$$compose=function(){var c=Bb(this.$$search),e=this.$$hash?"#"+gb(this.$$hash):"";this.$$url=Nb(this.$$path)+(c?"?"+c:"")+e;this.$$absUrl=b+(this.$$url?a+this.$$url:"")};this.$$rewrite=function(a){if($a(b)==
$a(a))return a}}function Rb(b,a){this.$$html5=!0;Qb.apply(this,arguments);var c=Ob(b);this.$$rewrite=function(d){var e;if(b==$a(d))return d;if(e=pa(c,d))return b+a+e;if(c===d+"/")return c};this.$$compose=function(){var c=Bb(this.$$search),e=this.$$hash?"#"+gb(this.$$hash):"";this.$$url=Nb(this.$$path)+(c?"?"+c:"")+e;this.$$absUrl=b+a+this.$$url}}function qb(b){return function(){return this[b]}}function Dc(b,a){return function(c){if(D(c))return this[b];this[b]=a(c);this.$$compose();return this}}function Vd(){var b=
"",a=!1;this.hashPrefix=function(a){return B(a)?(b=a,this):b};this.html5Mode=function(b){return B(b)?(a=b,this):a};this.$get=["$rootScope","$browser","$sniffer","$rootElement",function(c,d,e,g){function f(a){c.$broadcast("$locationChangeSuccess",k.absUrl(),a)}var k,m,h=d.baseHref(),l=d.url(),n;a?(n=l.substring(0,l.indexOf("/",l.indexOf("//")+2))+(h||"/"),m=e.history?Cc:Rb):(n=$a(l),m=Qb);k=new m(n,"#"+b);k.$$parse(k.$$rewrite(l));g.on("click",function(a){if(!a.ctrlKey&&!a.metaKey&&2!=a.which){for(var e=
w(a.target);"a"!==L(e[0].nodeName);)if(e[0]===g[0]||!(e=e.parent())[0])return;var f=e.prop("href");U(f)&&"[object SVGAnimatedString]"===f.toString()&&(f=sa(f.animVal).href);if(m===Rb){var h=e.attr("href")||e.attr("xlink:href");if(0>h.indexOf("://"))if(f="#"+b,"/"==h[0])f=n+f+h;else if("#"==h[0])f=n+f+(k.path()||"/")+h;else{for(var l=k.path().split("/"),h=h.split("/"),p=0;p<h.length;p++)"."!=h[p]&&(".."==h[p]?l.pop():h[p].length&&l.push(h[p]));f=n+f+l.join("/")}}l=k.$$rewrite(f);f&&(!e.attr("target")&&
l&&!a.isDefaultPrevented())&&(a.preventDefault(),l!=d.url()&&(k.$$parse(l),c.$apply(),T.angular["ff-684208-preventDefault"]=!0))}});k.absUrl()!=l&&d.url(k.absUrl(),!0);d.onUrlChange(function(a){k.absUrl()!=a&&(c.$evalAsync(function(){var b=k.absUrl();k.$$parse(a);c.$broadcast("$locationChangeStart",a,b).defaultPrevented?(k.$$parse(b),d.url(b)):f(b)}),c.$$phase||c.$digest())});var p=0;c.$watch(function(){var a=d.url(),b=k.$$replace;p&&a==k.absUrl()||(p++,c.$evalAsync(function(){c.$broadcast("$locationChangeStart",
k.absUrl(),a).defaultPrevented?k.$$parse(a):(d.url(k.absUrl(),b),f(a))}));k.$$replace=!1;return p});return k}]}function Wd(){var b=!0,a=this;this.debugEnabled=function(a){return B(a)?(b=a,this):b};this.$get=["$window",function(c){function d(a){a instanceof Error&&(a.stack?a=a.message&&-1===a.stack.indexOf(a.message)?"Error: "+a.message+"\n"+a.stack:a.stack:a.sourceURL&&(a=a.message+"\n"+a.sourceURL+":"+a.line));return a}function e(a){var b=c.console||{},e=b[a]||b.log||y;a=!1;try{a=!!e.apply}catch(m){}return a?
function(){var a=[];q(arguments,function(b){a.push(d(b))});return e.apply(b,a)}:function(a,b){e(a,null==b?"":b)}}return{log:e("log"),info:e("info"),warn:e("warn"),error:e("error"),debug:function(){var c=e("debug");return function(){b&&c.apply(a,arguments)}}()}}]}function ea(b,a){if("constructor"===b)throw Da("isecfld",a);return b}function ab(b,a){if(b){if(b.constructor===b)throw Da("isecfn",a);if(b.document&&b.location&&b.alert&&b.setInterval)throw Da("isecwindow",a);if(b.children&&(b.nodeName||b.prop&&
b.attr&&b.find))throw Da("isecdom",a);}return b}function rb(b,a,c,d,e){e=e||{};a=a.split(".");for(var g,f=0;1<a.length;f++){g=ea(a.shift(),d);var k=b[g];k||(k={},b[g]=k);b=k;b.then&&e.unwrapPromises&&(ta(d),"$$v"in b||function(a){a.then(function(b){a.$$v=b})}(b),b.$$v===s&&(b.$$v={}),b=b.$$v)}g=ea(a.shift(),d);return b[g]=c}function Ec(b,a,c,d,e,g,f){ea(b,g);ea(a,g);ea(c,g);ea(d,g);ea(e,g);return f.unwrapPromises?function(f,m){var h=m&&m.hasOwnProperty(b)?m:f,l;if(null==h)return h;(h=h[b])&&h.then&&
(ta(g),"$$v"in h||(l=h,l.$$v=s,l.then(function(a){l.$$v=a})),h=h.$$v);if(!a)return h;if(null==h)return s;(h=h[a])&&h.then&&(ta(g),"$$v"in h||(l=h,l.$$v=s,l.then(function(a){l.$$v=a})),h=h.$$v);if(!c)return h;if(null==h)return s;(h=h[c])&&h.then&&(ta(g),"$$v"in h||(l=h,l.$$v=s,l.then(function(a){l.$$v=a})),h=h.$$v);if(!d)return h;if(null==h)return s;(h=h[d])&&h.then&&(ta(g),"$$v"in h||(l=h,l.$$v=s,l.then(function(a){l.$$v=a})),h=h.$$v);if(!e)return h;if(null==h)return s;(h=h[e])&&h.then&&(ta(g),"$$v"in
h||(l=h,l.$$v=s,l.then(function(a){l.$$v=a})),h=h.$$v);return h}:function(g,f){var h=f&&f.hasOwnProperty(b)?f:g;if(null==h)return h;h=h[b];if(!a)return h;if(null==h)return s;h=h[a];if(!c)return h;if(null==h)return s;h=h[c];if(!d)return h;if(null==h)return s;h=h[d];return e?null==h?s:h=h[e]:h}}function ye(b,a){ea(b,a);return function(a,d){return null==a?s:(d&&d.hasOwnProperty(b)?d:a)[b]}}function ze(b,a,c){ea(b,c);ea(a,c);return function(c,e){if(null==c)return s;c=(e&&e.hasOwnProperty(b)?e:c)[b];return null==
c?s:c[a]}}function Fc(b,a,c){if(Sb.hasOwnProperty(b))return Sb[b];var d=b.split("."),e=d.length,g;if(a.unwrapPromises||1!==e)if(a.unwrapPromises||2!==e)if(a.csp)g=6>e?Ec(d[0],d[1],d[2],d[3],d[4],c,a):function(b,g){var f=0,k;do k=Ec(d[f++],d[f++],d[f++],d[f++],d[f++],c,a)(b,g),g=s,b=k;while(f<e);return k};else{var f="var p;\n";q(d,function(b,d){ea(b,c);f+="if(s == null) return undefined;\ns="+(d?"s":'((k&&k.hasOwnProperty("'+b+'"))?k:s)')+'["'+b+'"];\n'+(a.unwrapPromises?'if (s && s.then) {\n pw("'+
c.replace(/(["\r\n])/g,"\\$1")+'");\n if (!("$$v" in s)) {\n p=s;\n p.$$v = undefined;\n p.then(function(v) {p.$$v=v;});\n}\n s=s.$$v\n}\n':"")});var f=f+"return s;",k=new Function("s","k","pw",f);k.toString=$(f);g=a.unwrapPromises?function(a,b){return k(a,b,ta)}:k}else g=ze(d[0],d[1],c);else g=ye(d[0],c);"hasOwnProperty"!==b&&(Sb[b]=g);return g}function Xd(){var b={},a={csp:!1,unwrapPromises:!1,logPromiseWarnings:!0};this.unwrapPromises=function(b){return B(b)?(a.unwrapPromises=!!b,this):a.unwrapPromises};
this.logPromiseWarnings=function(b){return B(b)?(a.logPromiseWarnings=b,this):a.logPromiseWarnings};this.$get=["$filter","$sniffer","$log",function(c,d,e){a.csp=d.csp;ta=function(b){a.logPromiseWarnings&&!Gc.hasOwnProperty(b)&&(Gc[b]=!0,e.warn("[$parse] Promise found in the expression `"+b+"`. Automatic unwrapping of promises in Angular expressions is deprecated."))};return function(d){var e;switch(typeof d){case "string":if(b.hasOwnProperty(d))return b[d];e=new Tb(a);e=(new bb(e,c,a)).parse(d);"hasOwnProperty"!==
d&&(b[d]=e);return e;case "function":return d;default:return y}}}]}function Zd(){this.$get=["$rootScope","$exceptionHandler",function(b,a){return Ae(function(a){b.$evalAsync(a)},a)}]}function Ae(b,a){function c(a){return a}function d(a){return f(a)}var e=function(){var f=[],h,l;return l={resolve:function(a){if(f){var c=f;f=s;h=g(a);c.length&&b(function(){for(var a,b=0,d=c.length;b<d;b++)a=c[b],h.then(a[0],a[1],a[2])})}},reject:function(a){l.resolve(k(a))},notify:function(a){if(f){var c=f;f.length&&
b(function(){for(var b,d=0,e=c.length;d<e;d++)b=c[d],b[2](a)})}},promise:{then:function(b,g,k){var l=e(),I=function(d){try{l.resolve((Q(b)?b:c)(d))}catch(e){l.reject(e),a(e)}},x=function(b){try{l.resolve((Q(g)?g:d)(b))}catch(c){l.reject(c),a(c)}},u=function(b){try{l.notify((Q(k)?k:c)(b))}catch(d){a(d)}};f?f.push([I,x,u]):h.then(I,x,u);return l.promise},"catch":function(a){return this.then(null,a)},"finally":function(a){function b(a,c){var d=e();c?d.resolve(a):d.reject(a);return d.promise}function d(e,
g){var f=null;try{f=(a||c)()}catch(k){return b(k,!1)}return f&&Q(f.then)?f.then(function(){return b(e,g)},function(a){return b(a,!1)}):b(e,g)}return this.then(function(a){return d(a,!0)},function(a){return d(a,!1)})}}}},g=function(a){return a&&Q(a.then)?a:{then:function(c){var d=e();b(function(){d.resolve(c(a))});return d.promise}}},f=function(a){var b=e();b.reject(a);return b.promise},k=function(c){return{then:function(g,f){var k=e();b(function(){try{k.resolve((Q(f)?f:d)(c))}catch(b){k.reject(b),
a(b)}});return k.promise}}};return{defer:e,reject:f,when:function(k,h,l,n){var p=e(),r,v=function(b){try{return(Q(h)?h:c)(b)}catch(d){return a(d),f(d)}},I=function(b){try{return(Q(l)?l:d)(b)}catch(c){return a(c),f(c)}},x=function(b){try{return(Q(n)?n:c)(b)}catch(d){a(d)}};b(function(){g(k).then(function(a){r||(r=!0,p.resolve(g(a).then(v,I,x)))},function(a){r||(r=!0,p.resolve(I(a)))},function(a){r||p.notify(x(a))})});return p.promise},all:function(a){var b=e(),c=0,d=O(a)?[]:{};q(a,function(a,e){c++;
g(a).then(function(a){d.hasOwnProperty(e)||(d[e]=a,--c||b.resolve(d))},function(a){d.hasOwnProperty(e)||b.reject(a)})});0===c&&b.resolve(d);return b.promise}}}function fe(){this.$get=["$window","$timeout",function(b,a){var c=b.requestAnimationFrame||b.webkitRequestAnimationFrame||b.mozRequestAnimationFrame,d=b.cancelAnimationFrame||b.webkitCancelAnimationFrame||b.mozCancelAnimationFrame||b.webkitCancelRequestAnimationFrame,e=!!c,g=e?function(a){var b=c(a);return function(){d(b)}}:function(b){var c=
a(b,16.66,!1);return function(){a.cancel(c)}};g.supported=e;return g}]}function Yd(){var b=10,a=t("$rootScope"),c=null;this.digestTtl=function(a){arguments.length&&(b=a);return b};this.$get=["$injector","$exceptionHandler","$parse","$browser",function(d,e,g,f){function k(){this.$id=eb();this.$$phase=this.$parent=this.$$watchers=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null;this["this"]=this.$root=this;this.$$destroyed=!1;this.$$asyncQueue=[];this.$$postDigestQueue=[];
this.$$listeners={};this.$$listenerCount={};this.$$isolateBindings={}}function m(b){if(p.$$phase)throw a("inprog",p.$$phase);p.$$phase=b}function h(a,b){var c=g(a);Ta(c,b);return c}function l(a,b,c){do a.$$listenerCount[c]-=b,0===a.$$listenerCount[c]&&delete a.$$listenerCount[c];while(a=a.$parent)}function n(){}k.prototype={constructor:k,$new:function(a){a?(a=new k,a.$root=this.$root,a.$$asyncQueue=this.$$asyncQueue,a.$$postDigestQueue=this.$$postDigestQueue):(this.$$childScopeClass||(this.$$childScopeClass=
function(){this.$$watchers=this.$$nextSibling=this.$$childHead=this.$$childTail=null;this.$$listeners={};this.$$listenerCount={};this.$id=eb();this.$$childScopeClass=null},this.$$childScopeClass.prototype=this),a=new this.$$childScopeClass);a["this"]=a;a.$parent=this;a.$$prevSibling=this.$$childTail;this.$$childHead?this.$$childTail=this.$$childTail.$$nextSibling=a:this.$$childHead=this.$$childTail=a;return a},$watch:function(a,b,d){var e=h(a,"watch"),g=this.$$watchers,f={fn:b,last:n,get:e,exp:a,
eq:!!d};c=null;if(!Q(b)){var k=h(b||y,"listener");f.fn=function(a,b,c){k(c)}}if("string"==typeof a&&e.constant){var m=f.fn;f.fn=function(a,b,c){m.call(this,a,b,c);Pa(g,f)}}g||(g=this.$$watchers=[]);g.unshift(f);return function(){Pa(g,f);c=null}},$watchCollection:function(a,b){var c=this,d,e,f,k=1<b.length,h=0,m=g(a),l=[],n={},p=!0,q=0;return this.$watch(function(){d=m(c);var a,b;if(U(d))if(db(d))for(e!==l&&(e=l,q=e.length=0,h++),a=d.length,q!==a&&(h++,e.length=q=a),b=0;b<a;b++)e[b]!==e[b]&&d[b]!==
d[b]||e[b]===d[b]||(h++,e[b]=d[b]);else{e!==n&&(e=n={},q=0,h++);a=0;for(b in d)d.hasOwnProperty(b)&&(a++,e.hasOwnProperty(b)?e[b]!==d[b]&&(h++,e[b]=d[b]):(q++,e[b]=d[b],h++));if(q>a)for(b in h++,e)e.hasOwnProperty(b)&&!d.hasOwnProperty(b)&&(q--,delete e[b])}else e!==d&&(e=d,h++);return h},function(){p?(p=!1,b(d,d,c)):b(d,f,c);if(k)if(U(d))if(db(d)){f=Array(d.length);for(var a=0;a<d.length;a++)f[a]=d[a]}else for(a in f={},d)zb.call(d,a)&&(f[a]=d[a]);else f=d})},$digest:function(){var d,g,f,k,h=this.$$asyncQueue,
l=this.$$postDigestQueue,q,z,s=b,P,N=[],w,E,A;m("$digest");c=null;do{z=!1;for(P=this;h.length;){try{A=h.shift(),A.scope.$eval(A.expression)}catch(H){p.$$phase=null,e(H)}c=null}a:do{if(k=P.$$watchers)for(q=k.length;q--;)try{if(d=k[q])if((g=d.get(P))!==(f=d.last)&&!(d.eq?xa(g,f):"number"==typeof g&&"number"==typeof f&&isNaN(g)&&isNaN(f)))z=!0,c=d,d.last=d.eq?Ga(g,null):g,d.fn(g,f===n?g:f,P),5>s&&(w=4-s,N[w]||(N[w]=[]),E=Q(d.exp)?"fn: "+(d.exp.name||d.exp.toString()):d.exp,E+="; newVal: "+ra(g)+"; oldVal: "+
ra(f),N[w].push(E));else if(d===c){z=!1;break a}}catch(B){p.$$phase=null,e(B)}if(!(k=P.$$childHead||P!==this&&P.$$nextSibling))for(;P!==this&&!(k=P.$$nextSibling);)P=P.$parent}while(P=k);if((z||h.length)&&!s--)throw p.$$phase=null,a("infdig",b,ra(N));}while(z||h.length);for(p.$$phase=null;l.length;)try{l.shift()()}catch(t){e(t)}},$destroy:function(){if(!this.$$destroyed){var a=this.$parent;this.$broadcast("$destroy");this.$$destroyed=!0;this!==p&&(q(this.$$listenerCount,Ab(null,l,this)),a.$$childHead==
this&&(a.$$childHead=this.$$nextSibling),a.$$childTail==this&&(a.$$childTail=this.$$prevSibling),this.$$prevSibling&&(this.$$prevSibling.$$nextSibling=this.$$nextSibling),this.$$nextSibling&&(this.$$nextSibling.$$prevSibling=this.$$prevSibling),this.$parent=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=this.$root=null,this.$$listeners={},this.$$watchers=this.$$asyncQueue=this.$$postDigestQueue=[],this.$destroy=this.$digest=this.$apply=y,this.$on=this.$watch=function(){return y})}},
$eval:function(a,b){return g(a)(this,b)},$evalAsync:function(a){p.$$phase||p.$$asyncQueue.length||f.defer(function(){p.$$asyncQueue.length&&p.$digest()});this.$$asyncQueue.push({scope:this,expression:a})},$$postDigest:function(a){this.$$postDigestQueue.push(a)},$apply:function(a){try{return m("$apply"),this.$eval(a)}catch(b){e(b)}finally{p.$$phase=null;try{p.$digest()}catch(c){throw e(c),c;}}},$on:function(a,b){var c=this.$$listeners[a];c||(this.$$listeners[a]=c=[]);c.push(b);var d=this;do d.$$listenerCount[a]||
(d.$$listenerCount[a]=0),d.$$listenerCount[a]++;while(d=d.$parent);var e=this;return function(){c[Oa(c,b)]=null;l(e,1,a)}},$emit:function(a,b){var c=[],d,g=this,f=!1,k={name:a,targetScope:g,stopPropagation:function(){f=!0},preventDefault:function(){k.defaultPrevented=!0},defaultPrevented:!1},h=[k].concat(ya.call(arguments,1)),m,l;do{d=g.$$listeners[a]||c;k.currentScope=g;m=0;for(l=d.length;m<l;m++)if(d[m])try{d[m].apply(null,h)}catch(n){e(n)}else d.splice(m,1),m--,l--;if(f)break;g=g.$parent}while(g);
return k},$broadcast:function(a,b){for(var c=this,d=this,g={name:a,targetScope:this,preventDefault:function(){g.defaultPrevented=!0},defaultPrevented:!1},f=[g].concat(ya.call(arguments,1)),k,h;c=d;){g.currentScope=c;d=c.$$listeners[a]||[];k=0;for(h=d.length;k<h;k++)if(d[k])try{d[k].apply(null,f)}catch(m){e(m)}else d.splice(k,1),k--,h--;if(!(d=c.$$listenerCount[a]&&c.$$childHead||c!==this&&c.$$nextSibling))for(;c!==this&&!(d=c.$$nextSibling);)c=c.$parent}return g}};var p=new k;return p}]}function bd(){var b=
/^\s*(https?|ftp|mailto|tel|file):/,a=/^\s*(https?|ftp|file):|data:image\//;this.aHrefSanitizationWhitelist=function(a){return B(a)?(b=a,this):b};this.imgSrcSanitizationWhitelist=function(b){return B(b)?(a=b,this):a};this.$get=function(){return function(c,d){var e=d?a:b,g;if(!S||8<=S)if(g=sa(c).href,""!==g&&!g.match(e))return"unsafe:"+g;return c}}}function Be(b){if("self"===b)return b;if(C(b)){if(-1<b.indexOf("***"))throw ua("iwcard",b);b=b.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,
"\\x08").replace("\\*\\*",".*").replace("\\*","[^:/.?&;]*");return RegExp("^"+b+"$")}if(fb(b))return RegExp("^"+b.source+"$");throw ua("imatcher");}function Hc(b){var a=[];B(b)&&q(b,function(b){a.push(Be(b))});return a}function ae(){this.SCE_CONTEXTS=fa;var b=["self"],a=[];this.resourceUrlWhitelist=function(a){arguments.length&&(b=Hc(a));return b};this.resourceUrlBlacklist=function(b){arguments.length&&(a=Hc(b));return a};this.$get=["$injector",function(c){function d(a){var b=function(a){this.$$unwrapTrustedValue=
function(){return a}};a&&(b.prototype=new a);b.prototype.valueOf=function(){return this.$$unwrapTrustedValue()};b.prototype.toString=function(){return this.$$unwrapTrustedValue().toString()};return b}var e=function(a){throw ua("unsafe");};c.has("$sanitize")&&(e=c.get("$sanitize"));var g=d(),f={};f[fa.HTML]=d(g);f[fa.CSS]=d(g);f[fa.URL]=d(g);f[fa.JS]=d(g);f[fa.RESOURCE_URL]=d(f[fa.URL]);return{trustAs:function(a,b){var c=f.hasOwnProperty(a)?f[a]:null;if(!c)throw ua("icontext",a,b);if(null===b||b===
s||""===b)return b;if("string"!==typeof b)throw ua("itype",a);return new c(b)},getTrusted:function(c,d){if(null===d||d===s||""===d)return d;var g=f.hasOwnProperty(c)?f[c]:null;if(g&&d instanceof g)return d.$$unwrapTrustedValue();if(c===fa.RESOURCE_URL){var g=sa(d.toString()),l,n,p=!1;l=0;for(n=b.length;l<n;l++)if("self"===b[l]?Mb(g):b[l].exec(g.href)){p=!0;break}if(p)for(l=0,n=a.length;l<n;l++)if("self"===a[l]?Mb(g):a[l].exec(g.href)){p=!1;break}if(p)return d;throw ua("insecurl",d.toString());}if(c===
fa.HTML)return e(d);throw ua("unsafe");},valueOf:function(a){return a instanceof g?a.$$unwrapTrustedValue():a}}}]}function $d(){var b=!0;this.enabled=function(a){arguments.length&&(b=!!a);return b};this.$get=["$parse","$sniffer","$sceDelegate",function(a,c,d){if(b&&c.msie&&8>c.msieDocumentMode)throw ua("iequirks");var e=ka(fa);e.isEnabled=function(){return b};e.trustAs=d.trustAs;e.getTrusted=d.getTrusted;e.valueOf=d.valueOf;b||(e.trustAs=e.getTrusted=function(a,b){return b},e.valueOf=Fa);e.parseAs=
function(b,c){var d=a(c);return d.literal&&d.constant?d:function(a,c){return e.getTrusted(b,d(a,c))}};var g=e.parseAs,f=e.getTrusted,k=e.trustAs;q(fa,function(a,b){var c=L(b);e[Va("parse_as_"+c)]=function(b){return g(a,b)};e[Va("get_trusted_"+c)]=function(b){return f(a,b)};e[Va("trust_as_"+c)]=function(b){return k(a,b)}});return e}]}function be(){this.$get=["$window","$document",function(b,a){var c={},d=Z((/android (\d+)/.exec(L((b.navigator||{}).userAgent))||[])[1]),e=/Boxee/i.test((b.navigator||
{}).userAgent),g=a[0]||{},f=g.documentMode,k,m=/^(Moz|webkit|O|ms)(?=[A-Z])/,h=g.body&&g.body.style,l=!1,n=!1;if(h){for(var p in h)if(l=m.exec(p)){k=l[0];k=k.substr(0,1).toUpperCase()+k.substr(1);break}k||(k="WebkitOpacity"in h&&"webkit");l=!!("transition"in h||k+"Transition"in h);n=!!("animation"in h||k+"Animation"in h);!d||l&&n||(l=C(g.body.style.webkitTransition),n=C(g.body.style.webkitAnimation))}return{history:!(!b.history||!b.history.pushState||4>d||e),hashchange:"onhashchange"in b&&(!f||7<
f),hasEvent:function(a){if("input"==a&&9==S)return!1;if(D(c[a])){var b=g.createElement("div");c[a]="on"+a in b}return c[a]},csp:$b(),vendorPrefix:k,transitions:l,animations:n,android:d,msie:S,msieDocumentMode:f}}]}function de(){this.$get=["$rootScope","$browser","$q","$exceptionHandler",function(b,a,c,d){function e(e,k,m){var h=c.defer(),l=h.promise,n=B(m)&&!m;k=a.defer(function(){try{h.resolve(e())}catch(a){h.reject(a),d(a)}finally{delete g[l.$$timeoutId]}n||b.$apply()},k);l.$$timeoutId=k;g[k]=h;
return l}var g={};e.cancel=function(b){return b&&b.$$timeoutId in g?(g[b.$$timeoutId].reject("canceled"),delete g[b.$$timeoutId],a.defer.cancel(b.$$timeoutId)):!1};return e}]}function sa(b,a){var c=b;S&&(W.setAttribute("href",c),c=W.href);W.setAttribute("href",c);return{href:W.href,protocol:W.protocol?W.protocol.replace(/:$/,""):"",host:W.host,search:W.search?W.search.replace(/^\?/,""):"",hash:W.hash?W.hash.replace(/^#/,""):"",hostname:W.hostname,port:W.port,pathname:"/"===W.pathname.charAt(0)?W.pathname:
"/"+W.pathname}}function Mb(b){b=C(b)?sa(b):b;return b.protocol===Ic.protocol&&b.host===Ic.host}function ee(){this.$get=$(T)}function kc(b){function a(d,e){if(U(d)){var g={};q(d,function(b,c){g[c]=a(c,b)});return g}return b.factory(d+c,e)}var c="Filter";this.register=a;this.$get=["$injector",function(a){return function(b){return a.get(b+c)}}];a("currency",Jc);a("date",Kc);a("filter",Ce);a("json",De);a("limitTo",Ee);a("lowercase",Fe);a("number",Lc);a("orderBy",Mc);a("uppercase",Ge)}function Ce(){return function(b,
a,c){if(!O(b))return b;var d=typeof c,e=[];e.check=function(a){for(var b=0;b<e.length;b++)if(!e[b](a))return!1;return!0};"function"!==d&&(c="boolean"===d&&c?function(a,b){return Sa.equals(a,b)}:function(a,b){if(a&&b&&"object"===typeof a&&"object"===typeof b){for(var d in a)if("$"!==d.charAt(0)&&zb.call(a,d)&&c(a[d],b[d]))return!0;return!1}b=(""+b).toLowerCase();return-1<(""+a).toLowerCase().indexOf(b)});var g=function(a,b){if("string"==typeof b&&"!"===b.charAt(0))return!g(a,b.substr(1));switch(typeof a){case "boolean":case "number":case "string":return c(a,
b);case "object":switch(typeof b){case "object":return c(a,b);default:for(var d in a)if("$"!==d.charAt(0)&&g(a[d],b))return!0}return!1;case "array":for(d=0;d<a.length;d++)if(g(a[d],b))return!0;return!1;default:return!1}};switch(typeof a){case "boolean":case "number":case "string":a={$:a};case "object":for(var f in a)(function(b){"undefined"!=typeof a[b]&&e.push(function(c){return g("$"==b?c:c&&c[b],a[b])})})(f);break;case "function":e.push(a);break;default:return b}d=[];for(f=0;f<b.length;f++){var k=
b[f];e.check(k)&&d.push(k)}return d}}function Jc(b){var a=b.NUMBER_FORMATS;return function(b,d){D(d)&&(d=a.CURRENCY_SYM);return Nc(b,a.PATTERNS[1],a.GROUP_SEP,a.DECIMAL_SEP,2).replace(/\u00A4/g,d)}}function Lc(b){var a=b.NUMBER_FORMATS;return function(b,d){return Nc(b,a.PATTERNS[0],a.GROUP_SEP,a.DECIMAL_SEP,d)}}function Nc(b,a,c,d,e){if(null==b||!isFinite(b)||U(b))return"";var g=0>b;b=Math.abs(b);var f=b+"",k="",m=[],h=!1;if(-1!==f.indexOf("e")){var l=f.match(/([\d\.]+)e(-?)(\d+)/);l&&"-"==l[2]&&
l[3]>e+1?f="0":(k=f,h=!0)}if(h)0<e&&(-1<b&&1>b)&&(k=b.toFixed(e));else{f=(f.split(Oc)[1]||"").length;D(e)&&(e=Math.min(Math.max(a.minFrac,f),a.maxFrac));f=Math.pow(10,e+1);b=Math.floor(b*f+5)/f;b=(""+b).split(Oc);f=b[0];b=b[1]||"";var l=0,n=a.lgSize,p=a.gSize;if(f.length>=n+p)for(l=f.length-n,h=0;h<l;h++)0===(l-h)%p&&0!==h&&(k+=c),k+=f.charAt(h);for(h=l;h<f.length;h++)0===(f.length-h)%n&&0!==h&&(k+=c),k+=f.charAt(h);for(;b.length<e;)b+="0";e&&"0"!==e&&(k+=d+b.substr(0,e))}m.push(g?a.negPre:a.posPre);
m.push(k);m.push(g?a.negSuf:a.posSuf);return m.join("")}function Ub(b,a,c){var d="";0>b&&(d="-",b=-b);for(b=""+b;b.length<a;)b="0"+b;c&&(b=b.substr(b.length-a));return d+b}function Y(b,a,c,d){c=c||0;return function(e){e=e["get"+b]();if(0<c||e>-c)e+=c;0===e&&-12==c&&(e=12);return Ub(e,a,d)}}function sb(b,a){return function(c,d){var e=c["get"+b](),g=Ha(a?"SHORT"+b:b);return d[g][e]}}function Kc(b){function a(a){var b;if(b=a.match(c)){a=new Date(0);var g=0,f=0,k=b[8]?a.setUTCFullYear:a.setFullYear,m=
b[8]?a.setUTCHours:a.setHours;b[9]&&(g=Z(b[9]+b[10]),f=Z(b[9]+b[11]));k.call(a,Z(b[1]),Z(b[2])-1,Z(b[3]));g=Z(b[4]||0)-g;f=Z(b[5]||0)-f;k=Z(b[6]||0);b=Math.round(1E3*parseFloat("0."+(b[7]||0)));m.call(a,g,f,k,b)}return a}var c=/^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;return function(c,e){var g="",f=[],k,m;e=e||"mediumDate";e=b.DATETIME_FORMATS[e]||e;C(c)&&(c=He.test(c)?Z(c):a(c));yb(c)&&(c=new Date(c));if(!Na(c))return c;for(;e;)(m=Ie.exec(e))?
(f=f.concat(ya.call(m,1)),e=f.pop()):(f.push(e),e=null);q(f,function(a){k=Je[a];g+=k?k(c,b.DATETIME_FORMATS):a.replace(/(^'|'$)/g,"").replace(/''/g,"'")});return g}}function De(){return function(b){return ra(b,!0)}}function Ee(){return function(b,a){if(!O(b)&&!C(b))return b;a=Infinity===Math.abs(Number(a))?Number(a):Z(a);if(C(b))return a?0<=a?b.slice(0,a):b.slice(a,b.length):"";var c=[],d,e;a>b.length?a=b.length:a<-b.length&&(a=-b.length);0<a?(d=0,e=a):(d=b.length+a,e=b.length);for(;d<e;d++)c.push(b[d]);
return c}}function Mc(b){return function(a,c,d){function e(a,b){return Ra(b)?function(b,c){return a(c,b)}:a}function g(a,b){var c=typeof a,d=typeof b;return c==d?("string"==c&&(a=a.toLowerCase(),b=b.toLowerCase()),a===b?0:a<b?-1:1):c<d?-1:1}if(!O(a)||!c)return a;c=O(c)?c:[c];c=Uc(c,function(a){var c=!1,d=a||Fa;if(C(a)){if("+"==a.charAt(0)||"-"==a.charAt(0))c="-"==a.charAt(0),a=a.substring(1);d=b(a);if(d.constant){var f=d();return e(function(a,b){return g(a[f],b[f])},c)}}return e(function(a,b){return g(d(a),
d(b))},c)});for(var f=[],k=0;k<a.length;k++)f.push(a[k]);return f.sort(e(function(a,b){for(var d=0;d<c.length;d++){var e=c[d](a,b);if(0!==e)return e}return 0},d))}}function va(b){Q(b)&&(b={link:b});b.restrict=b.restrict||"AC";return $(b)}function Pc(b,a,c,d){function e(a,c){c=c?"-"+hb(c,"-"):"";d.removeClass(b,(a?tb:ub)+c);d.addClass(b,(a?ub:tb)+c)}var g=this,f=b.parent().controller("form")||vb,k=0,m=g.$error={},h=[];g.$name=a.name||a.ngForm;g.$dirty=!1;g.$pristine=!0;g.$valid=!0;g.$invalid=!1;f.$addControl(g);
b.addClass(Ma);e(!0);g.$addControl=function(a){Aa(a.$name,"input");h.push(a);a.$name&&(g[a.$name]=a)};g.$removeControl=function(a){a.$name&&g[a.$name]===a&&delete g[a.$name];q(m,function(b,c){g.$setValidity(c,!0,a)});Pa(h,a)};g.$setValidity=function(a,b,c){var d=m[a];if(b)d&&(Pa(d,c),d.length||(k--,k||(e(b),g.$valid=!0,g.$invalid=!1),m[a]=!1,e(!0,a),f.$setValidity(a,!0,g)));else{k||e(b);if(d){if(-1!=Oa(d,c))return}else m[a]=d=[],k++,e(!1,a),f.$setValidity(a,!1,g);d.push(c);g.$valid=!1;g.$invalid=
!0}};g.$setDirty=function(){d.removeClass(b,Ma);d.addClass(b,wb);g.$dirty=!0;g.$pristine=!1;f.$setDirty()};g.$setPristine=function(){d.removeClass(b,wb);d.addClass(b,Ma);g.$dirty=!1;g.$pristine=!0;q(h,function(a){a.$setPristine()})}}function qa(b,a,c,d){b.$setValidity(a,c);return c?d:s}function Ke(b,a,c){var d=c.prop("validity");U(d)&&b.$parsers.push(function(c){if(b.$error[a]||!(d.badInput||d.customError||d.typeMismatch)||d.valueMissing)return c;b.$setValidity(a,!1)})}function xb(b,a,c,d,e,g){var f=
a.prop("validity"),k=a[0].placeholder,m={};if(!e.android){var h=!1;a.on("compositionstart",function(a){h=!0});a.on("compositionend",function(){h=!1;l()})}var l=function(e){if(!h){var g=a.val();if(S&&"input"===(e||m).type&&a[0].placeholder!==k)k=a[0].placeholder;else if(Ra(c.ngTrim||"T")&&(g=aa(g)),d.$viewValue!==g||f&&""===g&&!f.valueMissing)b.$$phase?d.$setViewValue(g):b.$apply(function(){d.$setViewValue(g)})}};if(e.hasEvent("input"))a.on("input",l);else{var n,p=function(){n||(n=g.defer(function(){l();
n=null}))};a.on("keydown",function(a){a=a.keyCode;91===a||(15<a&&19>a||37<=a&&40>=a)||p()});if(e.hasEvent("paste"))a.on("paste cut",p)}a.on("change",l);d.$render=function(){a.val(d.$isEmpty(d.$viewValue)?"":d.$viewValue)};var r=c.ngPattern;r&&((e=r.match(/^\/(.*)\/([gim]*)$/))?(r=RegExp(e[1],e[2]),e=function(a){return qa(d,"pattern",d.$isEmpty(a)||r.test(a),a)}):e=function(c){var e=b.$eval(r);if(!e||!e.test)throw t("ngPattern")("noregexp",r,e,ga(a));return qa(d,"pattern",d.$isEmpty(c)||e.test(c),
c)},d.$formatters.push(e),d.$parsers.push(e));if(c.ngMinlength){var v=Z(c.ngMinlength);e=function(a){return qa(d,"minlength",d.$isEmpty(a)||a.length>=v,a)};d.$parsers.push(e);d.$formatters.push(e)}if(c.ngMaxlength){var q=Z(c.ngMaxlength);e=function(a){return qa(d,"maxlength",d.$isEmpty(a)||a.length<=q,a)};d.$parsers.push(e);d.$formatters.push(e)}}function Vb(b,a){b="ngClass"+b;return["$animate",function(c){function d(a,b){var c=[],d=0;a:for(;d<a.length;d++){for(var e=a[d],l=0;l<b.length;l++)if(e==
b[l])continue a;c.push(e)}return c}function e(a){if(!O(a)){if(C(a))return a.split(" ");if(U(a)){var b=[];q(a,function(a,c){a&&(b=b.concat(c.split(" ")))});return b}}return a}return{restrict:"AC",link:function(g,f,k){function m(a,b){var c=f.data("$classCounts")||{},d=[];q(a,function(a){if(0<b||c[a])c[a]=(c[a]||0)+b,c[a]===+(0<b)&&d.push(a)});f.data("$classCounts",c);return d.join(" ")}function h(b){if(!0===a||g.$index%2===a){var h=e(b||[]);if(!l){var r=m(h,1);k.$addClass(r)}else if(!xa(b,l)){var q=
e(l),r=d(h,q),h=d(q,h),h=m(h,-1),r=m(r,1);0===r.length?c.removeClass(f,h):0===h.length?c.addClass(f,r):c.setClass(f,r,h)}}l=ka(b)}var l;g.$watch(k[b],h,!0);k.$observe("class",function(a){h(g.$eval(k[b]))});"ngClass"!==b&&g.$watch("$index",function(c,d){var f=c&1;if(f!==(d&1)){var h=e(g.$eval(k[b]));f===a?(f=m(h,1),k.$addClass(f)):(f=m(h,-1),k.$removeClass(f))}})}}}]}var L=function(b){return C(b)?b.toLowerCase():b},zb=Object.prototype.hasOwnProperty,Ha=function(b){return C(b)?b.toUpperCase():b},S,
w,Ba,ya=[].slice,Le=[].push,wa=Object.prototype.toString,Qa=t("ng"),Sa=T.angular||(T.angular={}),Ua,La,ja=["0","0","0"];S=Z((/msie (\d+)/.exec(L(navigator.userAgent))||[])[1]);isNaN(S)&&(S=Z((/trident\/.*; rv:(\d+)/.exec(L(navigator.userAgent))||[])[1]));y.$inject=[];Fa.$inject=[];var O=function(){return Q(Array.isArray)?Array.isArray:function(b){return"[object Array]"===wa.call(b)}}(),aa=function(){return String.prototype.trim?function(b){return C(b)?b.trim():b}:function(b){return C(b)?b.replace(/^\s\s*/,
"").replace(/\s\s*$/,""):b}}();La=9>S?function(b){b=b.nodeName?b:b[0];return b.scopeName&&"HTML"!=b.scopeName?Ha(b.scopeName+":"+b.nodeName):b.nodeName}:function(b){return b.nodeName?b.nodeName:b[0].nodeName};var Xc=/[A-Z]/g,$c={full:"1.2.18",major:1,minor:2,dot:18,codeName:"ear-extendability"},Xa=R.cache={},ib=R.expando="ng"+(new Date).getTime(),me=1,pb=T.document.addEventListener?function(b,a,c){b.addEventListener(a,c,!1)}:function(b,a,c){b.attachEvent("on"+a,c)},Wa=T.document.removeEventListener?
function(b,a,c){b.removeEventListener(a,c,!1)}:function(b,a,c){b.detachEvent("on"+a,c)};R._data=function(b){return this.cache[b[this.expando]]||{}};var he=/([\:\-\_]+(.))/g,ie=/^moz([A-Z])/,Gb=t("jqLite"),je=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,Hb=/<|&#?\w+;/,ke=/<([\w:]+)/,le=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,da={option:[1,'<select multiple="multiple">',"</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>",
"</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};da.optgroup=da.option;da.tbody=da.tfoot=da.colgroup=da.caption=da.thead;da.th=da.td;var Ka=R.prototype={ready:function(b){function a(){c||(c=!0,b())}var c=!1;"complete"===V.readyState?setTimeout(a):(this.on("DOMContentLoaded",a),R(T).on("load",a))},toString:function(){var b=[];q(this,function(a){b.push(""+a)});return"["+b.join(", ")+"]"},eq:function(b){return 0<=b?w(this[b]):w(this[this.length+b])},length:0,
push:Le,sort:[].sort,splice:[].splice},mb={};q("multiple selected checked disabled readOnly required open".split(" "),function(b){mb[L(b)]=b});var rc={};q("input select option textarea button form details".split(" "),function(b){rc[Ha(b)]=!0});q({data:nc,inheritedData:lb,scope:function(b){return w(b).data("$scope")||lb(b.parentNode||b,["$isolateScope","$scope"])},isolateScope:function(b){return w(b).data("$isolateScope")||w(b).data("$isolateScopeNoTemplate")},controller:oc,injector:function(b){return lb(b,
"$injector")},removeAttr:function(b,a){b.removeAttribute(a)},hasClass:Kb,css:function(b,a,c){a=Va(a);if(B(c))b.style[a]=c;else{var d;8>=S&&(d=b.currentStyle&&b.currentStyle[a],""===d&&(d="auto"));d=d||b.style[a];8>=S&&(d=""===d?s:d);return d}},attr:function(b,a,c){var d=L(a);if(mb[d])if(B(c))c?(b[a]=!0,b.setAttribute(a,d)):(b[a]=!1,b.removeAttribute(d));else return b[a]||(b.attributes.getNamedItem(a)||y).specified?d:s;else if(B(c))b.setAttribute(a,c);else if(b.getAttribute)return b=b.getAttribute(a,
2),null===b?s:b},prop:function(b,a,c){if(B(c))b[a]=c;else return b[a]},text:function(){function b(b,d){var e=a[b.nodeType];if(D(d))return e?b[e]:"";b[e]=d}var a=[];9>S?(a[1]="innerText",a[3]="nodeValue"):a[1]=a[3]="textContent";b.$dv="";return b}(),val:function(b,a){if(D(a)){if("SELECT"===La(b)&&b.multiple){var c=[];q(b.options,function(a){a.selected&&c.push(a.value||a.text)});return 0===c.length?null:c}return b.value}b.value=a},html:function(b,a){if(D(a))return b.innerHTML;for(var c=0,d=b.childNodes;c<
d.length;c++)Ia(d[c]);b.innerHTML=a},empty:pc},function(b,a){R.prototype[a]=function(a,d){var e,g,f=this.length;if(b!==pc&&(2==b.length&&b!==Kb&&b!==oc?a:d)===s){if(U(a)){for(e=0;e<f;e++)if(b===nc)b(this[e],a);else for(g in a)b(this[e],g,a[g]);return this}e=b.$dv;f=e===s?Math.min(f,1):f;for(g=0;g<f;g++){var k=b(this[g],a,d);e=e?e+k:k}return e}for(e=0;e<f;e++)b(this[e],a,d);return this}});q({removeData:lc,dealoc:Ia,on:function a(c,d,e,g){if(B(g))throw Gb("onargs");var f=la(c,"events"),k=la(c,"handle");
f||la(c,"events",f={});k||la(c,"handle",k=ne(c,f));q(d.split(" "),function(d){var g=f[d];if(!g){if("mouseenter"==d||"mouseleave"==d){var l=V.body.contains||V.body.compareDocumentPosition?function(a,c){var d=9===a.nodeType?a.documentElement:a,e=c&&c.parentNode;return a===e||!!(e&&1===e.nodeType&&(d.contains?d.contains(e):a.compareDocumentPosition&&a.compareDocumentPosition(e)&16))}:function(a,c){if(c)for(;c=c.parentNode;)if(c===a)return!0;return!1};f[d]=[];a(c,{mouseleave:"mouseout",mouseenter:"mouseover"}[d],
function(a){var c=a.relatedTarget;c&&(c===this||l(this,c))||k(a,d)})}else pb(c,d,k),f[d]=[];g=f[d]}g.push(e)})},off:mc,one:function(a,c,d){a=w(a);a.on(c,function g(){a.off(c,d);a.off(c,g)});a.on(c,d)},replaceWith:function(a,c){var d,e=a.parentNode;Ia(a);q(new R(c),function(c){d?e.insertBefore(c,d.nextSibling):e.replaceChild(c,a);d=c})},children:function(a){var c=[];q(a.childNodes,function(a){1===a.nodeType&&c.push(a)});return c},contents:function(a){return a.contentDocument||a.childNodes||[]},append:function(a,
c){q(new R(c),function(c){1!==a.nodeType&&11!==a.nodeType||a.appendChild(c)})},prepend:function(a,c){if(1===a.nodeType){var d=a.firstChild;q(new R(c),function(c){a.insertBefore(c,d)})}},wrap:function(a,c){c=w(c)[0];var d=a.parentNode;d&&d.replaceChild(c,a);c.appendChild(a)},remove:function(a){Ia(a);var c=a.parentNode;c&&c.removeChild(a)},after:function(a,c){var d=a,e=a.parentNode;q(new R(c),function(a){e.insertBefore(a,d.nextSibling);d=a})},addClass:kb,removeClass:jb,toggleClass:function(a,c,d){c&&
q(c.split(" "),function(c){var g=d;D(g)&&(g=!Kb(a,c));(g?kb:jb)(a,c)})},parent:function(a){return(a=a.parentNode)&&11!==a.nodeType?a:null},next:function(a){if(a.nextElementSibling)return a.nextElementSibling;for(a=a.nextSibling;null!=a&&1!==a.nodeType;)a=a.nextSibling;return a},find:function(a,c){return a.getElementsByTagName?a.getElementsByTagName(c):[]},clone:Jb,triggerHandler:function(a,c,d){c=(la(a,"events")||{})[c];d=d||[];var e=[{preventDefault:y,stopPropagation:y}];q(c,function(c){c.apply(a,
e.concat(d))})}},function(a,c){R.prototype[c]=function(c,e,g){for(var f,k=0;k<this.length;k++)D(f)?(f=a(this[k],c,e,g),B(f)&&(f=w(f))):Ib(f,a(this[k],c,e,g));return B(f)?f:this};R.prototype.bind=R.prototype.on;R.prototype.unbind=R.prototype.off});Ya.prototype={put:function(a,c){this[Ja(a)]=c},get:function(a){return this[Ja(a)]},remove:function(a){var c=this[a=Ja(a)];delete this[a];return c}};var pe=/^function\s*[^\(]*\(\s*([^\)]*)\)/m,qe=/,/,re=/^\s*(_?)(\S+?)\1\s*$/,oe=/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
Za=t("$injector"),Me=t("$animate"),Ld=["$provide",function(a){this.$$selectors={};this.register=function(c,d){var e=c+"-animation";if(c&&"."!=c.charAt(0))throw Me("notcsel",c);this.$$selectors[c.substr(1)]=e;a.factory(e,d)};this.classNameFilter=function(a){1===arguments.length&&(this.$$classNameFilter=a instanceof RegExp?a:null);return this.$$classNameFilter};this.$get=["$timeout","$$asyncCallback",function(a,d){return{enter:function(a,c,f,k){f?f.after(a):(c&&c[0]||(c=f.parent()),c.append(a));k&&
d(k)},leave:function(a,c){a.remove();c&&d(c)},move:function(a,c,d,k){this.enter(a,c,d,k)},addClass:function(a,c,f){c=C(c)?c:O(c)?c.join(" "):"";q(a,function(a){kb(a,c)});f&&d(f)},removeClass:function(a,c,f){c=C(c)?c:O(c)?c.join(" "):"";q(a,function(a){jb(a,c)});f&&d(f)},setClass:function(a,c,f,k){q(a,function(a){kb(a,c);jb(a,f)});k&&d(k)},enabled:y}}]}],ia=t("$compile");gc.$inject=["$provide","$$sanitizeUriProvider"];var ue=/^(x[\:\-_]|data[\:\-_])/i,zc=t("$interpolate"),Ne=/^([^\?#]*)(\?([^#]*))?(#(.*))?$/,
xe={http:80,https:443,ftp:21},Pb=t("$location");Rb.prototype=Qb.prototype=Cc.prototype={$$html5:!1,$$replace:!1,absUrl:qb("$$absUrl"),url:function(a,c){if(D(a))return this.$$url;var d=Ne.exec(a);d[1]&&this.path(decodeURIComponent(d[1]));(d[2]||d[1])&&this.search(d[3]||"");this.hash(d[5]||"",c);return this},protocol:qb("$$protocol"),host:qb("$$host"),port:qb("$$port"),path:Dc("$$path",function(a){return"/"==a.charAt(0)?a:"/"+a}),search:function(a,c){switch(arguments.length){case 0:return this.$$search;
case 1:if(C(a))this.$$search=cc(a);else if(U(a))this.$$search=a;else throw Pb("isrcharg");break;default:D(c)||null===c?delete this.$$search[a]:this.$$search[a]=c}this.$$compose();return this},hash:Dc("$$hash",Fa),replace:function(){this.$$replace=!0;return this}};var Da=t("$parse"),Gc={},ta,cb={"null":function(){return null},"true":function(){return!0},"false":function(){return!1},undefined:y,"+":function(a,c,d,e){d=d(a,c);e=e(a,c);return B(d)?B(e)?d+e:d:B(e)?e:s},"-":function(a,c,d,e){d=d(a,c);e=
e(a,c);return(B(d)?d:0)-(B(e)?e:0)},"*":function(a,c,d,e){return d(a,c)*e(a,c)},"/":function(a,c,d,e){return d(a,c)/e(a,c)},"%":function(a,c,d,e){return d(a,c)%e(a,c)},"^":function(a,c,d,e){return d(a,c)^e(a,c)},"=":y,"===":function(a,c,d,e){return d(a,c)===e(a,c)},"!==":function(a,c,d,e){return d(a,c)!==e(a,c)},"==":function(a,c,d,e){return d(a,c)==e(a,c)},"!=":function(a,c,d,e){return d(a,c)!=e(a,c)},"<":function(a,c,d,e){return d(a,c)<e(a,c)},">":function(a,c,d,e){return d(a,c)>e(a,c)},"<=":function(a,
c,d,e){return d(a,c)<=e(a,c)},">=":function(a,c,d,e){return d(a,c)>=e(a,c)},"&&":function(a,c,d,e){return d(a,c)&&e(a,c)},"||":function(a,c,d,e){return d(a,c)||e(a,c)},"&":function(a,c,d,e){return d(a,c)&e(a,c)},"|":function(a,c,d,e){return e(a,c)(a,c,d(a,c))},"!":function(a,c,d){return!d(a,c)}},Oe={n:"\n",f:"\f",r:"\r",t:"\t",v:"\v","'":"'",'"':'"'},Tb=function(a){this.options=a};Tb.prototype={constructor:Tb,lex:function(a){this.text=a;this.index=0;this.ch=s;this.lastCh=":";for(this.tokens=[];this.index<
this.text.length;){this.ch=this.text.charAt(this.index);if(this.is("\"'"))this.readString(this.ch);else if(this.isNumber(this.ch)||this.is(".")&&this.isNumber(this.peek()))this.readNumber();else if(this.isIdent(this.ch))this.readIdent();else if(this.is("(){}[].,;:?"))this.tokens.push({index:this.index,text:this.ch}),this.index++;else if(this.isWhitespace(this.ch)){this.index++;continue}else{a=this.ch+this.peek();var c=a+this.peek(2),d=cb[this.ch],e=cb[a],g=cb[c];g?(this.tokens.push({index:this.index,
text:c,fn:g}),this.index+=3):e?(this.tokens.push({index:this.index,text:a,fn:e}),this.index+=2):d?(this.tokens.push({index:this.index,text:this.ch,fn:d}),this.index+=1):this.throwError("Unexpected next character ",this.index,this.index+1)}this.lastCh=this.ch}return this.tokens},is:function(a){return-1!==a.indexOf(this.ch)},was:function(a){return-1!==a.indexOf(this.lastCh)},peek:function(a){a=a||1;return this.index+a<this.text.length?this.text.charAt(this.index+a):!1},isNumber:function(a){return"0"<=
a&&"9">=a},isWhitespace:function(a){return" "===a||"\r"===a||"\t"===a||"\n"===a||"\v"===a||"\u00a0"===a},isIdent:function(a){return"a"<=a&&"z">=a||"A"<=a&&"Z">=a||"_"===a||"$"===a},isExpOperator:function(a){return"-"===a||"+"===a||this.isNumber(a)},throwError:function(a,c,d){d=d||this.index;c=B(c)?"s "+c+"-"+this.index+" ["+this.text.substring(c,d)+"]":" "+d;throw Da("lexerr",a,c,this.text);},readNumber:function(){for(var a="",c=this.index;this.index<this.text.length;){var d=L(this.text.charAt(this.index));
if("."==d||this.isNumber(d))a+=d;else{var e=this.peek();if("e"==d&&this.isExpOperator(e))a+=d;else if(this.isExpOperator(d)&&e&&this.isNumber(e)&&"e"==a.charAt(a.length-1))a+=d;else if(!this.isExpOperator(d)||e&&this.isNumber(e)||"e"!=a.charAt(a.length-1))break;else this.throwError("Invalid exponent")}this.index++}a*=1;this.tokens.push({index:c,text:a,literal:!0,constant:!0,fn:function(){return a}})},readIdent:function(){for(var a=this,c="",d=this.index,e,g,f,k;this.index<this.text.length;){k=this.text.charAt(this.index);
if("."===k||this.isIdent(k)||this.isNumber(k))"."===k&&(e=this.index),c+=k;else break;this.index++}if(e)for(g=this.index;g<this.text.length;){k=this.text.charAt(g);if("("===k){f=c.substr(e-d+1);c=c.substr(0,e-d);this.index=g;break}if(this.isWhitespace(k))g++;else break}d={index:d,text:c};if(cb.hasOwnProperty(c))d.fn=cb[c],d.literal=!0,d.constant=!0;else{var m=Fc(c,this.options,this.text);d.fn=J(function(a,c){return m(a,c)},{assign:function(d,e){return rb(d,c,e,a.text,a.options)}})}this.tokens.push(d);
f&&(this.tokens.push({index:e,text:"."}),this.tokens.push({index:e+1,text:f}))},readString:function(a){var c=this.index;this.index++;for(var d="",e=a,g=!1;this.index<this.text.length;){var f=this.text.charAt(this.index),e=e+f;if(g)"u"===f?(f=this.text.substring(this.index+1,this.index+5),f.match(/[\da-f]{4}/i)||this.throwError("Invalid unicode escape [\\u"+f+"]"),this.index+=4,d+=String.fromCharCode(parseInt(f,16))):d=(g=Oe[f])?d+g:d+f,g=!1;else if("\\"===f)g=!0;else{if(f===a){this.index++;this.tokens.push({index:c,
text:e,string:d,literal:!0,constant:!0,fn:function(){return d}});return}d+=f}this.index++}this.throwError("Unterminated quote",c)}};var bb=function(a,c,d){this.lexer=a;this.$filter=c;this.options=d};bb.ZERO=J(function(){return 0},{constant:!0});bb.prototype={constructor:bb,parse:function(a){this.text=a;this.tokens=this.lexer.lex(a);a=this.statements();0!==this.tokens.length&&this.throwError("is an unexpected token",this.tokens[0]);a.literal=!!a.literal;a.constant=!!a.constant;return a},primary:function(){var a;
if(this.expect("("))a=this.filterChain(),this.consume(")");else if(this.expect("["))a=this.arrayDeclaration();else if(this.expect("{"))a=this.object();else{var c=this.expect();(a=c.fn)||this.throwError("not a primary expression",c);a.literal=!!c.literal;a.constant=!!c.constant}for(var d;c=this.expect("(","[",".");)"("===c.text?(a=this.functionCall(a,d),d=null):"["===c.text?(d=a,a=this.objectIndex(a)):"."===c.text?(d=a,a=this.fieldAccess(a)):this.throwError("IMPOSSIBLE");return a},throwError:function(a,
c){throw Da("syntax",c.text,a,c.index+1,this.text,this.text.substring(c.index));},peekToken:function(){if(0===this.tokens.length)throw Da("ueoe",this.text);return this.tokens[0]},peek:function(a,c,d,e){if(0<this.tokens.length){var g=this.tokens[0],f=g.text;if(f===a||f===c||f===d||f===e||!(a||c||d||e))return g}return!1},expect:function(a,c,d,e){return(a=this.peek(a,c,d,e))?(this.tokens.shift(),a):!1},consume:function(a){this.expect(a)||this.throwError("is unexpected, expecting ["+a+"]",this.peek())},
unaryFn:function(a,c){return J(function(d,e){return a(d,e,c)},{constant:c.constant})},ternaryFn:function(a,c,d){return J(function(e,g){return a(e,g)?c(e,g):d(e,g)},{constant:a.constant&&c.constant&&d.constant})},binaryFn:function(a,c,d){return J(function(e,g){return c(e,g,a,d)},{constant:a.constant&&d.constant})},statements:function(){for(var a=[];;)if(0<this.tokens.length&&!this.peek("}",")",";","]")&&a.push(this.filterChain()),!this.expect(";"))return 1===a.length?a[0]:function(c,d){for(var e,g=
0;g<a.length;g++){var f=a[g];f&&(e=f(c,d))}return e}},filterChain:function(){for(var a=this.expression(),c;;)if(c=this.expect("|"))a=this.binaryFn(a,c.fn,this.filter());else return a},filter:function(){for(var a=this.expect(),c=this.$filter(a.text),d=[];;)if(a=this.expect(":"))d.push(this.expression());else{var e=function(a,e,k){k=[k];for(var m=0;m<d.length;m++)k.push(d[m](a,e));return c.apply(a,k)};return function(){return e}}},expression:function(){return this.assignment()},assignment:function(){var a=
this.ternary(),c,d;return(d=this.expect("="))?(a.assign||this.throwError("implies assignment but ["+this.text.substring(0,d.index)+"] can not be assigned to",d),c=this.ternary(),function(d,g){return a.assign(d,c(d,g),g)}):a},ternary:function(){var a=this.logicalOR(),c,d;if(this.expect("?")){c=this.ternary();if(d=this.expect(":"))return this.ternaryFn(a,c,this.ternary());this.throwError("expected :",d)}else return a},logicalOR:function(){for(var a=this.logicalAND(),c;;)if(c=this.expect("||"))a=this.binaryFn(a,
c.fn,this.logicalAND());else return a},logicalAND:function(){var a=this.equality(),c;if(c=this.expect("&&"))a=this.binaryFn(a,c.fn,this.logicalAND());return a},equality:function(){var a=this.relational(),c;if(c=this.expect("==","!=","===","!=="))a=this.binaryFn(a,c.fn,this.equality());return a},relational:function(){var a=this.additive(),c;if(c=this.expect("<",">","<=",">="))a=this.binaryFn(a,c.fn,this.relational());return a},additive:function(){for(var a=this.multiplicative(),c;c=this.expect("+",
"-");)a=this.binaryFn(a,c.fn,this.multiplicative());return a},multiplicative:function(){for(var a=this.unary(),c;c=this.expect("*","/","%");)a=this.binaryFn(a,c.fn,this.unary());return a},unary:function(){var a;return this.expect("+")?this.primary():(a=this.expect("-"))?this.binaryFn(bb.ZERO,a.fn,this.unary()):(a=this.expect("!"))?this.unaryFn(a.fn,this.unary()):this.primary()},fieldAccess:function(a){var c=this,d=this.expect().text,e=Fc(d,this.options,this.text);return J(function(c,d,k){return e(k||
a(c,d))},{assign:function(e,f,k){return rb(a(e,k),d,f,c.text,c.options)}})},objectIndex:function(a){var c=this,d=this.expression();this.consume("]");return J(function(e,g){var f=a(e,g),k=d(e,g),m;if(!f)return s;(f=ab(f[k],c.text))&&(f.then&&c.options.unwrapPromises)&&(m=f,"$$v"in f||(m.$$v=s,m.then(function(a){m.$$v=a})),f=f.$$v);return f},{assign:function(e,g,f){var k=d(e,f);return ab(a(e,f),c.text)[k]=g}})},functionCall:function(a,c){var d=[];if(")"!==this.peekToken().text){do d.push(this.expression());
while(this.expect(","))}this.consume(")");var e=this;return function(g,f){for(var k=[],m=c?c(g,f):g,h=0;h<d.length;h++)k.push(d[h](g,f));h=a(g,f,m)||y;ab(m,e.text);ab(h,e.text);k=h.apply?h.apply(m,k):h(k[0],k[1],k[2],k[3],k[4]);return ab(k,e.text)}},arrayDeclaration:function(){var a=[],c=!0;if("]"!==this.peekToken().text){do{if(this.peek("]"))break;var d=this.expression();a.push(d);d.constant||(c=!1)}while(this.expect(","))}this.consume("]");return J(function(c,d){for(var f=[],k=0;k<a.length;k++)f.push(a[k](c,
d));return f},{literal:!0,constant:c})},object:function(){var a=[],c=!0;if("}"!==this.peekToken().text){do{if(this.peek("}"))break;var d=this.expect(),d=d.string||d.text;this.consume(":");var e=this.expression();a.push({key:d,value:e});e.constant||(c=!1)}while(this.expect(","))}this.consume("}");return J(function(c,d){for(var e={},m=0;m<a.length;m++){var h=a[m];e[h.key]=h.value(c,d)}return e},{literal:!0,constant:c})}};var Sb={},ua=t("$sce"),fa={HTML:"html",CSS:"css",URL:"url",RESOURCE_URL:"resourceUrl",
JS:"js"},W=V.createElement("a"),Ic=sa(T.location.href,!0);kc.$inject=["$provide"];Jc.$inject=["$locale"];Lc.$inject=["$locale"];var Oc=".",Je={yyyy:Y("FullYear",4),yy:Y("FullYear",2,0,!0),y:Y("FullYear",1),MMMM:sb("Month"),MMM:sb("Month",!0),MM:Y("Month",2,1),M:Y("Month",1,1),dd:Y("Date",2),d:Y("Date",1),HH:Y("Hours",2),H:Y("Hours",1),hh:Y("Hours",2,-12),h:Y("Hours",1,-12),mm:Y("Minutes",2),m:Y("Minutes",1),ss:Y("Seconds",2),s:Y("Seconds",1),sss:Y("Milliseconds",3),EEEE:sb("Day"),EEE:sb("Day",!0),
a:function(a,c){return 12>a.getHours()?c.AMPMS[0]:c.AMPMS[1]},Z:function(a){a=-1*a.getTimezoneOffset();return a=(0<=a?"+":"")+(Ub(Math[0<a?"floor":"ceil"](a/60),2)+Ub(Math.abs(a%60),2))}},Ie=/((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,He=/^\-?\d+$/;Kc.$inject=["$locale"];var Fe=$(L),Ge=$(Ha);Mc.$inject=["$parse"];var cd=$({restrict:"E",compile:function(a,c){8>=S&&(c.href||c.name||c.$set("href",""),a.append(V.createComment("IE fix")));if(!c.href&&!c.xlinkHref&&!c.name)return function(a,
c){var g="[object SVGAnimatedString]"===wa.call(c.prop("href"))?"xlink:href":"href";c.on("click",function(a){c.attr(g)||a.preventDefault()})}}}),Eb={};q(mb,function(a,c){if("multiple"!=a){var d=ma("ng-"+c);Eb[d]=function(){return{priority:100,link:function(a,g,f){a.$watch(f[d],function(a){f.$set(c,!!a)})}}}}});q(["src","srcset","href"],function(a){var c=ma("ng-"+a);Eb[c]=function(){return{priority:99,link:function(d,e,g){var f=a,k=a;"href"===a&&"[object SVGAnimatedString]"===wa.call(e.prop("href"))&&
(k="xlinkHref",g.$attr[k]="xlink:href",f=null);g.$observe(c,function(a){a&&(g.$set(k,a),S&&f&&e.prop(f,g[k]))})}}}});var vb={$addControl:y,$removeControl:y,$setValidity:y,$setDirty:y,$setPristine:y};Pc.$inject=["$element","$attrs","$scope","$animate"];var Qc=function(a){return["$timeout",function(c){return{name:"form",restrict:a?"EAC":"E",controller:Pc,compile:function(){return{pre:function(a,e,g,f){if(!g.action){var k=function(a){a.preventDefault?a.preventDefault():a.returnValue=!1};pb(e[0],"submit",
k);e.on("$destroy",function(){c(function(){Wa(e[0],"submit",k)},0,!1)})}var m=e.parent().controller("form"),h=g.name||g.ngForm;h&&rb(a,h,f,h);if(m)e.on("$destroy",function(){m.$removeControl(f);h&&rb(a,h,s,h);J(f,vb)})}}}}}]},dd=Qc(),qd=Qc(!0),Pe=/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,Qe=/^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i,Re=/^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,Rc={text:xb,number:function(a,c,d,e,g,f){xb(a,c,d,e,g,f);e.$parsers.push(function(a){var c=
e.$isEmpty(a);if(c||Re.test(a))return e.$setValidity("number",!0),""===a?null:c?a:parseFloat(a);e.$setValidity("number",!1);return s});Ke(e,"number",c);e.$formatters.push(function(a){return e.$isEmpty(a)?"":""+a});d.min&&(a=function(a){var c=parseFloat(d.min);return qa(e,"min",e.$isEmpty(a)||a>=c,a)},e.$parsers.push(a),e.$formatters.push(a));d.max&&(a=function(a){var c=parseFloat(d.max);return qa(e,"max",e.$isEmpty(a)||a<=c,a)},e.$parsers.push(a),e.$formatters.push(a));e.$formatters.push(function(a){return qa(e,
"number",e.$isEmpty(a)||yb(a),a)})},url:function(a,c,d,e,g,f){xb(a,c,d,e,g,f);a=function(a){return qa(e,"url",e.$isEmpty(a)||Pe.test(a),a)};e.$formatters.push(a);e.$parsers.push(a)},email:function(a,c,d,e,g,f){xb(a,c,d,e,g,f);a=function(a){return qa(e,"email",e.$isEmpty(a)||Qe.test(a),a)};e.$formatters.push(a);e.$parsers.push(a)},radio:function(a,c,d,e){D(d.name)&&c.attr("name",eb());c.on("click",function(){c[0].checked&&a.$apply(function(){e.$setViewValue(d.value)})});e.$render=function(){c[0].checked=
d.value==e.$viewValue};d.$observe("value",e.$render)},checkbox:function(a,c,d,e){var g=d.ngTrueValue,f=d.ngFalseValue;C(g)||(g=!0);C(f)||(f=!1);c.on("click",function(){a.$apply(function(){e.$setViewValue(c[0].checked)})});e.$render=function(){c[0].checked=e.$viewValue};e.$isEmpty=function(a){return a!==g};e.$formatters.push(function(a){return a===g});e.$parsers.push(function(a){return a?g:f})},hidden:y,button:y,submit:y,reset:y,file:y},hc=["$browser","$sniffer",function(a,c){return{restrict:"E",require:"?ngModel",
link:function(d,e,g,f){f&&(Rc[L(g.type)]||Rc.text)(d,e,g,f,c,a)}}}],ub="ng-valid",tb="ng-invalid",Ma="ng-pristine",wb="ng-dirty",Se=["$scope","$exceptionHandler","$attrs","$element","$parse","$animate",function(a,c,d,e,g,f){function k(a,c){c=c?"-"+hb(c,"-"):"";f.removeClass(e,(a?tb:ub)+c);f.addClass(e,(a?ub:tb)+c)}this.$modelValue=this.$viewValue=Number.NaN;this.$parsers=[];this.$formatters=[];this.$viewChangeListeners=[];this.$pristine=!0;this.$dirty=!1;this.$valid=!0;this.$invalid=!1;this.$name=
d.name;var m=g(d.ngModel),h=m.assign;if(!h)throw t("ngModel")("nonassign",d.ngModel,ga(e));this.$render=y;this.$isEmpty=function(a){return D(a)||""===a||null===a||a!==a};var l=e.inheritedData("$formController")||vb,n=0,p=this.$error={};e.addClass(Ma);k(!0);this.$setValidity=function(a,c){p[a]!==!c&&(c?(p[a]&&n--,n||(k(!0),this.$valid=!0,this.$invalid=!1)):(k(!1),this.$invalid=!0,this.$valid=!1,n++),p[a]=!c,k(c,a),l.$setValidity(a,c,this))};this.$setPristine=function(){this.$dirty=!1;this.$pristine=
!0;f.removeClass(e,wb);f.addClass(e,Ma)};this.$setViewValue=function(d){this.$viewValue=d;this.$pristine&&(this.$dirty=!0,this.$pristine=!1,f.removeClass(e,Ma),f.addClass(e,wb),l.$setDirty());q(this.$parsers,function(a){d=a(d)});this.$modelValue!==d&&(this.$modelValue=d,h(a,d),q(this.$viewChangeListeners,function(a){try{a()}catch(d){c(d)}}))};var r=this;a.$watch(function(){var c=m(a);if(r.$modelValue!==c){var d=r.$formatters,e=d.length;for(r.$modelValue=c;e--;)c=d[e](c);r.$viewValue!==c&&(r.$viewValue=
c,r.$render())}return c})}],Fd=function(){return{require:["ngModel","^?form"],controller:Se,link:function(a,c,d,e){var g=e[0],f=e[1]||vb;f.$addControl(g);a.$on("$destroy",function(){f.$removeControl(g)})}}},Hd=$({require:"ngModel",link:function(a,c,d,e){e.$viewChangeListeners.push(function(){a.$eval(d.ngChange)})}}),ic=function(){return{require:"?ngModel",link:function(a,c,d,e){if(e){d.required=!0;var g=function(a){if(d.required&&e.$isEmpty(a))e.$setValidity("required",!1);else return e.$setValidity("required",
!0),a};e.$formatters.push(g);e.$parsers.unshift(g);d.$observe("required",function(){g(e.$viewValue)})}}}},Gd=function(){return{require:"ngModel",link:function(a,c,d,e){var g=(a=/\/(.*)\//.exec(d.ngList))&&RegExp(a[1])||d.ngList||",";e.$parsers.push(function(a){if(!D(a)){var c=[];a&&q(a.split(g),function(a){a&&c.push(aa(a))});return c}});e.$formatters.push(function(a){return O(a)?a.join(", "):s});e.$isEmpty=function(a){return!a||!a.length}}}},Te=/^(true|false|\d+)$/,Id=function(){return{priority:100,
compile:function(a,c){return Te.test(c.ngValue)?function(a,c,g){g.$set("value",a.$eval(g.ngValue))}:function(a,c,g){a.$watch(g.ngValue,function(a){g.$set("value",a)})}}}},id=va({compile:function(a){a.addClass("ng-binding");return function(a,d,e){d.data("$binding",e.ngBind);a.$watch(e.ngBind,function(a){d.text(a==s?"":a)})}}}),kd=["$interpolate",function(a){return function(c,d,e){c=a(d.attr(e.$attr.ngBindTemplate));d.addClass("ng-binding").data("$binding",c);e.$observe("ngBindTemplate",function(a){d.text(a)})}}],
jd=["$sce","$parse",function(a,c){return function(d,e,g){e.addClass("ng-binding").data("$binding",g.ngBindHtml);var f=c(g.ngBindHtml);d.$watch(function(){return(f(d)||"").toString()},function(c){e.html(a.getTrustedHtml(f(d))||"")})}}],ld=Vb("",!0),nd=Vb("Odd",0),md=Vb("Even",1),od=va({compile:function(a,c){c.$set("ngCloak",s);a.removeClass("ng-cloak")}}),pd=[function(){return{scope:!0,controller:"@",priority:500}}],jc={};q("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "),
function(a){var c=ma("ng-"+a);jc[c]=["$parse",function(d){return{compile:function(e,g){var f=d(g[c]);return function(c,d){d.on(L(a),function(a){c.$apply(function(){f(c,{$event:a})})})}}}}]});var sd=["$animate",function(a){return{transclude:"element",priority:600,terminal:!0,restrict:"A",$$tlb:!0,link:function(c,d,e,g,f){var k,m,h;c.$watch(e.ngIf,function(g){Ra(g)?m||(m=c.$new(),f(m,function(c){c[c.length++]=V.createComment(" end ngIf: "+e.ngIf+" ");k={clone:c};a.enter(c,d.parent(),d)})):(h&&(h.remove(),
h=null),m&&(m.$destroy(),m=null),k&&(h=Db(k.clone),a.leave(h,function(){h=null}),k=null))})}}}],td=["$http","$templateCache","$anchorScroll","$animate","$sce",function(a,c,d,e,g){return{restrict:"ECA",priority:400,terminal:!0,transclude:"element",controller:Sa.noop,compile:function(f,k){var m=k.ngInclude||k.src,h=k.onload||"",l=k.autoscroll;return function(f,k,r,q,I){var s=0,u,w,F,z=function(){w&&(w.remove(),w=null);u&&(u.$destroy(),u=null);F&&(e.leave(F,function(){w=null}),w=F,F=null)};f.$watch(g.parseAsResourceUrl(m),
function(g){var m=function(){!B(l)||l&&!f.$eval(l)||d()},r=++s;g?(a.get(g,{cache:c}).success(function(a){if(r===s){var c=f.$new();q.template=a;a=I(c,function(a){z();e.enter(a,null,k,m)});u=c;F=a;u.$emit("$includeContentLoaded");f.$eval(h)}}).error(function(){r===s&&z()}),f.$emit("$includeContentRequested")):(z(),q.template=null)})}}}}],Jd=["$compile",function(a){return{restrict:"ECA",priority:-400,require:"ngInclude",link:function(c,d,e,g){d.html(g.template);a(d.contents())(c)}}}],ud=va({priority:450,
compile:function(){return{pre:function(a,c,d){a.$eval(d.ngInit)}}}}),vd=va({terminal:!0,priority:1E3}),wd=["$locale","$interpolate",function(a,c){var d=/{}/g;return{restrict:"EA",link:function(e,g,f){var k=f.count,m=f.$attr.when&&g.attr(f.$attr.when),h=f.offset||0,l=e.$eval(m)||{},n={},p=c.startSymbol(),r=c.endSymbol(),s=/^when(Minus)?(.+)$/;q(f,function(a,c){s.test(c)&&(l[L(c.replace("when","").replace("Minus","-"))]=g.attr(f.$attr[c]))});q(l,function(a,e){n[e]=c(a.replace(d,p+k+"-"+h+r))});e.$watch(function(){var c=
parseFloat(e.$eval(k));if(isNaN(c))return"";c in l||(c=a.pluralCat(c-h));return n[c](e,g,!0)},function(a){g.text(a)})}}}],xd=["$parse","$animate",function(a,c){var d=t("ngRepeat");return{transclude:"element",priority:1E3,terminal:!0,$$tlb:!0,link:function(e,g,f,k,m){var h=f.ngRepeat,l=h.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/),n,p,r,s,I,x,u={$id:Ja};if(!l)throw d("iexp",h);f=l[1];k=l[2];(l=l[3])?(n=a(l),p=function(a,c,d){x&&(u[x]=a);u[I]=c;u.$index=d;return n(e,
u)}):(r=function(a,c){return Ja(c)},s=function(a){return a});l=f.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);if(!l)throw d("iidexp",f);I=l[3]||l[1];x=l[2];var B={};e.$watchCollection(k,function(a){var f,k,l=g[0],n,u={},E,A,H,t,C,y,D=[];if(db(a))C=a,n=p||r;else{n=p||s;C=[];for(H in a)a.hasOwnProperty(H)&&"$"!=H.charAt(0)&&C.push(H);C.sort()}E=C.length;k=D.length=C.length;for(f=0;f<k;f++)if(H=a===C?f:C[f],t=a[H],t=n(H,t,f),Aa(t,"`track by` id"),B.hasOwnProperty(t))y=B[t],delete B[t],u[t]=
y,D[f]=y;else{if(u.hasOwnProperty(t))throw q(D,function(a){a&&a.scope&&(B[a.id]=a)}),d("dupes",h,t);D[f]={id:t};u[t]=!1}for(H in B)B.hasOwnProperty(H)&&(y=B[H],f=Db(y.clone),c.leave(f),q(f,function(a){a.$$NG_REMOVED=!0}),y.scope.$destroy());f=0;for(k=C.length;f<k;f++){H=a===C?f:C[f];t=a[H];y=D[f];D[f-1]&&(l=D[f-1].clone[D[f-1].clone.length-1]);if(y.scope){A=y.scope;n=l;do n=n.nextSibling;while(n&&n.$$NG_REMOVED);y.clone[0]!=n&&c.move(Db(y.clone),null,w(l));l=y.clone[y.clone.length-1]}else A=e.$new();
A[I]=t;x&&(A[x]=H);A.$index=f;A.$first=0===f;A.$last=f===E-1;A.$middle=!(A.$first||A.$last);A.$odd=!(A.$even=0===(f&1));y.scope||m(A,function(a){a[a.length++]=V.createComment(" end ngRepeat: "+h+" ");c.enter(a,null,w(l));l=a;y.scope=A;y.clone=a;u[y.id]=y})}B=u})}}}],yd=["$animate",function(a){return function(c,d,e){c.$watch(e.ngShow,function(c){a[Ra(c)?"removeClass":"addClass"](d,"ng-hide")})}}],rd=["$animate",function(a){return function(c,d,e){c.$watch(e.ngHide,function(c){a[Ra(c)?"addClass":"removeClass"](d,
"ng-hide")})}}],zd=va(function(a,c,d){a.$watch(d.ngStyle,function(a,d){d&&a!==d&&q(d,function(a,d){c.css(d,"")});a&&c.css(a)},!0)}),Ad=["$animate",function(a){return{restrict:"EA",require:"ngSwitch",controller:["$scope",function(){this.cases={}}],link:function(c,d,e,g){var f=[],k=[],m=[],h=[];c.$watch(e.ngSwitch||e.on,function(d){var n,p;n=0;for(p=m.length;n<p;++n)m[n].remove();n=m.length=0;for(p=h.length;n<p;++n){var r=k[n];h[n].$destroy();m[n]=r;a.leave(r,function(){m.splice(n,1)})}k.length=0;h.length=
0;if(f=g.cases["!"+d]||g.cases["?"])c.$eval(e.change),q(f,function(d){var e=c.$new();h.push(e);d.transclude(e,function(c){var e=d.element;k.push(c);a.enter(c,e.parent(),e)})})})}}}],Bd=va({transclude:"element",priority:800,require:"^ngSwitch",link:function(a,c,d,e,g){e.cases["!"+d.ngSwitchWhen]=e.cases["!"+d.ngSwitchWhen]||[];e.cases["!"+d.ngSwitchWhen].push({transclude:g,element:c})}}),Cd=va({transclude:"element",priority:800,require:"^ngSwitch",link:function(a,c,d,e,g){e.cases["?"]=e.cases["?"]||
[];e.cases["?"].push({transclude:g,element:c})}}),Ed=va({link:function(a,c,d,e,g){if(!g)throw t("ngTransclude")("orphan",ga(c));g(function(a){c.empty();c.append(a)})}}),ed=["$templateCache",function(a){return{restrict:"E",terminal:!0,compile:function(c,d){"text/ng-template"==d.type&&a.put(d.id,c[0].text)}}}],Ue=t("ngOptions"),Dd=$({terminal:!0}),fd=["$compile","$parse",function(a,c){var d=/^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,
e={$setViewValue:y};return{restrict:"E",require:["select","?ngModel"],controller:["$element","$scope","$attrs",function(a,c,d){var m=this,h={},l=e,n;m.databound=d.ngModel;m.init=function(a,c,d){l=a;n=d};m.addOption=function(c){Aa(c,'"option value"');h[c]=!0;l.$viewValue==c&&(a.val(c),n.parent()&&n.remove())};m.removeOption=function(a){this.hasOption(a)&&(delete h[a],l.$viewValue==a&&this.renderUnknownOption(a))};m.renderUnknownOption=function(c){c="? "+Ja(c)+" ?";n.val(c);a.prepend(n);a.val(c);n.prop("selected",
!0)};m.hasOption=function(a){return h.hasOwnProperty(a)};c.$on("$destroy",function(){m.renderUnknownOption=y})}],link:function(e,f,k,m){function h(a,c,d,e){d.$render=function(){var a=d.$viewValue;e.hasOption(a)?(F.parent()&&F.remove(),c.val(a),""===a&&x.prop("selected",!0)):D(a)&&x?c.val(""):e.renderUnknownOption(a)};c.on("change",function(){a.$apply(function(){F.parent()&&F.remove();d.$setViewValue(c.val())})})}function l(a,c,d){var e;d.$render=function(){var a=new Ya(d.$viewValue);q(c.find("option"),
function(c){c.selected=B(a.get(c.value))})};a.$watch(function(){xa(e,d.$viewValue)||(e=ka(d.$viewValue),d.$render())});c.on("change",function(){a.$apply(function(){var a=[];q(c.find("option"),function(c){c.selected&&a.push(c.value)});d.$setViewValue(a)})})}function n(e,f,g){function k(){var a={"":[]},c=[""],d,h,s,t,v;t=g.$modelValue;v=w(e)||[];var D=n?Wb(v):v,F,K,A;K={};s=!1;var E,J;if(r)if(x&&O(t))for(s=new Ya([]),A=0;A<t.length;A++)K[m]=t[A],s.put(x(e,K),t[A]);else s=new Ya(t);for(A=0;F=D.length,
A<F;A++){h=A;if(n){h=D[A];if("$"===h.charAt(0))continue;K[n]=h}K[m]=v[h];d=p(e,K)||"";(h=a[d])||(h=a[d]=[],c.push(d));r?d=B(s.remove(x?x(e,K):q(e,K))):(x?(d={},d[m]=t,d=x(e,d)===x(e,K)):d=t===q(e,K),s=s||d);E=l(e,K);E=B(E)?E:"";h.push({id:x?x(e,K):n?D[A]:A,label:E,selected:d})}r||(y||null===t?a[""].unshift({id:"",label:"",selected:!s}):s||a[""].unshift({id:"?",label:"",selected:!0}));K=0;for(D=c.length;K<D;K++){d=c[K];h=a[d];z.length<=K?(t={element:C.clone().attr("label",d),label:h.label},v=[t],z.push(v),
f.append(t.element)):(v=z[K],t=v[0],t.label!=d&&t.element.attr("label",t.label=d));E=null;A=0;for(F=h.length;A<F;A++)s=h[A],(d=v[A+1])?(E=d.element,d.label!==s.label&&E.text(d.label=s.label),d.id!==s.id&&E.val(d.id=s.id),d.selected!==s.selected&&E.prop("selected",d.selected=s.selected)):(""===s.id&&y?J=y:(J=u.clone()).val(s.id).attr("selected",s.selected).text(s.label),v.push({element:J,label:s.label,id:s.id,selected:s.selected}),E?E.after(J):t.element.append(J),E=J);for(A++;v.length>A;)v.pop().element.remove()}for(;z.length>
K;)z.pop()[0].element.remove()}var h;if(!(h=t.match(d)))throw Ue("iexp",t,ga(f));var l=c(h[2]||h[1]),m=h[4]||h[6],n=h[5],p=c(h[3]||""),q=c(h[2]?h[1]:m),w=c(h[7]),x=h[8]?c(h[8]):null,z=[[{element:f,label:""}]];y&&(a(y)(e),y.removeClass("ng-scope"),y.remove());f.empty();f.on("change",function(){e.$apply(function(){var a,c=w(e)||[],d={},h,k,l,p,t,u,v;if(r)for(k=[],p=0,u=z.length;p<u;p++)for(a=z[p],l=1,t=a.length;l<t;l++){if((h=a[l].element)[0].selected){h=h.val();n&&(d[n]=h);if(x)for(v=0;v<c.length&&
(d[m]=c[v],x(e,d)!=h);v++);else d[m]=c[h];k.push(q(e,d))}}else{h=f.val();if("?"==h)k=s;else if(""===h)k=null;else if(x)for(v=0;v<c.length;v++){if(d[m]=c[v],x(e,d)==h){k=q(e,d);break}}else d[m]=c[h],n&&(d[n]=h),k=q(e,d);1<z[0].length&&z[0][1].id!==h&&(z[0][1].selected=!1)}g.$setViewValue(k)})});g.$render=k;e.$watch(k)}if(m[1]){var p=m[0];m=m[1];var r=k.multiple,t=k.ngOptions,y=!1,x,u=w(V.createElement("option")),C=w(V.createElement("optgroup")),F=u.clone();k=0;for(var z=f.children(),J=z.length;k<J;k++)if(""===
z[k].value){x=y=z.eq(k);break}p.init(m,y,F);r&&(m.$isEmpty=function(a){return!a||0===a.length});t?n(e,f,m):r?l(e,f,m):h(e,f,m,p)}}}}],hd=["$interpolate",function(a){var c={addOption:y,removeOption:y};return{restrict:"E",priority:100,compile:function(d,e){if(D(e.value)){var g=a(d.text(),!0);g||e.$set("value",d.text())}return function(a,d,e){var h=d.parent(),l=h.data("$selectController")||h.parent().data("$selectController");l&&l.databound?d.prop("selected",!1):l=c;g?a.$watch(g,function(a,c){e.$set("value",
a);a!==c&&l.removeOption(c);l.addOption(a)}):l.addOption(e.value);d.on("$destroy",function(){l.removeOption(e.value)})}}}}],gd=$({restrict:"E",terminal:!0});T.angular.bootstrap?console.log("WARNING: Tried to load angular more than once."):((Ba=T.jQuery)&&Ba.fn.on?(w=Ba,J(Ba.fn,{scope:Ka.scope,isolateScope:Ka.isolateScope,controller:Ka.controller,injector:Ka.injector,inheritedData:Ka.inheritedData}),Fb("remove",!0,!0,!1),Fb("empty",!1,!1,!1),Fb("html",!1,!1,!0)):w=R,Sa.element=w,Zc(Sa),w(V).ready(function(){Wc(V,
dc)}))})(window,document);!window.angular.$$csp()&&window.angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}.ng-animate-block-transitions{transition:0s all!important;-webkit-transition:0s all!important;}.ng-hide-add-active,.ng-hide-remove{display:block!important;}</style>');
//# sourceMappingURL=angular.min.js.map

},{}],21:[function(require,module,exports){
//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.6.0';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    any(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, function(value, index, list) {
      return !predicate.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
    each(obj, function(value, index, list) {
      if (!(result = result && predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
    each(obj, function(value, index, list) {
      if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    var result = -Infinity, lastComputed = -Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed > lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    var result = Infinity, lastComputed = Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed < lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return value;
    return _.property(value);
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    iterator = lookupIterator(iterator);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iterator, context) {
      var result = {};
      iterator = lookupIterator(iterator);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    _.has(result, key) ? result[key].push(value) : result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Split an array into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(array, predicate) {
    var pass = [], fail = [];
    each(array, function(elem) {
      (predicate(elem) ? pass : fail).push(elem);
    });
    return [pass, fail];
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.contains(other, item);
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, 'length').concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error('bindAll must be passed function names');
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function () {
      return value;
    };
  };

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    return function(obj) {
      if (obj === attrs) return true; //avoid comparing an object to itself.
      for (var key in attrs) {
        if (attrs[key] !== obj[key])
          return false;
      }
      return true;
    }
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() { return new Date().getTime(); };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}).call(this);

},{}]},{},[12])