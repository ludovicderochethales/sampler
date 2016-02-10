/**
 * Created by Ludo on 04/12/2015.
 */
'use strict';

angular.module('app')
    .controller('ChangePasswordController',
    function($scope, Login, alertService, $localStorage, $location, $rootScope) {
        $scope.changePassword = function () {
            Login.changePassword({
                oldPassword: $scope.oldPassword,
                newPassword: $scope.newPassword
            }, function(data) {
				$location.url('/sounds');
                alertService.addAlert('Mot de passe changé avec succès','success');
            }, function(error) {
                alertService.addAlert('Va chier connard !','danger');
            });
        }
    });
