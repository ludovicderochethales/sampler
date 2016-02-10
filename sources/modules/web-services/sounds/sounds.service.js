/**
 * Created by Ludo on 04/12/2015.
 */
'use strict';

angular.module('app')
  .factory('Sounds', ['$resource','config', function($resource, config) {
      return $resource(config.baseUri+'/api/Sounds/play/:soundId', null,
        {
            'play': { method:'GET' },
            'getList': {
                method: 'GET',
                isArray: true,
                url: config.baseUri+'/api/Sounds/info'
            },
            muteUnmute: {
                method: 'POST',
                url: config.baseUri+'/api/Sounds/mute'
            },
            isMuted: {
                method: 'GET',
                url: config.baseUri+'/api/Sounds/ismuted'
            },
            favorite: {
                method: 'POST',
                url: config.baseUri+'/api/Sounds/favorite'
            },
            history: {
                method: 'GET',
                params: {
                    count: 10
                },
                url: config.baseUri+'/api/Sounds/latest/:count',
                isArray: true
            }
        });
  }]);
