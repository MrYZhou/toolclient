
import { webContents,ipcMain,app, BrowserWindow ,protocol } from "electron"

// const {  } = require('electron')
import path from 'path';
import { gitLog } from "./util/gitHash";

/**解决监听器初始化未定义异常 */
const Store = require('electron-store');

const schema = {
	foo: {
		type: 'number',
		maximum: 100,
		minimum: 1,
		default: 50
	},
	bar: {
		type: 'string',
		format: 'url'
	}
};

const store = new Store({schema});


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
ipcMain.on('sendGitLogSolve', async (event: Electron.IpcMainEvent, ...args) => {
      
  
  // 执行命令
  try {
    let model = args[0]
    let result = await gitLog(model)
    console.log(result);
    event.returnValue = result
  } catch (error) {
    console.log(error);
    event.returnValue = []
  }
 
})

