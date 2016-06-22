// create the module and name it userApp
var userApp = angular.module('userApp', ['ngRoute', 'ui.router']);

userApp.factory('User', ['$rootScope', '$http', '$q', '$timeout', '$location',
  function($rootScope, $http, $q, $timeout, $location) {
    function UserClass() {
      this.user = {};
      this.loggedin = false;
    }

    UserClass.prototype.login = function(user) {
      debugger;
      // $http({
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/x-www-form-urlencoded'
      //     },
      //     url: 'http://test-api.evermight.com/login.php',
      //     data: $.param({
      //       email: user.email,
      //       password: user.password
      //     })
      //   })
      //   .success(function(response) {
      //     console.log(response);
      //   })
      //   .error(function(err) {
      //     console.log(response);
      //   });
    }

    UserClass.prototype.register = function(user) {
      $http({
          url: 'http://test-api.evermight.com/register.php',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: $.param({
            firstname: user.firstName,
            lastname: user.lastName,
            email: user.email,
            password: user.password,
            appkey: 18
          })
        })
        .success(function(response) {
          console.log(response);
        })
        .error(function(err) {
          console.log(response);
        });
    }

    var User = new UserClass();
    // UserClass.prototype.checkLoggedOut = function() {
    //   var deferred = $q.defer();
    //   $http({
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //       },
    //       url: 'http://test-api.evermight.com/login.php',
    //       data: $.param({
    //         email: User.user.email,
    //         password: User.user.password
    //       })
    //     })
    //     .then(function(response) {
    //       // Authenticated
    //       console.log(response);
    //       if (response.success) {
    //         $timeout(deferred.reject);
    //         $location.url('/home');
    //       }
    //     })
    //     .error(function(err) {
    //       console.log(err, 'here')
    //     });
    //
    //   return deferred.promise;
    // }

    return User;
  }
]); // factory

userApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state("home", {
      url: "/home",
      templateUrl: "pages/home.html"
    })
    .state("cars", {
      url: "/cars",
      templateUrl: "pages/cars.html"
    })
    .state("register", {
      url: "/register",
      templateUrl: "pages/register.html",
      // resolve: {
      //   loggedin: function(User) {
      //     return User.checkLoggedOut();
      //   }
      // }
    })
    .state("login", {
      url: "/login",
      templateUrl: "pages/login.html",
    });
  // Send to login if the URL was not found
  $urlRouterProvider.otherwise("/login");
});

// create the controller and inject Angular's $scope
userApp.controller('userController', function($scope) {
  // create a message to display in our view
  $scope.message = 'Everyone come and see how good I look!';
});

userApp.controller('aboutController', function($scope) {
  $scope.message = 'Look! I am an about page.';
});

userApp.controller('contactController', function($scope) {
  $scope.message = 'Contact us! JK. This is just a demo.';
});
