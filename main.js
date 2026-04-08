const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const sharp = require("sharp");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  mainWindow.loadFile("index.html");
}

app.whenReady().then(createWindow);

ipcMain.handle("select-files", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile", "multiSelections"],
    filters: [{ name: "Images", extensions: ["heic"] }]
  });
  return result.filePaths;
});

ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"]
  });
  return result.filePaths[0];
});

ipcMain.handle("convert-batch", async (event, { files, outputDir }) => {
  let completed = 0;

  for (const file of files) {
    const name = path.basename(file, ".heic");
    const outPath = path.join(outputDir, name + ".jpg");

    await sharp(file)
      .toColorspace("srgb")
      .jpeg({ quality: 95 })
      .toFile(outPath);

    completed++;
    mainWindow.webContents.send("progress", {
      completed,
      total: files.length
    });
  }

  return "done";
});
