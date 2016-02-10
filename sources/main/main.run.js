(function() {

  'use strict';

  angular
    .module('app')
    .run(main);

  /**
   * Entry point of the application.
   * Initializes application and root controller.
   */
  function main($locale,
                $rootScope,
                $state,
                gettextCatalog,
                _,
                config,
                restService,
                $localStorage,
                Login,
                notificationService) {

    /*
     * Root view model
     */

    var vm = $rootScope;

    vm.pageTitle = '';

    /**
     * Utility method to set the language in the tools requiring it.
     * @param {string=} language The IETF language tag.
     */
    vm.setLanguage = function(language) {
      var isSupportedLanguage = _.contains(config.supportedLanguages, language);

      // Fallback if language is not supported
      if (!isSupportedLanguage) {
        language = 'en-US';
      }

      // Configure translation with gettext
      gettextCatalog.setCurrentLanguage(language);
      $locale.id = language;
    };

    /**
     * Updates page title on view change.
     */
    vm.$on('$stateChangeSuccess', function(event, toState) {
      updatePageTitle(toState.data ? toState.data.title : null);
    });

    /**
     * Updates page title on language change.
     */
    vm.$on('gettextLanguageChanged', function() {
      updatePageTitle($state.current.data ? $state.current.data.title : null);
    });

    init();

    /*
     * Internal
     */

    /**
     * Initializes the root controller.
     */
    function init() {
      // Enable debug mode for translations
      gettextCatalog.debug = config.debug;

      vm.setLanguage();

      // Set REST server configuration
      restService.setServer(config.server);

      // At startup we check if user is logged in
      if(!!$localStorage.token) {
        $rootScope.token = $localStorage.token;
        Login.isLoggedIn(function(user) {
          // Success, user is logged in so we save it into rootScope
          $rootScope.user = {
            userName: user.userName,
            playingProfil: user.playingProfil,
            allowBroadcastSounds: user.allowBroadcastSounds
          };
          // We pull chat history
          notificationService.initChat();
        })
      }

      // We register base uri
      $rootScope.baseUri = config.baseUri;
      // And test if running inside Electron
      $rootScope.isElectron = window && window.process && window.process.versions['electron'];
    }

    /**
     * Updates the page title.
     * @param {?string=} stateTitle Title of current state, to be translated.
     */
    function updatePageTitle(stateTitle) {
      vm.pageTitle = gettextCatalog.getString('APP_NAME');

      if (stateTitle) {
        vm.pageTitle += ' | ' + gettextCatalog.getString(stateTitle);
      }
    }

  }

})();
