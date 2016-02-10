'use strict';

angular
    .module('app')
    .factory('alertService', alertService);

/**
 * alert service: displays alerts to inform user.
 */
function alertService() {

  /*
   * Public interface
   */

  var service = {};

  /**
   * Adds an alert with message and type
   * @param {string} message the message
   * @param {string} type criticity of alert (refer to bootstrap alert types)
   * @param {number} [timeout] - Timeout before alert is closed
   */
  service.addAlert = function(message,type,image,timeout) {
    if(!timeout) {
      timeout = 5000;
    }
    alerts.push({msg: message,type: type, image: image, timeout: timeout});
  };

  /**
   * Closes an alert by index
   * @param index
   */
  service.closeAlert = function(index) {
    alerts.splice(index, 1);
  };

  /**
   * Getter for alerts
   */
  service.getAlerts = function() {
    return alerts;
  };

  /*
   * Internal
   */

  var alerts = [];

  return service;
}
