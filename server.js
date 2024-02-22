// 必要なモジュールのインポート
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

// Expressアプリケーションの作成
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
// const PORT = process.env.PORT || 3000;

// CSPを設定するミドルウェア
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
});

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, 'public')));

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

    // 切断イベントを処理
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// "Hello World"というテキストをクライアントに送信
// app.get('/', (req, res) => {
//     res.send('Hello World');
// });

// サーバーを起動する
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
