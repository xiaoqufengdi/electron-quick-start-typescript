
const  { ipcMain} = require('electron');
import electron = require("electron");
import _BrowserWindow = electron.BrowserWindow;

const {autoUpdater} = require("electron-updater");

let uploadUrl: string = "http://192.168.3.107:8080/";

function updateHandle(mainWindow: _BrowserWindow)
{
    interface Message{
        readonly error: string,
        readonly checking: string,
        readonly updateAvailable: string,
        readonly updateNotAvailable: string,
        readonly downloadFinish: string,
    }
    let message: Message = {
        error: '检查更新出错',
        checking: '正在检查更新……',
        updateAvailable: '检测到新版本，正在下载……',
        updateNotAvailable: '现在使用的就是最新版本，不用更新',
        downloadFinish: "下载完成"
    };
    //避免自动下载强制更新
    autoUpdater.autoDownload = false;
    autoUpdater.setFeedURL(uploadUrl);
    autoUpdater.on('error', function (error:any) {
        console.log(message.error);
        console.log(error);
        mainWindow.webContents.send('message', message.error);
    });
    autoUpdater.on('checking-for-update', function () {
        console.log("checking-for-update");
        mainWindow.webContents.send("message", message.checking);
        // sendUpdateMessage(message.checking)
    });
    autoUpdater.on('update-available', function (info: any) {
        console.log("update-available");
        mainWindow.webContents.send("message", message.updateAvailable);
        //检测到新版本后监听渲染进程传来是否开始下载消息
        ipcMain.on("startDownload", ()=>{
            //手动下载更新
            autoUpdater.downloadUpdate().then((res: any) => {
                mainWindow.webContents.send("message", message.downloadFinish);
            });
        })

        mainWindow.webContents.send("startDownload", info);
    });
    autoUpdater.on('update-not-available', function (info: any) {
        console.log("update-not-available");
        mainWindow.webContents.send("message", message.updateNotAvailable);
    });

    // 更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj: any) {
        console.log("download-progress: " + progressObj);
        mainWindow.webContents.send('downloadProgress', progressObj)
    })
    autoUpdater.on('update-downloaded', function (info: any) {

        ipcMain.on('isUpdateNow', (e, arg) =>{
            console.log("开始更新isUpdateNow");
            //some code here to handle event
            autoUpdater.quitAndInstall();
        });
        console.log("update-downloaded");
        mainWindow.webContents.send('isUpdateNow')

    });

    ipcMain.on("checkForUpdate",()=>{
        console.log("checkForUpdate");
        //执行自动更新检查
        autoUpdater.checkForUpdates();
    })
}

// moudle.exports = updateHandle;
export default updateHandle

/*
// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
    mainWindow.webContents.send('message', text)
}
*/
