const {app, BrowserWindow} = require(`electron`);

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: true,
        icon: `wiilog.ico`,
        title: `Wiispool - v${process.env.npm_package_version} [Wiilog - Sous Licence]`
    });

    mainWindow.loadFile(`templates/home.html`);
    mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);