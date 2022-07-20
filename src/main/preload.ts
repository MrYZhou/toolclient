import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ipcRenderer", {
  // 最小化,最大化,关闭
  windowHan: (val: any): Set<string> => ipcRenderer.sendSync("windowHan", val),
  // 获取git日志
  sendGitLogSolve: (val: any): Set<string> =>
    ipcRenderer.sendSync("sendGitLogSolve", val),
});
