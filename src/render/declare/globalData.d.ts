declare global {
  interface Window {
    ipcRenderer: {
      [x: string]: any;
      sendGitLogSolve: Function;
    };
  }
}

export {};
