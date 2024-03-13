const Store = require(`electron-store`);
const fs = require(`node:fs`);
const pdfToPrinter = require(`pdf-to-printer`);
const chokidar = require(`chokidar`);
const remote = require(`@electron/remote`);

const store = new Store();

if(!store.has(`settings`)) {
    const defaultValues = {
        directory: ``,
        prefixes: [],
        printFilesAlreadyInDirectory: true,
        autoLaunch: false,
        deleteFileAfterPrinting: true,
    };

    store.set(`settings`, JSON.stringify(defaultValues));
}

if(!store.has(`printHistory`)) {
    const defaultValue = [];

    store.set(`printHistory`, JSON.stringify(defaultValue));
}

window.storage = store;
window.fs = fs;
window.pdfToPrinter = pdfToPrinter;
window.chokidar = chokidar;
window.remote = remote;
