// 必要なモジュールのインポート
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

// Expressアプリケーションの作成
const app = express();
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server,{
    cors:{
        origin:["http://localhost:3000"],
    },
})
// CSPを設定するミドルウェア
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self' http://localhost:* 'unsafe-inline'");
    next();
});

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, 'public')));

// Expressのルート設定
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// カウンターの初期値
let counterValue = 0;

// クライアントからの接続イベントを処理
io.on('connection', (socket) => {
    console.log('A user connected');

    // クライアントからのインクリメント要求を処理
    socket.on('increment', () => {
        counterValue++;
        // カウンターの値を全てのクライアントに送信
        io.emit('counterUpdate', counterValue);
    });

    // クライアントからのデクリメント要求を処理
    socket.on('decrement', () => {
        if (counterValue > 0) {
            counterValue--;
            // カウンターの値を全てのクライアントに送信
            io.emit('counterUpdate', counterValue);
        }
    });

    
    // メッセージ受信
    socket.on('chatMessage', (message) => {
        console.log('Received message:', message); // メッセージをログに出力

        // メッセージを全てのクライアントに送信
        io.emit('chatMessage', message);
    });
    

    // 切断イベントを処理
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// サーバーを起動する
const PORT = process.env.PORT || 3000;
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
  });

// "Hello World"というテキストをクライアントに送信
// app.get('/', (req, res) => {
//     res.send('Hello World');
// });
