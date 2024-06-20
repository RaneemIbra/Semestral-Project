const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 2100,
    height: 1270,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  win.loadURL(
    url.format({
      pathname: path.join(
        __dirname,
        "dist/semestral-project-app/browser/index.html"
      ),
      protocol: "file:",
      slashes: true,
    })
  );

  win.webContents.on("did-finish-load", () => {
    win.webContents
      .executeJavaScript(
        `
      new Promise((resolve) => {
        const width = document.documentElement.scrollWidth;
        const height = document.documentElement.scrollHeight;
        resolve({ width, height });
      });
    `
      )
      .then((size) => {
        win.setContentSize(size.width, size.height);
      })
      .catch((error) => {
        console.error("Error resizing window:", error);
      });
  });

  win.on("closed", () => {
    win = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
