const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            /*preload: path.join(app.getAppPath(), 'preload.js'),*/
            sandbox: false,
            enableRemoteModule: true,

            contextIsolation: false,
        },
    });
    win.webContents.openDevTools();

    win.loadFile('index.html');
    win.maximize();

}

app.on("ready", () => {

    let menu = Menu.buildFromTemplate([])
    Menu.setApplicationMenu(menu);
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    app.quit()
})