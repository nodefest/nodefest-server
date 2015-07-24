/**
 * 2015年はSocket.IOではなくMQTTを使ってみます。
 * でもやってることは全部Socket.IOでできるので、まあ・・。
 *
 */
'use strict';

var mosca = require('mosca');
var server = new mosca.Server({
  http: {
    port: process.env.PORT || 8080,
    bundle: true,
    static: './'
  }
});


var clientData = {
  connected: 0
};
var paintData = {
  // order: { color: [], timestamp: 1234 }
};

server.on('clientConnected', function(client) {
    clientData.connected++;
    console.log('clientConnected', client.id, clientData.connected);
});

server.on('clientDisconnected', function(client) {
    clientData.connected--;
    console.log('clientDisconnected', client.id, clientData.connected);
});

server.on('published', function(packet) {
  console.log('published', packet.topic);
  var topic   = packet.topic;
  var payload = packet.payload.toString();

  // 誰かが塗った
  if ('nodefest-2015/rhino/paint' === topic) {
    var payloadArr = payload.split('@');
    var order = payloadArr[0];
    var paint = JSON.parse(payloadArr[1]);

    paintData[order] = paint;

    // その結果どうなったかまとめてを返す
    server.publish({
      topic: 'nodefest-2015/rhino/sync',
      payload: JSON.stringify(paintData)
    });
  }
});

// 途中から来た人に最新を返す
server.on('subscribed', function(topic) {
  console.log('subscribed', topic);
  server.publish({
    topic: 'nodefest-2015/rhino/sync',
    payload: JSON.stringify(paintData)
  });
});

server.on('ready', function() {
  console.log('Mosca server is up and running');
});
