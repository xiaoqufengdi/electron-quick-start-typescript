// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.


const { ipcRenderer } = require("electron");
const  { Notification: _Notification, dialog } = require("electron").remote;
const packageInfo = require("./package.json");
// import register from "./service-worker";
// const sw = require("./service-worker");


console.log(packageInfo);
console.log(dialog);

// import checkForUpdate from "./renderer/updaterVersionDialog";

/**
 * @method updateIndicator
 */
function updateIndicator():void {
/*    console.log("window.navigator.onLine: " + window.navigator.onLine);
    if (Notification.permission ===  "granted") {
        notice(window.navigator.onLine);
    }
    else{
        Notification.requestPermission().then(function(permission) {
            if(permission === 'granted'){
                console.log('用户允许通知');
                notice(window.navigator.onLine);
            }else if(permission === 'denied'){
                console.log('用户拒绝通知');
            }
        });
    }*/

    notice(window.navigator.onLine);
    document.querySelector("#network").innerHTML = window.navigator.onLine ? "在线":"离线"
}

/**
 * @method notice
 * 通知消息
 * @param{Boolean} isOnline
 */
function notice(isOnline: boolean):void{
    console.log("当前网络状态：" + (isOnline ? '已连接':'已断开'));
    console.log(_Notification);

    if (_Notification.isSupported()) {
        let options = {
            "title": "当前网络状态",
            "body":  isOnline ? '已连接':'已断开'
        };

        let myNotice = new _Notification(options);
        myNotice.show();
        console.log(myNotice);

    }else{
        console.log("当前系统不支持 Notification");
    }

/*    let myNotification = new Notification('当前网络状态',{
        body: isOnline ? '已连接':'已断开',
        tag: 'network',
        // icon: "xxx.jpg",
        requireInteraction: true
    });*/
}

//监听网络状态  只能
window.addEventListener("online", updateIndicator);
window.addEventListener("offline", updateIndicator);
updateIndicator();


/*********************************自动更新部分代码*******************************************************/
document.getElementById('version').innerText = packageInfo.version;

ipcRenderer.on("message", (event, text)=>{
    console.log(text);
    let container = document.getElementById('messages');
    let message = document.createElement('div');
    message.innerHTML = text;
    container.appendChild(message);

    if (_Notification.isSupported()) {
        let options = {
            "title": "更新消息",
            "body":  text
        };

        let myNotice = new _Notification(options);
        myNotice.show();

    }else{
        console.log("当前系统不支持 Notification");
    }
});


let downloadPercent: number = 0;
interface ShowMessageOptions{
    readonly type: string,
    readonly title: string,
    readonly message: string,
    readonly buttons: Array<string>
}

ipcRenderer.on("downloadProgress", (event, progressObj)=>{
    console.log(progressObj);
    downloadPercent = progressObj.percent || 0;
    console.log(downloadPercent);
});

ipcRenderer.on("startDownload",(event, info)=>{
    console.log("startDownload");
    console.log(info);
    // alert("startDownload");  //在具体项目中使用对话框决定是否下载
    // ipcRenderer.send("startDownload");
    let options: ShowMessageOptions = {
        type: "info",
        title: "软件更新",
        message: `检测到新版本${info.version},是否下载更新`,
        buttons:["确定", "取消"]
    };

    dialog.showMessageBox(options).then( (res)=>{
        console.log(res);
        if (res.response === 0)
        {
            console.log("开始下载");
            ipcRenderer.send("startDownload");
        }else{
            console.log("已经取消下载");
        }
    });
});


ipcRenderer.on("isUpdateNow", () =>{
    console.log("isUpdateNow");
    ipcRenderer.send("isUpdateNow");
    /*    const options = {
        type: "info",
        title: "软件更新",
        message: "是否现在更新",
        buttons:["确定", "取消"]
      };
      dialog.showMessageBox(options).then(  (res)=>{
          console.log( res);
          if (res.response === 0) {
              console.log("开始更新");
              //some code here to handle event
              ipcRenderer.send("isUpdateNow");
          }
      });*/
});







function checkForUpdate():void {
    console.log("checkForUpdate");
    ipcRenderer.send("checkForUpdate");
}

//检查更新
 checkForUpdate();



/**************************离线存储******************************/
document.querySelector("#btn").addEventListener("click", function () {
    ipcRenderer.send("openWindow");
}, false);


