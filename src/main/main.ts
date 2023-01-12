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
    height: 800,
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
    win.loadURL("http://127.0.0.1:3010")

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
  console.log("命令开始")
  excelHandle2(
    model.file,
    model.file2,
    model.lie1,
    model.lie2,
    model.lie3,
    model.lie4
  )
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
function combineResult(result: any, lie1: any, lie2: any) {
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
// 得到生成的数据
function resolveExcelTargetData(
  model: any,
  lie1: any,
  lie2: any,
  baseMap: any
) {
  let result = []
  try {
    let map: Map<string, any> = new Map()
    let sku = new Set<string>()
    let tableData = xlsx.parse(model)
    //循环读取表数据,有可能一张表有2个ecxel
    for (let val in tableData) {
      //下标数据
      let itemData = tableData[val]
      let array = itemData.data
      result.push(array[0])
      let index1 = getIndex(array[0], lie1)

      for (let index = 1; index < array.length; index++) {
        const element = array[index]
        
        sku.add(element[index1])
      }
    }

    sku.forEach((k) => {
      result.push([k, baseMap.get(k)])
    })
    return result
  } catch (e) {}
}
function getIndex(array: any, lie: any) {
  // 生成下标对应的关系
  let titleIndex = 0
  let number = new Number(lie)
  if(number.toString() == 'NaN'){
    for (let index = 0; index < array.length; index++) {
      const element = array[index]
      if (element == lie) {
        titleIndex = index
      }
    }
  }else{
    titleIndex = lie - 1
  }
  
  return titleIndex
}
// 得到初始化的skuid和价格的关系
function resolveExcelMap(model: any, lie1: any, lie2: any) {
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

      let index1 = getIndex(array[0], lie1)
      let index2 = getIndex(array[0], lie2)
      console.log(index1,index2,'列信息');

      for (let index = 1; index < array.length; index++) {
        const element = array[index]
        map.set(element[index1], element[index2])
      }
    }

    return map
  } catch (e) {}
}
function resolveExcel(model: any, index: any, lie1: any, lie2: any) {
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
function excelHandle(modelList: any, lie1: any, lie2: any) {
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

// 处理字段转移
function excelHandle2(
  base: any,
  target: any,
  lie1: any,
  lie2: any,
  lie3: any,
  lie4: any
) {
  // 读取Excel数据
  console.log(base, lie1, lie2)
  let map = resolveExcelMap(base, lie1, lie2) as any
  
  // 保存的数据
  let totalData = resolveExcelTargetData(target, lie3, lie4, map) as any
  console.log(totalData, "最终数据")

  // 列宽设置
  let width =[]
  let length = totalData[0].length
  for (let i = 0; i < totalData.length; i++){
    let item = totalData[i]
    width.push({ wch: item.length+1})
  }
  console.log(width,'宽度');
  const sheetOptions = {
    '!cols':width
  }

  // 导出数据
  const buffer = xlsx.build([{ name: "b1", data: totalData }],{sheetOptions}) // 拿到文件 buffer

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
