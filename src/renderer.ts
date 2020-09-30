// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

// @ts-ignore
const  {dialog, Notification: _Notification } = require("electron").remote;


// console.log(dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }))
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
        }

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

setTimeout(()=>{
    var n = new Notification('状态更新提醒',{
        body: '你的朋友圈有3条新状态，快去查看吧electron'
    })
}, 3000);
