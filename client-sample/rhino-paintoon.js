;(function(global) {
  'use strict';

  var mqtt = global.mqtt;

  var RhinoPaintoon = function() {
    this.client = mqtt.connect('ws://localhost:8080');
    this.client.on('connect', this._onConnect.bind(this));
  };

  RhinoPaintoon.prototype = {
    _onConnect: function() {
      this.client.on('message', this._onMessage.bind(this));
      this.client.subscribe('nodefest-2015/#');
      console.log('connected', this.client.options.clientId);
    },
    _onMessage: function(topic, payload) {
      if (topic === 'nodefest-2015/rhino/sync') {
        var paintData = JSON.parse(payload);
        Object.keys(paintData).forEach(function(key) {
          // なんとかならんかコレ
          global.rhino.shapes[key].paint = paintData[key];
        });
      }
    },
    paint: function(order, paint) {
      var payload = '' + order + '@' + paint;
      this.client.publish('nodefest-2015/rhino/paint', payload);
    }
  };

  global.RhinoPaintoon = new RhinoPaintoon();

}(window));
