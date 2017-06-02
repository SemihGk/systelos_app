// create the module and name it userApp
var userApp = angular.module('userApp', ['ngRoute', 'ui.router', 'ngMaterial', 'md.data.table', 'ngNotificationsBar']);

userApp
  .factory('User', ['$rootScope', '$http', '$q', '$timeout', '$location', 'notifications',
    function($rootScope, $http, $q, $timeout, $location, notifications) {

      function UserClass() {

      }

      var User = new UserClass();

      UserClass.prototype.getTasks = function(query) {
        var self = this;
        $http({
            method: 'GET',
            url: 'get_tasks',
            data: query
          })
          .success(function(response) {
              $rootScope.$emit('listtasks', response);
          })
          .error(function(response) {
            if (response.success) {
              $rootScope.$emit('listtasks', response);
            }
          });
      }

      UserClass.prototype.addTask = function(task) {
          console.log('addTas');
        var self = this;
        $http({
            method: 'POST',
            url: 'add_task',
            data: task
          })
          .success(function(response) {
              self.getTasks();
              self.showNotification('showSuccess', 'Added new task');
          })
          .error(function(response) {
            if (response.success) {
              self.getTasks();
              self.showNotification('showSuccess', 'Added new task');
            } else {
              self.showNotification('showError', 'Cannot Added new task');
            }
          });
      }

      UserClass.prototype.updateTask = function(task) {
        var self = this;
        $http({
            method: 'POST',
            url: 'update_task',
            data: task
          })
          .success(function(response) {
              self.getTasks();
              self.showNotification('showSuccess', 'Added new task');
          })
          .error(function(response) {
            if (response.success) {
              self.getTasks();
              self.showNotification('showSuccess', 'Added new task');
            } else {
              self.showNotification('showError', 'Cannot Added new task');
            }
          });
      }

      UserClass.prototype.removeTask = function(id) {
        var self = this;
        console.log(id);
        $http({
            method: 'POST',
            url: 'remove_task',
            data: {
                id: id
            }
          })
          .success(function(response) {
              self.getTasks();
              self.showNotification('showSuccess', 'Removed task');
          })
          .error(function(response) {
            if (response.success) {
              self.getTasks();
              self.showNotification('showSuccess', 'Removed task');
            } else {
              self.showNotification('showError', 'Cannot remove task');
            }
          });
      }

      UserClass.prototype.showNotification = function(type, msg) {
        notifications[type]({
          message: msg,
          hideDelay: 1500, //ms
          hide: true //bool
        });
      }


      return User;
    }
  ]) // factory
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state("tasks", {
        url: "/tasks",
        templateUrl: "pages/tasks.html",
        authenticate: true
    });
    // Send to login if the URL was not found
    $urlRouterProvider.otherwise("/tasks");
  })
  .controller('taskController', function($scope, User, $rootScope) {
    var self = this;
    $scope.selected = [];

    $scope.query = {
      order: 'duedate',
    //   limit: 5,
    //   page: 1
    };

    $scope.task = {
        title: null,
        description: null,
        duedate: new Date(),
        assignee: null
    };

    self.init = function() {
      User.getTasks($scope.query);
    }

    self.clickRow = function(task) {
        console.log(task);
        $scope.task = {
            title: task.title,
            description: task.description,
            duedate: new Date(task.duedate),
            assignee: task.assignee
        }
    }

    self.addTask = function() {
        User.addTask($scope.task);
    }

    self.removeTask = function(id) {
      User.removeTask(id);
    }

    $rootScope.$on('listtasks', function(event, args) {

      $scope.tasks = args;
    });
});
//
// userApp.run(function($rootScope, $state, User) {
//   $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
//     if (toState.authenticate && !User.loggedin) {
//       // User isn’t authenticated
//       $state.transitionTo("tasks");
//       event.preventDefault();
//     }
//   });
// });
