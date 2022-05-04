import {contextBridge,ipcRenderer} from 'electron'

contextBridge.exposeInMainWorld('ipcRenderer',{
    sendGitLogSolve: (val:any):Set<string> => ipcRenderer.sendSync('sendGitLogSolve',val)
})
