import {contextBridge,ipcRenderer} from 'electron'


// 获取git日志
contextBridge.exposeInMainWorld('ipcRenderer',{
    sendGitLogSolve: (val:any):Set<string> => ipcRenderer.sendSync('sendGitLogSolve',val)
})

// 最小化,最大化,关闭
contextBridge.exposeInMainWorld('ipcRenderer',{
    sendGitLogSolve: (val:any):Set<string> => ipcRenderer.sendSync('windowHan',val)
})


