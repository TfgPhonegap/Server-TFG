// create the module and name it adminApp
        // also include ngRoute for all our routing needs
	var adminApp = angular.module('adminApp', ['ngRoute', 'ui.bootstrap']);

	// configure our routes
	adminApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'pages/home.html',
				controller  : 'loginController'
			})

			// route for the about page
			.when('/about', {
				templateUrl : 'pages/about.html',
				controller  : 'aboutController'
			})

			.when('/users', {
				templateUrl : 'pages/users.html',
				controller  : 'usersController'
			})

			.when('/portes', {
				templateUrl : 'pages/adminPortes.html',
				controller  : 'portesController'
			})

			.when('/users/ubicacions/:username', {
				templateUrl : 'pages/ubicacionsUser.html',
				controller  : 'ubicacionsUsersController'
			})

			.when('/users/accessos/:username', {
				templateUrl : 'pages/accessosUser.html',
				controller  : 'accessosUsersController'
			})

			.when('/grups', {
				templateUrl : 'pages/grups.html',
				controller  : 'grupsController'
			})

			// route for the contact page
			.when('/contact', {
				templateUrl : 'pages/contact.html',
				controller  : 'contactController'
			});
	});
	adminApp.controller('mainController', function($scope, $http, $modal, $location) {

	});

	adminApp.controller('usersController', function($scope, $http, $modal, $location) {
		$scope.users = [];
		$http.get('/admin/users').success(function (result) {
			console.log('Dins del succes!!!');
	      	$scope.users = result;
		  }).error(function (data) {
		    console.log('-------error------');
		  });
		$scope.removeUser = function(username){
			console.log('Remove user --> ' + username);
			$http.delete('/users/delete/' + username).success(function (res){
				console.log(res);
				// Actualitzem la llista de users.
				$http.get('/admin/users').success(function (result) {
			      	$scope.users = result;
				  }).error(function (data) {
				    console.log('-------error------');
				  });
			});
		};
		$scope.addUser = function(){
		    var modalInstance = $modal.open({
		      templateUrl: 'myModalContent.html',
		      controller: 'modelInstanceController',
		      resolve: {
		        actualitzarLlista: function () {
		        	$http.get('/admin/users').success(function (result) {
				      	$scope.users = result;
					  }).error(function (data) {
					    console.log('-------error------');
					  });
		          return;
		        }
		      }
		    });
		};

		$scope.go = function ( path, username ) {
			console.log(path + username);
			$location.path( path + username );
		};
		

	});
	adminApp.controller('ubicacionsUsersController', function($scope, $http, $routeParams) {
		$scope.ubicacions = [];
		$scope.user = $routeParams.username;
		console.log('param' + $routeParams.username);
		$http.get('/admin/ubicacions/' + $routeParams.username).success(function (result) {
			console.log('Dins del succes!!!');
	      	$scope.ubicacions = result;
	      	console.log($scope.ubicacions);
		  }).error(function (data) {
		    console.log('-------error------');
		  });

		

	});

	adminApp.controller('accessosUsersController', function($scope, $http, $routeParams) {
		$scope.accessos = [];
		$scope.user = $routeParams.username;
		$http.get('/admin/accessos/' + $routeParams.username).success(function (result) {
			console.log('Dins del succes!!!');
	      	$scope.accessos = result;
		  }).error(function (data) {
		    console.log('-------error------');
		  });

		

	});

	adminApp.controller('loginController', function($scope, $http, $location) {
		$scope.admin = {pass: ''};
		$scope.submit = function() {
			console.log($scope.admin.pass);
			$http.post('/loginAdmin', $scope.admin).success(function (data) {
				$http.defaults.headers.common.Authorization = data.authorizationToken;
				$location.path( '/users' );
			  }).error(function (data) {
			    console.log('-------error------');
			  });

		};
		

		

	});


	adminApp.controller('grupsController', function($scope, $http, $modal) {
		$scope.grups = [];
		$http.get('/admin/grups').success(function (result) {
	      	$scope.grups = result;
		  }).error(function (data) {
		    console.log('-------error------');
		  });
		$scope.removeGrup = function(grup){
			$http.delete('/admin/grups/' + grup).success(function (res){
				if (res =='error') {
					alert("El nombre d'integrants ha de ser 0");
				}
				// Actualitzem la llista de users.
				$http.get('/admin/grups').success(function (result) {
			      	$scope.grups = result;
				  }).error(function (data) {
				    console.log('-------error------');
				  });
			});
		};
		$scope.addGrup = function(){			
		    var modalInstance = $modal.open({
		      templateUrl: 'modalNewGrupContent.html',
		      controller: 'modelInstanceController',
		      resolve: {
		        actualitzarLlista: function () {
		        	$http.get('/admin/users').success(function (result) {
				      	$scope.users = result;
					  }).error(function (data) {
					    console.log('-------error------');
					  });
		          return;
		        }
		      }
		    });
		};
		

	});

	adminApp.controller('portesController', function($scope, $http, $modal) {
		$scope.portes = [];
		$http.get('/admin/portes').success(function (result) {
	      	$scope.portes = result;
		  }).error(function (data) {
		    console.log('-------error------');
		  });
		$scope.removePorta = function(porta){
			$http.delete('/admin/portes/' + porta).success(function (res){
				if (res =='error') {
					alert("Per a eliminar una porta no hi pot haver cap grup admés");
				}
				// Actualitzem la llista de users.
				$http.get('/admin/portes').success(function (result) {
					//console.log(result);
			      	$scope.portes = result;
				  }).error(function (data) {
				    console.log('-------error------');
				  });
			});
		};

		$scope.revocarAcces = function(grup, porta){
			console.log(grup+porta);
			$http.delete('/admin/portes/' + porta + '/grup/' + grup).success(function (res){
				if (res =='error') {
					alert("Per a eliminar una porta no hi pot haver cap grup admés");
				}
				// Actualitzem la llista de users.
				$http.get('/admin/portes').success(function (result) {
					//console.log(result);
			      	$scope.portes = result;
			      	$scope.apply();
				  }).error(function (data) {
				    console.log('-------error------');
				  });
			});
		};

		$scope.addPorta = function(){			
		    var modalInstance = $modal.open({
		      templateUrl: 'modalNewGrupContent.html',
		      controller: 'modelInstanceController',
		      resolve: {
		        actualitzarLlista: function () {
		        	$http.get('/admin/users').success(function (result) {
				      	$scope.users = result;
					  }).error(function (data) {
					    console.log('-------error------');
					  });
		          return;
		        }
		      }
		    });
		};

		$scope.permetreAccesGrup = function(porta){			
		    var modalInstance = $modal.open({
		      templateUrl: 'modalPermetreNouGrup.html',
		      controller: 'modelInstanceNouGrupPortaController',
		      resolve: {
		        idPorta: function () {
		          return porta;
		        }
		      }
		    });
		};
		

	});

	adminApp.controller('modelInstanceController', function($scope, $http, $modalInstance) {
		$scope.items = {};
		$scope.portes = {id: 'isi', checked: false};
		$http.get('/grups').success(function (result) {
				$scope.items = result;
				return;
				  }).error(function (data) {
				    console.log('-------error------');
				  });
		$http.get('/admin/portes').success(function (result) {
				$scope.portes = result;
				return;
				  }).error(function (data) {
				    console.log('-------error------');
				  });
		$scope.portaNova = {id: ''};
		$scope.selectedPorta= {truthy: ''};
		$scope.selected = {};
		$scope.user = {name: null, description: null};
		$scope.grup = {nom: null, portes: []};
		$scope.ok = function () {
			var data = {name: $scope.user.name, description: $scope.user.description, 
				grup: $scope.selected.name};
			if ($scope.user.name == null || $scope.user.description == null || angular.isUndefined($scope.selected.name))
				$scope.errorMessage = 'Tots els camps són obligatoris';
			else {
			    $http.post('/users/new', data).success(function (result) {
			    	if (result=='ok'){
			    		alert('Usuari creat correctament');	
			    		$modalInstance.close($scope.selected.item);
			    		actualitzarLlista;
			    	}
			    	else
			    		alert('Error en al creacio');
			    }).error(function (data) {
			      console.log('-------error------');
			    });
			}
		  
		};
		$scope.ok2 = function () {
			console.log($scope.portes);
			var portesMarcades = [];
			var data = {id: '', portesAccessibles: []};
			for (var i=0; i<$scope.portes.length; i++) {
				if ($scope.portes[i].checked == true)
					portesMarcades.push($scope.portes[i].id);
			}
			data.nom = $scope.grup.nom;
			data.portesAccessibles = portesMarcades;
			//Falta comprovacions als inputs.
			 $http.post('/admin/grups/nou', data).success(function (result) {
			    	if (result=='ok'){
			    		alert('Grup creat correctament');	
			    		$modalInstance.close($scope.selected.item);
			    	}
			    	else
			    		alert('Error en al creacio');
			    }).error(function (data) {
			      console.log('-------error------');
			    });
		  
		};
		
		$scope.okPorta = function () {
			var data = {id: $scope.portaNova.id};
			if ($scope.portaNova.id == '' )
				$scope.errorMessage = 'Tots els camps són obligatoris';
			else {
			    $http.post('/admin/portes/nova', data).success(function (result) {
			    	if (result=='ok'){
			    		alert('Porta creada correctament');	
			    		$modalInstance.close($scope.selected.item);
			    	}
			    	else
			    		alert('Error en al creacio');
			    }).error(function (data) {
			      console.log('-------error------');
			    });
			}
		  
		};

		$scope.cancel = function () {
			$modalInstance.close();
		};
	});

	adminApp.controller('modelInstanceNouGrupPortaController', function($scope, $http, $modalInstance, idPorta) {
		$scope.items = {checked: false};
		$scope.grup = {id: 'isi', checked: false};
		$scope.portaPermetreNouAcces = idPorta;
		$http.get('/grups').success(function (result) {
				$scope.items = result;
				return;
				  }).error(function (data) {
				    console.log('-------error------');
				  });
		$http.get('/admin/portes').success(function (result) {
				$scope.portes = result;
				return;
				  }).error(function (data) {
				    console.log('-------error------');
				  });
		$scope.selected = {};
		$scope.user = {name: null, description: null};
		$scope.grup = {nom: null, portes: []};

		
		$scope.okNouGrupAdmesPorta = function () {
			console.log('Volem accedir a porta: ' + $scope.portaPermetreNouAcces);
			console.log($scope.items);
			var data = {porta: '', nousGrups: []};
			var grupsMarcats = [];

				for (var i=0; i<$scope.items.length; i++) {
					if ($scope.items[i].checked == true)
						grupsMarcats.push($scope.items[i].name);
				}
				data.porta = $scope.portaPermetreNouAcces;
				data.nousGrups = grupsMarcats;
			   	$http.put('/admin/portes/nouGrup', data).success(function (result) {
			    	if (result=='ok'){
			    		alert('Grup afegit correctament');	
			    		$modalInstance.close();
			    	}
			    	else
			    		alert('Error en al creacio');
			    }).error(function (data) {
			      console.log('-------error------');
			    });
			
		  
		};

		$scope.cancel = function () {
			$modalInstance.close();
		};
	});


	

// Modul per portes.
var portesApp = angular.module('portesApp', ['ngRoute', 'ui.bootstrap', 'ja.qr']);

	// configure our routes
	portesApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/:idPorta', {
				templateUrl : 'pages/porta.html',
				controller  : 'portaController'
			});
	});
	portesApp.controller('mainController', function($scope, $http, $modal, $location) {

	});

	portesApp.controller('portaController', function($scope, $http, $routeParams) {
		$scope.string = "";
		$scope.amagat = true;
		$scope.nomPorta = $routeParams.idPorta;
		$scope.getClau = function(){
			// Aquí es farà la petició de clau al server.
			$http.get('/clau/' + $scope.nomPorta).success(function (result) {
			      	$scope.string = '{"tipus": "nouAcces", "id":"'+result.porta+'", "clau": "'
			      	 + result.clau + '"}';
			      	$scope.amagat = false;
				  }).error(function (data) {
				    console.log('-------error------');
				  });
			
			
		};
	});
