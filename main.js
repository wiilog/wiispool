const {app, BrowserWindow} = require(`electron`);
const remoteMain = require(`@electron/remote/main`);
const path = require('node:path');
const Store = require(`electron-store`);
const packageJson = require('./package.json');
const {Storage} = require('./assets/js/utils/storage');

remoteMain.initialize();

function createWindow() {
    Store.initRenderer();
    Storage.init();

    const background = isBackgroundMode();
    const readyToPrint = Storage.readyToPrint;
    global.arguments = {
        background,
        readyToPrint,
    };

    const titleSuffix = background ? ' - Service' : ''

    const mainWindow = new BrowserWindow({
        width: 960,
        height: 540,
        show: !background || !readyToPrint,
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

}

function isDevEnvironment() {
    return app.commandLine.hasSwitch('dev');
}
function isBackgroundMode() {
    return app.commandLine.hasSwitch('background');
}

app.whenReady().then(createWindow);
