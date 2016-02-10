(function() {

  'use strict';

  angular
    .module('app')
    .config(mainConfig);

  /**
   * Configures the application (before running).
   */
  function mainConfig($provide,
                      config,
                      $httpProvider) {

    // Extend the $exceptionHandler service to output logs.
    $provide.decorator('$exceptionHandler', function($delegate, $injector) {
      return function(exception, cause) {
        $delegate(exception, cause);

        var logger = $injector.get('logger').getLogger('exceptionHandler');
        logger.error(exception + (cause ? ' (' + cause + ')' : ''));
      };
    });

    // Disable debug logs in production version
    $provide.decorator('$log', function($delegate) {
      if (!config.debug) {
        $delegate.log = angular.noop;
        $delegate.debug = angular.noop;
      }
      return $delegate;
    });


    // Redirects users not logged in to login page on http calls
    $httpProvider.interceptors.push(function($q, $location, $rootScope,
                                             $localStorage) {
      return {
        responseError : function(response) {
          if (response.status === 401) {
            delete $rootScope.user;
            if (!!$localStorage.token) {
              delete $localStorage.token;
              delete $rootScope.token;
              delete $rootScope.user;
            }
            $location.url('/login');
          }
          return $q.reject(response);
        },
        request : function(config) {
          if (!!config && !!config.url && config.url.indexOf($rootScope.baseUri+'/api') === 0
            && !!$localStorage.token) {
            // We add authentication headers
            config.headers['ApiToken'] = $rootScope.token;
          }
          return config;
        }
      };
    });

  }

})();

