// create the module and name it scotchApp
        // also include ngRoute for all our routing needs
	var scotchApp = angular.module('scotchApp', ['ngRoute', 'ui.bootstrap']);

	// configure our routes
	scotchApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'pages/home.html',
				controller  : 'mainController'
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

			// route for the contact page
			.when('/contact', {
				templateUrl : 'pages/contact.html',
				controller  : 'contactController'
			});
	});

	// create the controller and inject Angular's $scope
	scotchApp.controller('mainController', function($scope) {
		// create a message to display in our view
		$scope.message = 'Everyone come and see how good I look!';
	});

	scotchApp.controller('aboutController', function($scope) {
		$scope.message = 'Look! I am an about page.';
	});

	scotchApp.controller('contactController', function($scope) {
		$scope.message = 'Contact us! JK. This is just a demo.';
	});

	scotchApp.controller('usersController', function($scope, $http, $modal) {
		$scope.users = [];
		$http.get('/users').success(function (result) {
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
				$http.get('/users').success(function (result) {
					console.log('Dins del succes!!!');
			      	$scope.users = result;
				  }).error(function (data) {
				    console.log('-------error------');
				  });
			});
		};
		$scope.addUser = function(){
			console.log('Click add user!!!');

			// El modal no apareix, es queda la pantalla negra.
		    var modalInstance = $modal.open({
		      templateUrl: 'pages/modal.html',
		      resolve: {
		        items: function () {
		          return $scope.items;
		        }
		      }
		    });
		};
		

	});


	scotchApp.controller('LoginController', function($scope, $http, $state, $ionicPopup, AuthenticationService) {
	  $scope.message = "";
	  
	  $scope.user = {
	    username: null,
	    password: null
	  };
	 
	  $scope.login = function() {
	    console.log($scope.user);
	    AuthenticationService.login($scope.user);
	  };
	 
	  $scope.$on('event:auth-loginRequired', function(e, rejection) {
	    console.log('Broadcaste cacheado en el controlladorrr');
	    //$scope.loginModal.show();
	   
	      $scope.data = {}

	      // An elaborate, custom popup
	      var popup = $ionicPopup.show({
	        templateUrl: 'templates/loginPopup.html',
	        title: 'LOGIN',
	        subTitle: $scope.message,
	        scope: $scope,
	        buttons: [
	          {
	            text: 'Submit',
	            type: 'button-positive',
	            onTap: function(e) {
	              if($scope.user.password==null) {
	                console.log('nuuuuulllllllll');
	                //e.preventDefault();
	                return $scope.data;
	              }
	              else {
	                 return $scope.data;
	              }
	             
	            }
	          },
	        ]
	      });
	      popup.then(function(res) {
	        $scope.login();  
	      });

	  });
	 
	 //Deixar que desaparegui el popup.
	  $scope.$on('event:auth-loginConfirmed', function() {
	   $scope.username = null;
	   $scope.password = null;
	     $scope.loginModal.hide();
	  });
	  
	  //Aquí hauré de mostrar un altre popup dient que algo de la autenticació falla.
	  $scope.$on('event:auth-login-failed', function(e, status) {
	    var error = "Login failed.";
	    if (status == 401) {
	      error = "Invalid Username or Password.";
	    }
	    $scope.message = error;
	  });
	 
	  $scope.$on('event:auth-logout-complete', function() {
	    $state.go('app.home', {}, {reload: true, inherit: false});
	  });     
})