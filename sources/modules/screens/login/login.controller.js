/**
 * Created by Ludo on 04/12/2015.
 */
'use strict';

angular.module('app')
  .controller('LoginController',
  function($scope, Login, alertService, $localStorage, $location, $rootScope, notificationService) {
      $scope.doLogin = function () {
          Login.login({
              userName: $scope.login,
              password: $scope.password
          }, function(data) {
              // Authentication successful
              $rootScope.user = {
                  userName: $scope.login,
                  playingProfil: $scope.playingProfil,
                  allowBroadcastSounds: $scope.allowBroadcastSounds
              };
              $localStorage.token = data.token;
              $rootScope.token = data.token;
              $location.url('/sounds');
              alertService.addAlert('Bienvenue '+$scope.login,'success');
              // We pull chat history
              notificationService.initChat();
          }, function(error) {
              alertService.addAlert('Veuillez vérifier votre login/mot de passe','danger');
              console.log('erreur login');
          });
      }
  });
