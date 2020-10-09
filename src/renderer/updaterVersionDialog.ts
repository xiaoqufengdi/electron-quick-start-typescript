const { dialog, } = require("electron").remote;
const { ipcRenderer } = require("electron");

let version = window.location.hash.substring(1);
document.getElementById('version').innerText = version;

ipcRenderer.on("message", (event, text)=>{
    console.log(text);
    let container = document.getElementById('messages');
    let message = document.createElement('div');
    message.innerHTML = text;
    container.appendChild(message);
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
        message: "检测到新版本${info.version},是否下载更新",
        buttons:["确定", "取消"]
    };

    // @ts-ignore
    dialog.showMessageBox(options, function (index) {
        console.log(index);
        if (index === 0)
        {
            console.log("开始下载");
            ipcRenderer.send("startDownload");
        }else{
            console.log("已经取消下载");
        }
    });

    /*    this.$confirm(`检测到新版本${info.version}，是否下载更新？`, "提示", {
            confirmButtonText:"是",
            cancelButtonText: "否",
            type: "info"
        }).then(()=>{

            ipcRenderer.send("startDownload");

        }).catch(()=>{
            console.log("已经取消更新");
        })*/
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
      dialog.showMessageBox(options, function (index) {
          console.log("index: " +index);
          if (index === 0) {
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

export default checkForUpdate