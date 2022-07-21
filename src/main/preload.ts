import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ipcRenderer", {
  /**
   * win窗口像主线程发送消息
   * @param val
   */
  // 最小化,最大化,关闭
  windowHan: (val: any): Set<string> => ipcRenderer.sendSync("windowHan", val),
  // 获取git日志
  sendGitLogSolve: (val: any): Set<string> =>
    ipcRenderer.sendSync("sendGitLogSolve", val),

  /**
   *  win的页面监听,此处是窗口监听主线程的消息
   */
  handleGitFileComplete: (msg: any) =>
    ipcRenderer.on("handleGitFileComplete", (event, arg) => {
      // todo 需要进行提示
      if (arg == 1) {
        return;
      } else if (arg == 2) {
        return;
      }
    }),
});
