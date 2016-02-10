module app {

  'use strict';

  /**
   * Configures the application routes.
   */
  function routeConfig($stateProvider: angular.ui.IStateProvider,
                       $urlRouterProvider: angular.ui.IUrlRouterProvider,
                       gettext: angular.gettext.gettextFunction) {

    // Routes configuration
    $urlRouterProvider.otherwise('/sounds');

    /*
    }).when('/change_password', {
      controller : 'ChangePasswordController',
      templateUrl : 'views/change_password/change_password.html'
    }).when('/sounds', {
      controller : 'SoundsController',
      templateUrl : 'views/sounds/sounds.html',
      resolve : {
        loggedIn : function($q, $timeout, Login, $location, $rootScope,$localStorage) {
          return checkLoggedin($q, $timeout, Login, $location, $rootScope,$localStorage);
        }
      }
    }).when('/profile', {
      controller : 'ProfileController',
      templateUrl : 'views/profile/profile.html'
    }).otherwise({
      controller : 'SoundsController',
      templateUrl : 'views/sounds/sounds.html'
    });*/

    // Redirects users not logged in to login page on route changes
    var checkLoggedin = function($q, $timeout, Login, $location, $rootScope,$localStorage) {
      // Initialize a new promise
      var deferred = $q.defer();

      var logout = function() {
        delete $rootScope.user;
        delete $localStorage.token;
        // Needs a timeout to force a digest cycle, else the url is not
        // changed
        $timeout(function() {
          $location.url('/login');
        }, 0);
      };

      // Make an AJAX call to check if the user is logged in
      Login.isLoggedIn(function(user) {
        console.log('loggedIn : ', user);
        // Authenticated
        if (user !== '0') {
          deferred.resolve();
        }

        // Not Authenticated
        else {
          $rootScope.message = 'You need to log in.';
          deferred.reject();
          logout();
        }
      }, function(error) {
        logout();
      });

      return deferred.promise;
    };

    var checkNotLoggedIn = function($localStorage, $location, $timeout, $q) {
      console.log('checkNotLoggedIn');
      // Initialize a new promise
      var deferred = $q.defer();
      // Needs a timeout to force a digest cycle, else the url is not
      // changed
      if(angular.isDefined($localStorage.token)) {
        console.log('already logged in');
        deferred.reject();
        $timeout(function() {
          $location.url('/');
        }, 0);
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    };

    $stateProvider
      .state('app', {
        templateUrl: 'modules/shell/shell.html',
        controller: 'shellController as shell'
      })
      .state('app.login', {
        url: '/login',
        templateUrl: 'modules/screens/login/login.html',
        controller: 'LoginController as vm',
        data: {title: gettext('Login')},
        resolve : {
          notLoggedIn : function($localStorage, $location, $timeout, $q) {
            return checkNotLoggedIn($localStorage, $location, $timeout, $q);
          }
        }
      })
      .state('app.sounds', {
        url: '/sounds',
        templateUrl: 'modules/screens/sounds/sounds.html',
        controller: 'SoundsController as vm',
        data: {title: gettext('Home')},
        resolve : {
          loggedIn : function($q, $timeout, Login, $location, $rootScope,$localStorage) {
            return checkLoggedin($q, $timeout, Login, $location, $rootScope,$localStorage);
          }
        }
      })
      .state('app.favorites', {
        url: '/favorites',
        templateUrl: 'modules/screens/sounds/favorites.html',
        controller: 'SoundsController as vm',
        data: {title: gettext('Favorites')},
        resolve : {
          loggedIn : function($q, $timeout, Login, $location, $rootScope,$localStorage) {
            return checkLoggedin($q, $timeout, Login, $location, $rootScope,$localStorage);
          }
        }
      })
      .state('app.profile', {
        url: '/profile',
        templateUrl: 'modules/screens/profile/profile.html',
        controller: 'ProfileController as vm',
        data: {title: gettext('Profile')},
        resolve : {
          loggedIn : function($q, $timeout, Login, $location, $rootScope,$localStorage) {
            return checkLoggedin($q, $timeout, Login, $location, $rootScope,$localStorage);
          }
        }
      })
      .state('app.about', {
        url: '/about',
        templateUrl: 'modules/screens/about/about.html',
        controller: 'aboutController as vm',
        data: {title: gettext('About')}
      });

  }

  angular
    .module('app')
    .config(routeConfig);

}

