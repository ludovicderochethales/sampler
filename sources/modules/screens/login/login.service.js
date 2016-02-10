/**
 * Created by Ludo on 04/12/2015.
 */
'use strict';

angular.module('app')
    .factory('Login', ['$resource','config', function($resource, config) {
        return $resource(config.baseUri+'/api/login', null,
            {
                login: {
                    method: 'POST'
                },
                isLoggedIn: {
                    method: 'GET',
                    url: config.baseUri+'/api/login/test'
                },
                logout: {
                    method: 'GET',
                    url: config.baseUri+'/api/login/logout'
                },
                changePassword: {
                    method: 'POST',
                    url: config.baseUri+'/api/login/password'
                }
            });
    }]);
