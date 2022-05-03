import {contextBridge,ipcRenderer} from 'electron'

contextBridge.exposeInMainWorld('ipcRenderer',{
    sendTest: (val:string) => ipcRenderer.sendSync('app-update',val)
})
