/**
 * Created by Ludo on 04/12/2015.
 */
'use strict';

angular.module('app')
    .factory('User', ['$resource','config', function($resource, config) {
        return $resource(config.baseUri+'/api/user', null,
            {
                chatHistory: {
                    method: 'GET',
                    url: config.baseUri+'/api/user/messages',
                    isArray: true
                },
                trophies: {
                    method: 'GET',
                    url: config.baseUri+'/api/Trophies/info',
                    isArray: true
                },
                getAll: {
                    method: 'GET',
                    isArray: true
                }
            });
    }]);
