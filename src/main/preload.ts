import {contextBridge,ipcRenderer} from 'electron'

contextBridge.exposeInMainWorld('render',ipcRenderer)
