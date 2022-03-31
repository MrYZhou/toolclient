
import { webContents } from "electron"

const { app, BrowserWindow ,protocol } = require('electron')
const path = require('path')


function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      webSecurity: false,
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
