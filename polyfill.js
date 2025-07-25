// polyfill.js - Fix for Hermes _toString issue
if (typeof global !== 'undefined') {
  // Polyfill for _toString method missing in Hermes
  if (!global._toString) {
    global._toString = function(obj) {
      return Object.prototype.toString.call(obj);
    };
  }
  
  // Fix for Firebase Firestore with Hermes
  if (!global.btoa) {
    global.btoa = require('base-64').encode;
  }
  
  if (!global.atob) {
    global.atob = require('base-64').decode;
  }
}