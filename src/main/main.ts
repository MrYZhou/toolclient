
import { webContents,ipcMain } from "electron"

const { app, BrowserWindow ,protocol } = require('electron')
const path = require('path')

/**解决监听器初始化未定义异常 */
const ElectronStore = require('electron-store');
ElectronStore.initRenderer();

// 主窗口创建
function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  if(process.env.npm_lifecycle_event =="electron:dev"){
    
    win.loadURL('http://localhost:3000')
    
    win.webContents.openDevTools()
    
  }else {
    win.loadFile('./dist/index.html')
  }
  

}

// 生命周期
app.whenReady().then(() => {
  createWindow()
  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
  protocol.registerFileProtocol('files', (request, callback) => {
    const url = request.url.substring(8)
    let path = decodeURI(url.split('?')[0])
    callback(path)
  })
 
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      
      createWindow()
    }
    
    
    
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 自定义监听
ipcMain.on('app-update', (event: Electron.IpcMainEvent, ...args) => {
      
  console.log(1213)
  event.returnValue = args
  
  // 其他处理逻辑
})

