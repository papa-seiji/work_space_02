const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const sqlite3 = require('sqlite3').verbose(); // SQLite3モジュールをインポート

const app = express();
const server = http.createServer(app);
const io = new socketIO.Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
    },
});

const PORT = process.env.PORT || 3000;

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

// SQLite3データベースに接続
const db = new sqlite3.Database('mydatabase.db', (err) => {
    if (err) {
        console.error('Failed to connect to database:', err.message);
    } else {
        console.log('Connected to the database');
    }
});

// テーブルの作成（例）
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS counters (id INTEGER PRIMARY KEY AUTOINCREMENT, value INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT)");
});

// エンドポイントの定義
// app.get('/counters', (req, res) => {
//     // カウンターテーブルからデータを取得するクエリ例
//     db.all("SELECT * FROM counters", (err, rows) => {
//         if (err) {
//             res.status(500).send(err.message);
//         } else {
//             res.json(rows);
//         }
//     });
// });


// エンドポイントの定義：カウンターの増加
app.post('/increment', (req, res) => {
    // カウンターを増加させるロジックを実装
    counterValue++;
    // カウンターの値を全てのクライアントに送信
    io.emit('counterUpdate', counterValue);
    res.send('Counter incremented successfully');
});

// エンドポイントの定義：カウンターの減少
app.post('/decrement', (req, res) => {
    // カウンターを減少させるロジックを実装
    if (counterValue > 0) {
        counterValue--;
        // カウンターの値を全てのクライアントに送信
        io.emit('counterUpdate', counterValue);
        res.send('Counter decremented successfully');
    } else {
        res.status(400).send('Counter cannot be decremented further');
    }
});

// エンドポイントの定義：メッセージ送信
app.post('/messages', (req, res) => {
    // メッセージを保存するロジックを実装
    const { message } = req.body;
    if (message) {
        // メッセージを全てのクライアントに送信
        io.emit('chatMessage', message);
        res.send('Message sent successfully');
    } else {
        res.status(400).send('Message cannot be empty');
    }
});

// データベース接続終了時の処理
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Closed the database connection.');
        process.exit();
    });
});

// サーバーを起動
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
