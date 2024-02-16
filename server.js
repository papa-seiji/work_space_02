const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filepath) => {
        if (path.extname(filepath) === '.css') {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));


// // 静的ファイルの提供
// app.use(express.static(path.join(__dirname, 'public')));

// // Content Security Policy (CSP) ヘッダーの設定
// app.use((req, res, next) => {
//     res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' https://cdnjs.cloudflare.com https://www.gstatic.com; connect-src 'self' http://localhost:* ws://localhost:*");
//     next();
// });

// // クライアントとのソケット接続の処理
// io.on('connection', (socket) => {
//     console.log('A user connected');

//     // 初期値の送信
//     io.emit('update', count);

//     socket.on('change', (data) => {
//         count += data;
//         io.emit('update', count);
//     });

//     socket.on('disconnect', () => {
//         console.log('A user disconnected');
//     });
// });



app.get("/",(req,res) => {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection",(socket) => {
console.log("接続成功!!!!!");

socket.on("chat message",(msg) => {
    // console.log("メッセージ：" + msg)
    io.emit("chat message", msg);
    }); 
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`ポート番号： ${PORT} につながったよ`);
});