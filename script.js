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

