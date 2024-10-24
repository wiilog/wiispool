const {app, BrowserWindow} = require(`electron`);
const remoteMain = require(`@electron/remote/main`);
const path = require('node:path');
const Store = require(`electron-store`);
const packageJson = require('./package.json');

remoteMain.initialize();

function createWindow() {
    const background = app.commandLine.hasSwitch('background');

    global.arguments = {
        background,
    };

    const titleSuffix = background ? ' - Service' : ''

    const mainWindow = new BrowserWindow({
        width: 960,
        height: 540,
        show: !background,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            plugins: true,
            webSecurity: false,
            preload: path.join(__dirname, 'preload.js'),
        },
        autoHideMenuBar: true,
        icon: `wiilog.ico`,
        title: `Wiispool - v${packageJson.version}${titleSuffix}`,
    });

    remoteMain.enable(mainWindow.webContents);

    mainWindow.loadFile(`index.html`).then(() => {
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
