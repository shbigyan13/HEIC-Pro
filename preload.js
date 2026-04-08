const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  selectFiles: () => ipcRenderer.invoke("select-files"),
  selectFolder: () => ipcRenderer.invoke("select-folder"),
  convertBatch: (data) => ipcRenderer.invoke("convert-batch", data),
  onProgress: (callback) => ipcRenderer.on("progress", callback)
});