declare global {
  interface Window {
    ipcRenderer:{
      sendGitLogSolve:Function
    };
 }
}

export {};
