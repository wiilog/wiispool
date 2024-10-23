const {app, BrowserWindow} = require(`electron`);
const remoteMain = require(`@electron/remote/main`);
const path = require('node:path');
const Store = require(`electron-store`);

remoteMain.initialize();

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 960,
        height: 540,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            plugins: true,
            webSecurity: false,
            preload: path.join(__dirname, 'preload.js'),
        },
        autoHideMenuBar: true,
        icon: `wiilog.ico`,
        title: `Wiispool - v${app.getVersion()} [Wiilog - Sous licence]`,
    });

    remoteMain.enable(mainWindow.webContents);

    mainWindow.loadFile(`templates/index.html`).then(() => {
        if (isDevEnvironment()) {
            mainWindow.webContents.openDevTools();
        }
    });

    Store.initRenderer();
}

function isDevEnvironment() {
    return process.argv[2] === `--dev`;
}

app.whenReady().then(createWindow);
