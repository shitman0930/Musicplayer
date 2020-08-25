
function allowDrop(ev) {//其實不寫也沒關係 但停止物件的預設行為
    ev.preventDefault();
}

function drag(ev) {//拖動開始就這個功能, 就抓ID
    console.log(ev.target.id)//抓得到
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev, obj) {//放到右邊就這個功能丟到Tbook或Sbook
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");

    obj.appendChild(document.getElementById(data));//ev.target改成obj
}
var audio = document.getElementById("audio");
var song = document.getElementById("song");
//就這個啦 直接var父節點來操作play跟pause等跟點擊有關的事件
var ControlPanel = document.getElementById("ControlPanel");
//操作音量 function volumeChange
var vol = document.getElementById("vol");
var volValue = document.getElementById("volValue");
var music = document.getElementById("music");
var info = document.getElementById("info");
var info2 = document.getElementById("info2");
var duration = document.getElementById("duration");
var progress = document.getElementById("progress");
var book = document.getElementById("book");
var Sbook = document.getElementById("Sbook");
var Tbook = document.getElementById("Tbook");
var btnUpdateMusic = document.getElementById("btnUpdateMusic");
//var volP = document.getElementById("volP");省略掉 去switch加case
//var volM = document.getElementById("volM");省略掉 去switch加case
//var play = document.getElementById("play");
//var pause = document.getElementById("pause");跟暫停有關的都拿掉
//var stop = document.getElementById("stop");

//click點擊 change換歌 input(chrome)輸入事件 IE(明年就停了)的input是change
//使用者只要點擊任何按鈕 就傳過去function objEvent
ControlPanel.addEventListener('click', objEvent);
vol.addEventListener('input', volumeChange);
//不能傳參數 但可以自定義函數 selectedIndex就屬性 使用者選到哪首歌就哪首 012...
music.addEventListener('change', function () { changeMusic(music.selectedIndex) });
progress.addEventListener('input', setTimeBar);
//其他click事件都可以省略 因為都放到function objEvent
//play.addEventListener('click', playMusic);
//pause.addEventListener('click', pauseMusic);跟暫停有關的都拿掉
//stop.addEventListener('click', stopMusic);
//volP.addEventListener('click', pVolume);
//volM.addEventListener('click', mVolume);
//歌曲拖到右邊 不是drag而是dragstart
Sbook.addEventListener('dragstart', drag);
//把div的ondrop跟ondragover寫成監聽器 this在Tbook裡面就是Tbook 功能就是把曲目只丟回book而不是div
Tbook.addEventListener('drop', function () { drop(event, this) });
Tbook.addEventListener('dragover', allowDrop);


//歌曲拖到左邊 不是drag而是dragstart
Tbook.addEventListener('dragstart', drag);
//把div的ondrop跟ondragover寫成監聽器 this在Sbook裡面就是Sbook 功能就是把曲目只丟回book而不是div
Sbook.addEventListener('drop', function () { drop(event, this) });
Sbook.addEventListener('dragover', allowDrop);

btnUpdateMusic.addEventListener('click', updateMusic)

function updateMusic() {
    //移除目前下拉選單中的歌曲
    for (i = music.children.length - 1; i >= 0; i--) {
        music.removeChild(music.children[i]);
    }

    //加入歌單中的歌
    for (i = 0; i < Tbook.children.length; i++) {
        node = Tbook.children[i];
        //Tbook代入node
        var option = document.createElement("option");
        option.value = node.title;
        option.innerText = node.innerText;
        music.appendChild(option);
    }
    changeMusic(0);
}

//每個Sbook裡的歌曲都加上draggable = true
for (i = 0; i < Sbook.children.length; i++) {
    node = Sbook.children[i];
    //Sbook代入node
    node.draggable = true;
    node.id = "song" + (i + 1);

    var option = document.createElement("option");
    option.value = node.title;
    option.innerText = node.innerText;
    music.appendChild(option);
}
changeMusic(0);




