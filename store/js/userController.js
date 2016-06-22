// create the module and name it userApp
var userApp = angular.module('userApp', ['ngRoute', 'ui.router']);

userApp
  .factory('User', ['$rootScope', '$http', '$q', '$timeout', '$location',
    function($rootScope, $http, $q, $timeout, $location) {

      function UserClass() {
        this.user = {};
        this.loggedin = false;
      }

      var User = new UserClass();
      UserClass.prototype.login = function(user) {
        $http({
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            url: 'http://test-api.evermight.com/login.php',
            data: $.param({
              email: user.email,
              password: user.password,
              appkey: 18
            })
          })
          .success(function(response) {
            if (response.success) {
              $location.url('/home');
            }
          })
          .error(function(response) {
            if (response.success) {
              $location.url('/home');
            }
          });
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
            User.user = user;
          })
          .error(function(err) {
            console.log(err);
          });
      }

      UserClass.prototype.checkLoggedOut = function() {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            url: 'http://test-api.evermight.com/login.php',
            data: $.param({
              email: User.user.email,
              password: User.user.password
            })
          })
          .success(function(response) {
            // Authenticated
            if (response.success) {
              $timeout(deferred.reject);
              $location.url('/home');
            }
          })
          .error(function(res) {
            $timeout(deferred.resolve);
          });

        return deferred.promise;
      }

      return User;
    }
  ]) // factory
  .config(function($stateProvider, $urlRouterProvider) {
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
        resolve: {
          loggedin: function(User) {
            return User.checkLoggedOut();
          }
        }
      })
      .state("login", {
        url: "/login",
        templateUrl: "pages/login.html",
      });
    // Send to login if the URL was not found
    $urlRouterProvider.otherwise("/login");
  })
  .controller('userController', function($scope) {
    // nothing
  })
  .controller('loginController', function($scope, User) {
    var self = this;
    self.user = {
      email: null,
      password: null
    }

    self.login = function() {
      User.login(self.user);
    }
  })
  .controller('registerController', function($scope, $rootScope, User) {
      var self = this;
      self.user = {
        userName: null,
        lastName: null,
        email: null,
        password: null
      }
      console.log(User)
      self.register = function() {
        User.register(self.user);
      }
    });
