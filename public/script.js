 // Socket.IOの接続を確立
 const socket = io();

// カウンターの初期値をローカルストレージから取得する
let counterValue = localStorage.getItem('counterValue') ? parseInt(localStorage.getItem('counterValue')) : 0;

// カウンターの初期値を表示する
updateCounter();

// カウンターの更新
function updateCounter() {
    // カウンターを表示する要素を取得し、カウンターの値を設定
    const counterElement = document.getElementById('counter');
    counterElement.textContent = counterValue;
}

// インクリメント
function increment() {
    counterValue++;
    updateCounter();
    // カウンターの値をローカルストレージに保存
    localStorage.setItem('counterValue', counterValue.toString());
}

// デクリメント
function decrement() {
    if (counterValue > 0) {
        counterValue--;
        updateCounter();
        // カウンターの値をローカルストレージに保存
        localStorage.setItem('counterValue', counterValue.toString());
    }
}

// Socket.ioからのカウンターの更新を処理
socket.on('counterUpdate', (value) => {
    counterValue = value;
    updateCounter();
});

// 以下、日時の表示やカウントダウンの更新などの処理を追加する

// 指定された日付までの残り日数を計算する関数
function calculateRemainingDays(targetDate) {
    const currentDate = new Date();
    const targetDateTime = new Date(targetDate).getTime();
    const currentDateTime = currentDate.getTime();
    const difference = targetDateTime - currentDateTime;
    const remainingDays = Math.ceil(difference / (1000 * 60 * 60 * 24));
    return remainingDays;
}

// カウントダウンの表示を更新する関数
function updateCountdown(targetDate) {
    const countdownElement = document.getElementById('countdown');
    const remainingDays = calculateRemainingDays(targetDate);
    countdownElement.textContent = `残り ${remainingDays} 日`;
}

// 指定された日付
const targetDate = '2024-03-20';

// カウントダウンの表示を更新
updateCountdown(targetDate);


//追加分//

// メッセージ送信ボタンにクリックイベントリスナーを追加
const sendButton = document.getElementById('send-button');
sendButton.addEventListener('click', () => {
    sendMessage();
});

// メッセージ送信関数の定義
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    
    if (message !== '') {
        socket.emit('chatMessage', message);
        messageInput.value = '';
        console.log('hogehoge');
    }
}

//追加分//

    // // メッセージ受信
// メッセージ受信
    const messageList = document.getElementById('messages'); // messageList を定義

    socket.on('chatMessage', (message) => {
    const newMessageItem = document.createElement('li');
    newMessageItem.textContent = message;
    messageList.appendChild(newMessageItem);

    if (messageList.children.length > 4) {
        messageList.removeChild(messageList.firstChild);
    }
});




    const messageContainer = document.getElementById('message-container');

    function displayMessage(message) {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);
    // スクロールを最下部に移動
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// メッセージを表示する例
displayMessage('応援メッセージ。');
