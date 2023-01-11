import { webContents, ipcMain, app, BrowserWindow, protocol } from "electron"

import path from "path"
import { gitLog } from "./util/gitHash"
let xlsx = require("node-xlsx")
let fs = require("fs")

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
  if (process.env.npm_lifecycle_event == "client") {
    win.loadURL("http://localhost:3010")

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
  console.log(12112)
  event.returnValue = ""
  return
  let model = args[0]
  excelHandle(model.file, model.lie1, model.lie2)
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
// 禁用当前应用程序的硬件加速
// app.disableHardwareAcceleration()

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
function combineResult(result: any, lie1: number, lie2: number) {
  try {
    let map: Map<string, any> = new Map()
    let totalData = []
    for (let index = 1; index < result.length; index++) {
      const element = result[index]
      let id = element[lie1] as string

      let item = map.get(id)
      let price = 0
      if (item) {
        console.log(item, 2345)
        price = item[lie2]
      }
      let price2 = new Number(element[lie2])
      if (price2.toString() == "NaN") {
        price2 = 0
      }
      console.log(price, "价格")
      element[lie2] = price + Number(price2)
      // console.log(map,element,288);
      map.set(id, element)
    }

    map.forEach((k) => {
      result.push(k)
    })
    return result
  } catch (e) {
    //输出日志
    console.log("excel异常,error=%s", e)
  }
}
function resolveExcel(model: any, index: number, lie1: number, lie2: number) {
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
      console.log(itemData.data, 333, val)
      let array = itemData.data

      if (index == 0) {
        result.push(array[0])
      }

      for (let index = 1; index < array.length; index++) {
        const element = array[index]
        result.push(element)
      }
    }

    return result
  } catch (e) {
    //输出日志
    console.log("excel异常,error=%s", e)
  }
}
function excelHandle(modelList: any, lie1: number, lie2: number) {
  // 读取Excel数据
  let allData = [] as any
  // 获取所有key
  let index = 0
  modelList.forEach((element: string) => {
    let result = resolveExcel(element, index, lie1, lie2) as any
    console.log(result, 111)
    index++
    for (let index = 0; index < result.length; index++) {
      const element = result[index]
      allData.push(element)
    }
  })

  let totalData = combineResult(allData, lie1, lie2)
  console.log(totalData, "最终数据")
  // 导出数据
  const buffer = xlsx.build([{ name: "b1", data: totalData }]) // 拿到文件 buffer

  // 写入文件
  let time = +new Date()
  let desk = path.join(require("os").homedir(), "Desktop", `${time}out.xlsx`)
  console.log(desk, "保存目录")
  fs.writeFileSync(`${desk}`, Buffer.from(buffer))
}

// 热更新,暂时无效果
// try {
//   require('electron-reloader')(module,{});
// } catch (e) {
//   console.log(e);
// }
