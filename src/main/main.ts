import { webContents, ipcMain, app, BrowserWindow, protocol } from "electron"

import path from "path"
import { gitLog } from "./util/gitHash"
let xlsx = require("node-xlsx")
let fs = require("fs")
/**解决监听器初始化未定义异常 */

// 存储
const Store = require("electron-store")

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
}

const store = new Store({ schema })
let win: BrowserWindow = null as any
// 主窗口创建
function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    transparent: true,
    // resizable: false,
    frame: false,
    titleBarStyle: "customButtonsOnHover",
    webPreferences: {
      // devTools: false, //不开启调试
      preload: path.join(__dirname, "preload.js"),
    },
  })
  // 隐藏顶部菜单
  win.setMenu(null)

  // 按16:10的缩放比例
  // win.setAspectRatio(1.6);

  // 判断开发环境还是打包环境
  if (process.env.npm_lifecycle_event == "electron:dev") {
    win.loadURL("http://localhost:3000")

    win.webContents.openDevTools()
  } else {
    win.loadFile("./dist/index.html")
  }
}

// 自定义函数
ipcMain.on("sendGitLogSolve", async (event: Electron.IpcMainEvent, ...args) => {
  // 执行命令
  try {
    let model = args[0]
    let result = await gitLog(model)
    console.log(result, 11)
    event.returnValue = result
  } catch (error) {
    console.log(error)
    event.returnValue = []
  }
})

// excel处理
ipcMain.on("excelHandle", (event: Electron.IpcMainEvent, ...args) => {
  let model = args[0]
  excelHandle(model)
  event.returnValue = ""
})

ipcMain.on("windowHan", async (event: Electron.IpcMainEvent, ...args) => {
  // 执行命令
  try {
    let model = args[0]
    switch (model) {
      case "min":
        console.log("min")
        win.minimize()
        break
      case "max":
        console.log("max")
        if (process.platform === "darwin") {
          // mac系统
          let state = store.get("config.fullscreen")
          store.set("config.fullscreen", !state)
          win.setFullScreen(!state)
        } else {
          // window系统
          console.log("window系统")
          let state = store.get("config.fullscreen")
          store.set("config.fullscreen", !state)
          state ? win.maximize() : win.unmaximize()
        }
        break
      case "close":
        console.log("close")
        win.close()
        app.exit()
        break

      case "openDev":
        win.webContents.openDevTools()
        break
      default:
        console.log("default")
        break
    }
    event.returnValue = ""
  } catch (error) {
    console.log(error, "winhandle")
  }
})

// 生命周期
app.whenReady().then(() => {
  createWindow()
  process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true"
  protocol.registerFileProtocol("files", (request, callback) => {
    const url = request.url.substring(8)
    let path = decodeURI(url.split("?")[0])
    callback(path)
  })

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})
function  resolveExcel(model: any){
  let result = []
  try {
    let map: Map<string, any> = new Map()
    let tableData = xlsx.parse(model)
    console.log(tableData, 112)
    //循环读取表数据
    for (let val in tableData) {
      //下标数据
      let itemData = tableData[val]
      //循环读取用户表数据
      console.log(itemData.data, 333)
      let array = itemData.data
      result.push(array[0])
      for (let index = 1; index < array.length; index++) {
        const element = array[index]
        let id = element[0] as string

        let item = map.get(id)
        let price = 0
        if(item){
          console.log(item,2345);
          price = item[2]
        }
        
        element[2] = price + Number.parseFloat(element[2])
        console.log(map,element,288);
        map.set(id, element)
      }
    }

    map.forEach(k=>{
      console.log(k,321343124);
      result.push(k)
    })
    console.log(result,34320000);
    //输出用户表数据
    // 导出数据
    const buffer = xlsx.build([{ name: "jsliang", data: result }]) // 拿到文件 buffer

    // 写入文件
    let time = +new Date()
    let desk = path.join(require("os").homedir(), "Desktop", `${time}out.xlsx`)

    fs.writeFileSync(`${desk}`, Buffer.from(buffer))
  } catch (e) {
    //输出日志
    console.log("excel异常,error=%s", e)
  }
}
function excelHandle(modelList: any) {
  // 读取Excel数据
  console.log(modelList, 11)
  // for (let index = 0; index < modelList.length; index++) {
  //   const element = modelList[index];
  //   resolveExcel(element)
  // }
  
}
