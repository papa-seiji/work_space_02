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


// 日時の表示を更新
function updateDateTime() {
  // 現在の日時を取得
  const now = new Date();
  const year = now.getFullYear();
  let month = now.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  let day = now.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  let hours = now.getHours();
  if (hours < 10) {
    hours = '0' + hours;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  let seconds = now.getSeconds();
  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  // 日付と時刻を文字列に連結
  const dateTimeString = year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds;

  // 日時を表示する要素を取得し、日時を設定
  const datetimeElement = document.getElementById('datetime');
  datetimeElement.textContent = '現在の日時: ' + dateTimeString;
}

// ページロード時にカウンターと日時を更新
updateCounter();
updateDateTime();

// 1秒ごとに日時を更新
setInterval(updateDateTime, 1000);


// 目標の開幕日
const openingDay = new Date('2024-03-20').getTime();

// 1秒ごとにカウントダウンを更新
const countdown = setInterval(function() {
  // 現在の日時を取得
  const now = new Date().getTime();

  // 開幕日までの時間を計算
  const distance = openingDay - now;

  // 日、時間、分、秒を計算
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // カウントダウンの要素を取得して更新
  const countdownElement = document.getElementById('countdown');
  countdownElement.innerHTML = `${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`;

  // 開幕日に達した場合、カウントダウンを停止
  if (distance < 0) {
    clearInterval(countdown);
    countdownElement.innerHTML = '開幕しました！';
  }
}, 1000);

//パスワードが正しい場合にindex.htmlにリダイレクトする
function login() {
  const passwordInput = document.getElementById('password').value;
  const correctPassword = '1234'; // パスワードはここで設定

  if (passwordInput === correctPassword) {
    // パスワードが一致する場合、index.htmlにリダイレクト
    window.location.href = 'index.html';
    return false; // ページ遷移をキャンセル
  } else {
    alert('パスワードが間違っています。もう一度お試しください。');
    return false; // ページ遷移をキャンセル
  }
}
