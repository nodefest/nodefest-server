# nodefest-server
http://nodefest.jp/ のサーバーサイドのリポジトリ。

現時点で開発してる年のコードはベタっと、過去の年のコードはその年数のディレクトリへ。

## 2015年サーバーサイド覚書
### サーバーを立てるまで
[NiftyCloudにNodeのサーバーを立てる - console.lealog();](http://lealog.hateblo.jp/entry/2015/07/31/214838)

### 起動
```sh
npm i -g pm2
NODE_ENV=production pm2 start server.js

# 止めたいとき
pm2 stop 0
```
