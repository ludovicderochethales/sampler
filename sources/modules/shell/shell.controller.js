(function() {

  'use strict';

  angular
    .module('app')
    .controller('shellController', ShellController);

  /**
   * Displays the SPA shell.
   * The shell contains the shared parts of the application: header, footer, navigation...
   * @constructor
   */
  function ShellController($locale,
                           $state,
                           logger,
                           config,
                           $scope, $rootScope, Sounds, alertService, notificationService, Login, $location,
                           $localStorage, $timeout) {

    logger = logger.getLogger('shell');

    /*
     * View model
     */

    var vm = this;

    vm.currentLocale = $locale;
    vm.languages = config.supportedLanguages;
    vm.isCollapsed = true;
    vm.isLoading = false;

    // To display alerts to user
    vm.alerts = alertService.getAlerts();
    vm.closeAlert = alertService.closeAlert;

    // To search sound with scope inheritance
    vm.search = {};

    var completeSoundList = [];

    function removeAccents(value) {
      return value
        .replace(/à|â/g, 'a')
        .replace(/ç/g, 'c')
        .replace(/é|è|ê/g, 'e')
        .replace(/ï|î/g, 'i')
        .replace(/ö|ô/g, 'o')
        .replace(/ù|û/g, 'u');
    }
    vm.ignoreAccents = function(item, searchQuery) {
      if (!searchQuery) {
        return true;
      }
      if(!item) {
        return false;
      }
      var text = removeAccents(item.toLowerCase());
      var search = removeAccents(searchQuery.toLowerCase());
      return text.indexOf(search) > -1;
    };

    vm.clear = function() {
      vm.search.query = '';
    };

    vm.callSound = function (sound){
      if ($rootScope.user.playingProfil == 1) {
        if (!vm.isMuted) {
          // We register sound, if false then fileload will play sound if true (already loaded) then we play
          if(createjs.Sound.registerSound({id: sound.Id, src: sound.Uri})) {
            createjs.Sound.play(sound.Id);
          }
        }
      } else {
        Sounds.play({soundId: sound.Id}, function(success) {

        }, function(error) {
          if(error.status === 403) {
            // Quota exceeded
            alertService.addAlert('Quota de lecture dépassé !','danger');
          }
        });
      }
    };

    vm.mute = function (){
      Sounds.muteUnmute(function(data) {
        vm.isMuted = data.ismuted;
      }, function(error) {
        if(error.status === 403) {
          // Quota exceeded
          alertService.addAlert('Quota de mute dépassé !','danger');
        }
      });
    };

    vm.callFavorite = function(sound){
      Sounds.favorite({soundId: sound.Id}, function(data) {
        sound.IsFavorite = data.isFavorite;
      });
    };

    notificationService.setMuteChangedHandler(function(isMuted, user){
      $scope.$apply(function(){
        vm.isMuted = isMuted;
        if (isMuted) {
          createjs.Sound.stop();
          alertService.addAlert(user + ' vient de couper le son.', 'danger');
        }
        else
          alertService.addAlert(user + ' vient de réactiver le son.', 'danger');
      });
    });

    vm.logout = function () {
      Login.logout(function() {
        delete $localStorage.token;
        delete $rootScope.token;
        delete $rootScope.user;
        $location.url('/login');
      });
    };

    vm.isCurrentPage = function(page) {
      return $location.url() === page;
    };

    // When a sound is loaded, it means we must play it
    createjs.Sound.on("fileload", function(event) {
      createjs.Sound.play(event.id);
    });

    // Updates sound play counter
    $scope.$on('soundPlayed', function($event, sound) {
      for(var i=0; i<vm.soundList.length; i++) {
        if(vm.soundList[i].Id === sound.Id) {
          vm.soundList[i].PlayedCount = sound.PlayedCount;
          break;
        }
      }
    });

    /* ELECTRON : Test to add file */
    if($rootScope.isElectron) {
      var remote = require('remote');
      var dialog = remote.require('dialog');
      var fs = require('fs');
      vm.openFile = function() {
        dialog.showOpenDialog({
          properties: [ 'openFile' ],
          filters: [
            { name: 'Sons', extensions: ['mp3', 'wav'] }
          ]
        }, function (fileNames) {
          if (fileNames === undefined) return;
          var fileName = fileNames[0];
          /*fs.readFile(fileName, 'utf-8', function (err, data) {
           document.getElementById("editor").value = data;
           });*/

          if(createjs.Sound.registerSound({id: fileName, src: fileName})) {
            createjs.Sound.play(fileName);
          }
        });
      }
    }

    /**
     * Toggles navigation menu visibility on mobile platforms.
     */
    vm.toggleMenu = function() {
      vm.menuHidden = !vm.menuHidden;
    };

    /**
     * Checks if the current state contains the specified name.
     * @param {string} name The state name to check.
     * @return {boolean} True if the current state contains the specified name.
     */
    vm.stateContains = function(name) {
      return $state.current.name.indexOf(name) !== -1;
    };

    /*
     * Internal
     */

    /**
     * Init controller.
     */
    function init() {
      logger.log('init');
    }

    init();

  }

})();
