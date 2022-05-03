declare global {
  interface Window {
    ipcRenderer:{
      sendTest:Function
    };
 }
//  interface IpcRenderer{
//   sendTest:(args:string)=>void
//  }
}

export {};
