import { webContents, ipcMain, app, BrowserWindow, protocol } from "electron";

import path from "path";
import { gitLog } from "./util/gitHash";

/**解决监听器初始化未定义异常 */

// 存储
const Store = require("electron-store");

const schema = {
  foo: {
    type: "number",
    maximum: 100,
    minimum: 1,
    default: 50,
  },
  config: {
    // fullscreen: false,
  },
  bar: {
    type: "string",
    format: "url",
  },
};

const store = new Store({ schema });
// 自定义函数
ipcMain.on("sendGitLogSolve", async (event: Electron.IpcMainEvent, ...args) => {
  // 执行命令
  try {
    let model = args[0];
    let result = await gitLog(model);
    console.log(result, 11);
    event.returnValue = result;
  } catch (error) {
    console.log(error);
    event.returnValue = [];
  }
});

ipcMain.on("windowHan", async (event: Electron.IpcMainEvent, ...args) => {
  // 执行命令
  try {
    let model = args[0];
    switch (model) {
      case "min":
        console.log("min");
        win.minimize();
        break;
      case "max":
        console.log("max");
        if (process.platform === "darwin") {
          // mac系统
          let state = store.get("config.fullscreen");
          store.set("config.fullscreen", !state);
          win.setFullScreen(!state);
        } else {
          // window系统
          console.log("window系统");
          let state = store.get("config.fullscreen");
          store.set("config.fullscreen", !state);
          state ? win.maximize() : win.unmaximize();
        }
        break;
      case "close":
        console.log("close");
        win.close();
        app.exit();
        break;

      case "openDev":
        win.webContents.openDevTools();
        break;
      default:
        console.log("default");
        break;
    }
    event.returnValue = "";
  } catch (error) {
    console.log(error, "winhandle");
  }
});

let win: BrowserWindow = null as any;
// 主窗口创建
function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    // transparent: true,
    // resizable: false,
    frame: false,
    titleBarStyle: "customButtonsOnHover",
    webPreferences: {
      // devTools: false, //不开启调试
      preload: path.join(__dirname, "preload.js"),
    },
  });
  // 隐藏顶部菜单
  win.setMenu(null);
  // 按16:10的缩放比例
  win.setAspectRatio(1.6);
  // 判断开发环境还是打包环境
  if (process.env.npm_lifecycle_event == "electron:dev") {
    win.loadURL("http://localhost:3000");

    win.webContents.openDevTools();
  } else {
    win.loadFile("./dist/index.html");
  }
}

// 生命周期
app.whenReady().then(() => {
  createWindow();
  process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
  protocol.registerFileProtocol("files", (request, callback) => {
    const url = request.url.substring(8);
    let path = decodeURI(url.split("?")[0]);
    callback(path);
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
