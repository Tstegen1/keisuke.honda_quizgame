'use strict';
{
  //各要素を取得する
  const display = document.getElementById('container'); //クイズ画面
  const clickstart = document.getElementById('top'); //スタートボタン
  const question_img = document.getElementById('question_img'); //クイズのジャンケン画像
  const question_order = document.getElementById('question_order'); //クイズの質問内容
  const choices = document.getElementById('choices'); //答えの選択肢
  const btn = document.getElementById('btn'); //次へ行くボタン
  const showscore = document.getElementById('showscore'); //結果表示するウインドウ
  const scoreresult = document.getElementById('scoreresult'); //結果
  const showtime = document.getElementById('finishtime'); //クイズ終了後の時間
  const limit = document.getElementById('time'); //カウント表示
  const back = document.getElementById('back'); //リベンジウインドウ
  




  //問題を配列で保持→シャッフルで回してランダムに問題を出題する
  //正解は全てc[0]で固定する
  const quizSet = shuffle([
    {pic: '../img/gu.png', q: 'Q.負けてください', c: ['チョキ', 'グー', 'パー']},
    {pic: '../img/cho.png', q: 'Q.勝ってください', c: ['グー', 'チョキ', 'パー']},
    {pic: '../img/pa.png', q: 'Q.引き分けてください', c: ['paper', 'scissors', 'rock']},
    {pic: '../img/pa.png', q: 'Q.勝ってください', c: ['チョキ', 'パー', 'グー']},
    {pic: '../img/gu.png', q: 'Q.Please Draw.', c: ['rock', 'scissors', 'paper']},
    {pic: '../img/cho.png', q: 'Q.Please Lose.', c: ['パー', 'グー', 'チョキ']}
  ]);

  let currentNum = 0; //何問目の問題をといているか
  let isAnswered; //回答したかどうか
  let score = 0; //何問正解したか
  let starttime; //スタート時間
  let finishtime //終了時間


  //カウント処理
  function limits() {
    //経過時間の表示
    // limit.textContent = ((Date.now() - starttime) / 1000).toFixed(1);
    let time = new Date(Date.now() - starttime);
    let s = String(time.getSeconds()).padStart(2, '0');
    let ms = String(time.getMilliseconds()).padStart(3, '0');
    limit.textContent = `${s}:${ms}`;
    console.log(finishtime);

    //アロー関数？が呼び出された10ﾐﾘ秒後にlimitsを実行する
    finishtime = setTimeout(() => {
      limits()
    }, 10);
  }
  


  //スタートボタンを押した時のクリックイベント
  clickstart.addEventListener('click', () => {
    starttime = Date.now(); //スタートボタン押した時の現在時刻
    limits();
    clickstart.classList.add('none'); //クラスをつけて表示させない
    display.classList.remove('hidden'); //クイズ画面のクラスを外して表示する
    settingquiz(); //画面の構成をまとめた関数を呼び出す
  });

  //答えの選択肢をシャッフルする
  //選択肢3つのうち、最後の選択肢とランダムで選んだ選択肢を入れ替える
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {   //選択肢が最後のひとつになるまで繰り返す
      const j = Math.floor(Math.random() * (i + 1));  //選択肢の中からランダムに要素を選ぶ
      [array[j], array[i]] = [array[i], array[j]]; //最後の要素と入れ替える
    }
    return array; //シャッフルした配列を返す
  }


  //回答があっているか判定する
  function checkAnswer(li) {
    if (isAnswered === true) { //すでに回答した場合はそのまま終了する
      return;
    }
    isAnswered = true;

    if (li.textContent === quizSet[currentNum].c[0]) { //正解ならクラスをつける
      li.classList.add('maru');
      score++
    } else { //不正解ならクラスつける
      li.classList.add('batu');
    }
    btn.classList.remove('disabled'); //回答したらボタンのクラスを外す
  } 



  
  //画面の構成をまとめたもの
  function settingquiz() {
    isAnswered = false; //最初は回答していない

    //次の問題に行くと前の問題が残るためwhile文の一種のテクニック？を使う
    while (choices.firstChild) {   //最初の子要素（選択肢）が有る限り
      choices.removeChild(choices.firstChild); //最初の子要素（選択肢）を消す
    };
    while (question_img.firstChild) {
      question_img.removeChild(question_img.firstChild);
    };

    //質問を表示する
    question_order.textContent = quizSet[currentNum].q;

    //ジャンケン画像を表示する
    const img = document.createElement('img');
    img.src = quizSet[currentNum].pic;
    question_img.appendChild(img);
    
    //シャッフルされた選択肢
    const shufflechoice = shuffle([...quizSet[currentNum].c]);
  
    //シャッフルされた選択肢をひとつずつ取り出してchoiceに渡す
    shufflechoice.forEach(choice => {
      const li = document.createElement('li'); //li要素を作って
      li.textContent = choice; //表示
      li.addEventListener('click', () => { //クリックイベント
        checkAnswer(li);
      });
      choices.appendChild(li); //作ったli要素をulに加える
    });

    


    //最後の問題になったらボタンの表示変える
    if (currentNum === quizSet.length - 1) {
      btn.textContent = '結果をみる！';
    }
    
  }
  //関数実行
  settingquiz();

  //ボタンのクリックイベント
  btn.addEventListener('click', () => {
    if (btn.classList.contains('disabled') === true) { //ボタンにクラスついていたら以降の処理しない
      return;
    }
    btn.classList.add('disabled'); //クラスついていなかったらをつける

    if (currentNum === quizSet.length - 1) { //ボタン押した時に最後の問題なら

      clearTimeout(finishtime);//カウントストップ

      showscore.classList.remove('hidden'); //クラス外す
      showtime.textContent = `あなたのタイムは ${limit.textContent} 秒です！！`; //時間表示
      scoreresult.textContent = `結果: ${quizSet.length}問中 ${score}問 正解！！！`; //結果表示
      const resultNumberText = showtime.textContent.substring(8, 11)
      const resultNumber = Number(resultNumberText);
      console.log(resultNumber);

      const goalNumber = Number("15");
      console.log(goalNumber);

      //もし全問正解かつ15秒いないに回答できたら本田圭佑にリベンジできる
      if ((resultNumber < goalNumber) && (score == 6)) {
        back.classList.remove('hidden');
        showscore.classList.add('hidden');
      }

    } else {
      currentNum++; //最後じゃなければ現在の問題から進める
      settingquiz(); //次の問題呼ぶ
    }
  });
}
