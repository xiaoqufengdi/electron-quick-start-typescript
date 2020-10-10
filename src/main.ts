import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import updateHandle from "./main/updateVersion"

let mainWindow: BrowserWindow | null = null;
function createWindow() {
  // Create the browser window.
    mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true
    },
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  app.setAppUserModelId("my.electron")
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  //try to update
  updateHandle(mainWindow)

});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.


//打开新窗口
let win: BrowserWindow | null = null;
ipcMain.on("openWindow", function (event ) {
    win = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences:{
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    // win.loadURL(path.join( __dirname, "./renderer/news.html"))
    win.loadURL("http://127.0.0.1:8080/news.html");
    win.webContents.openDevTools();
});