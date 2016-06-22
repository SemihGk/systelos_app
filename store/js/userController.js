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
        var self = this;
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
              self.loggedin = true;
              $rootScope.$emit('loggedin', self);
            }
          })
          .error(function(response) {
            if (response.success) {
              $location.url('/home');
              self.loggedin = true;
              $rootScope.$emit('loggedin', self);
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

      UserClass.prototype.logout = function() {
        this.user = {};
        this.loggedin = false;
        $rootScope.$emit('loggedin', this);
        $location.url('/login');
      };

      return User;
    }
  ]) // factory
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state("home", {
        url: "/home",
        templateUrl: "pages/home.html",
        authenticate: true
      })
      .state("cars", {
        url: "/cars",
        templateUrl: "pages/cars.html",
        authenticate: true
      })
      .state("register", {
        url: "/register",
        templateUrl: "pages/register.html",
        authenticate: false
      })
      .state("login", {
        url: "/login",
        templateUrl: "pages/login.html",
        authenticate: false
      });
    // Send to login if the URL was not found
    $urlRouterProvider.otherwise("/login");
  })
  .controller('userController', function($scope, $rootScope, User) {
    var self = this;
    self.loggedin = User.loggedin;
    $rootScope.$on('loggedin', function(event, args){
      console.log(args)
      self.loggedin = args.loggedin;
    });
    self.logout = function() {
      User.logout();
    }
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

  userApp.run(function ($rootScope, $state, User) {
      $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        if (toState.authenticate && !User.loggedin){
          // User isn’t authenticated
          $state.transitionTo("login");
          event.preventDefault();
        }
      });
    });