//利用參數(staus) 把三個循環融合成一個函數
function setPlayerStates(status) {
    if (info2.innerText !== status) {
        info2.innerText = status
    }
    else { info2.innerText = ""; }
}

//function setLoop() {//真的功能在function getDuration
//    if (info2.innerText !== "單曲循環") {
//        info2.innerText = "單曲循環"
//    }
//    else { info2.innerText = ""; }
//}

//function setRandom() {//真的功能在function getDuration
//    if (info2.innerText !== "隨機播放") {
//        info2.innerText = "隨機播放"
//    }
//    else { info2.innerText = ""; }
//}

//function setAllLoop() {//真的功能在function getDuration
//    if (info2.innerText !== "全曲循環") {
//        info2.innerText = "全曲循環"
//    }
//    else { info2.innerText = ""; }
//}

function setTimeBar() {
    //console.log(progress.value);
    audio.currentTime = progress.value;
}
//將時間(秒)轉成幾分幾秒
function getTimeFormat(timeSec) {//取商數 取餘數 三元運算
    min = parseInt(timeSec / 60);
    sec = parseInt(timeSec % 60);
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;

    return min + ":" + sec;
}


//取得目前播放時間
function getDuration() {
    ////console.log(audio.duration);去w3c能看到 屬性 獲得該首歌音樂時間的總長度
    //console.log(parseInt(audio.currentTime));目前播放時間 就一直代來代去 提出去變getTimeFormat() 參數timeSec
    //時間"數值" duration
    duration.innerText = getTimeFormat(audio.currentTime) + " / " + getTimeFormat(audio.duration);
    //歌曲時間"百分比" progress
    progress.max = audio.duration;
    progress.value = audio.currentTime;
    console.log(progress.value)
    w = (audio.currentTime / audio.duration * 100) + "%";
    //console.log(w);
    progress.style.backgroundImage = "-webkit-linear-gradient(left,#b60000,#b60000 " + w + ", #c8c8c8 " + w + ",#c8c8c8)";

    if (audio.duration == audio.currentTime) {
        if (info2.innerText == "單曲循環") {
            index = music.selectedIndex//目前被選擇的曲目一直丟回去
            changeMusic(index)//傳目前被選擇的曲目
        }
        else if (info2.innerText == "隨機播放") {
            index = Math.floor(Math.random() * music.options.length)// 無條件捨去 抓全部曲目
            changeMusic(index)//傳目前被選擇的曲目
        }                                         //被選擇的曲目為最後一首
        else if (info2.innerText == "全曲循環" && music.selectedIndex == music.options.length - 1) {

            changeMusic(0);//回到第一首
        }
        else if (music.selectedIndex == music.options.length - 1) {
            //ControlPanel的第4個小孩(music stop play stop)
            stopMusic(ControlPanel.children[3]);
        }
        else {
            changeSong(1);//歌曲播完自動進入下一首
        }
    }
    else {
        setTimeout(getDuration, 1);
    }
}
//getDuration();

//把所有的判斷式集中在此一函數
//功能為判斷使用者按下哪一顆鈕
function objEvent(evt) {//evt是事件 evt.target是事件觸發的目標
    //console.log(evt.target);
    switch (evt.target.id) {
        case "play"://如果id是play 以下以此類推傳過去
            playMusic(evt.target);//把物件(obj)傳到播放功能
            break;
        case "pause":
            pauseMusic(evt.target);//把物件(obj)傳到暫停功能
            break;
        case "stop":
            stopMusic(evt.target);//把物件(obj)傳到停止功能
            break;
        case "presong":
            changeSong(0);//0就上一首
            break;
        case "pretime":
            changeTime(0);//0就減10秒
            break;
        case "nexttime":
            changeTime(1);
            break;
        case "nextsong":
            changeSong(1);
            break;
        case "muted":
            setMuted();
            break;
        case "volP":
            pVolume();
            break;
        case "volM":
            mVolume();
            break;
        case "loop":
            setPlayerStates("單曲循環");
            break;
        case "random":
            setPlayerStates("隨機播放");
            break;
        case "all loop":
            setPlayerStates("全曲循環");
            break;
        case "songbook":
            displaybook();
            break;
    }
}

