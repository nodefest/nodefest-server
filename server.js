/**
 * 2015年はSocket.IOではなくMQTTを使ってみます。
 * でもやってることは全部Socket.IOでできるので、まあ・・。
 *
 */
'use strict';

var mosca = require('mosca');
var server = new mosca.Server({
  http: {
    port: process.env.PORT || 80,
    logger: { level: 'warn' }
  }
});
if (process.env.NODE_ENV === 'production') {
  console.log = function() {};
}

// このデータをみんなで塗りあう
var paintData = {
  // order: { color: [], timestamp: 1234 }
};
// ここに参戦人数がはいる
var clientData = {
  // #COLOR_A: 0,
  // #COLOR_B: 1
};

server.on('published', function(packet) {
  console.log('published', packet.topic);
  var topic   = packet.topic;
  var payload = packet.payload.toString();

  // 誰かが塗った
  if ('nodefest-2015/rhino/paint' === topic) {
    var payloadArr = payload.split('@');
    var order = payloadArr[0];
    var paint = JSON.parse(payloadArr[1]);

    // データ更新
    paintData[order] = paint;

    // その結果どうなったかまとめてを返す
    server.publish({
      topic: 'nodefest-2015/rhino/sync',
      payload: JSON.stringify(paintData)
    });
    console.log(paintData);
  }
});

// 途中から来た人に最新を返す
server.on('subscribed', function(topic) {
  console.log('subscribed', topic);
  server.publish({
    topic: 'nodefest-2015/rhino/sync',
    payload: JSON.stringify(paintData)
  });

  server.publish({
    topic: 'nodefest-2015/client/sync',
    payload: JSON.stringify(clientData)
  });
});

server.on('clientConnected', function(client) {
  var color = client.id.split('@')[1];
  if (color in clientData) {
    clientData[color]++;
  } else {
    clientData[color] = 1;
  }
  console.log('client connected', clientData);
});

server.on('clientDisconnected', function(client) {
  var color = client.id.split('@')[1];
  if (color in clientData) {
    clientData[color]--;
  } else {
    clientData[color] = 0;
  }
  // 人が減った瞬間は別途知らせないといけない
  server.publish({
    topic: 'nodefest-2015/client/sync',
    payload: JSON.stringify(clientData)
  });
  console.log('client disconnected', clientData);
});

server.on('ready', function() {
  console.log('Mosca server is up and running');
});