//我的歌本
function displaybook() {//Cpython寫法? 不加大括號?
    if (book.className == "")
        book.className = "hidden";
    else
        book.className = "";
}

//靜音
function setMuted() {
    //隨機撥放 單曲循環 同一顆鈕按一下就開始或停止
    ////audio.volume = 0;
    //audio.muted = true;//api內建功能
    //把相反狀態丟回去 蠻常用 之前聽Colt英文看無~
    audio.muted = !audio.muted

}
//快轉與倒退
function changeTime(flag) {//旗標控制 快轉10秒 倒退10秒
    audio.currentTime = flag == 1 ? audio.currentTime + 10 : audio.currentTime - 10;
}
//上一首下一首
function changeSong(flag) {//旗標控制
    index = music.selectedIndex;//目前被選擇的曲目
    len = music.options.length;//抓全部曲目
    index = flag == 1 ? index + 1 : index - 1; //上一首 下一首
    //console.log(index);
    changeMusic(index);
    //    if (flag == 1) {
    //        index++;
    //    } else {
    //        index--
    //    }
}
//變更歌曲
function changeMusic(index) {
    //index就索引值 傳歌曲陣列
    song.src = music.options[index].value;//src就是option的value
    song.title = music.options[index].innerText;//歌曲一變 歌目就跟著變
    music.options[index].selected = true;//選到的歌 select會顯示在console
    audio.load();//換歌 回復選歌的初始狀態
    obj = music.nextElementSibling.nextElementSibling;//去同一層找select
    //console.log(obj);
    if (obj.innerText == ";")//pause鍵的時候 去同一層找select(spanplay-->hr-->Select)
        playMusic(obj);//播放狀態就繼續播歌
    //audio.load();
    //if (!audio.paused) {//paused 屬性(物件特徵)
    //    //spanplay-->hr-->Select
    //    playMusic(music.nextElementSibling.nextElementSibling);
    ////}
    ////audio.play();
}
//音量設定
volumeChange()//一開始就先跑才會顯示音量
function volumeChange() {
    //w3c 值是介於0到1之間的小數 vol.value是80所以/100為0.8
    audio.volume = vol.value / 100;
    //音量拖曳的值等於音量
    volValue.value = vol.value;
    //console.log(audio.volume);
    //音量拖曳的值用百分比表示
    z = volValue.value + "%";
    //值跟顏色一起動 把音量背景顏色變為左邊綠色 右邊灰色 用%計算
    vol.style.backgroundImage = "-webkit-linear-gradient(left,#009d72,#009d72 " + z + ", #c8c8c8 " + z + ",#c8c8c8)";
}

//音量 + 1
function pVolume() {
    vol.value++;
    volumeChange();//解耦 加完餵回去volumeChange 只適用JS 其他程式語言 架構會改變
}
//音量 - 1
function mVolume() {
    vol.value--;
    volumeChange();////解耦 加完餵回去volumeChange
}

//播放音樂
function playMusic(obj) {//obj就evt.target
    audio.play();
    obj.innerText = ";";//按撥放就會變成暫停鍵
    obj.id = "pause";//evt.target的"id"
    info.innerText = "目前播放：" + song.title;//跑馬燈顯示目前歌曲
    getDuration();
}
//音樂暫停
function pauseMusic(obj) {
    audio.pause();
    obj.id = "play";//evt.target的"id"
    obj.innerText = "4";//回復成播放鍵
    info.innerText = "音樂暫停";
}
//音樂停止
function stopMusic(obj) {//就停止撥放 暫停鍵變回撥放鍵 歸零
    audio.pause();
    //給個變數 以後好寫 同一層的節點(stop)前面 後面就next 上面parent 下面child
    sib = obj.previousElementSibling;
    sib.innerText = "4";//回復成播放鍵
    sib.id = "play";
    audio.currentTime = 0;
    info.innerText = "音樂停止";
}