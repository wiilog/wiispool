const fs = require(`node:fs`);
const pdfToPrinter = require(`pdf-to-printer`);
const chokidar = require(`chokidar`);
const remote = require(`@electron/remote`);

const {Storage} = require('./assets/js/utils/storage');

const {background} = remote.getGlobal('arguments') || {};

Storage.init();
if (background && !Storage.readyToPrint) {
    throw new Error(`Les paramètres du dossier d'impression et des préfixes sont requis pour lancer le processus.`);
}

Storage.init();

window.storage = Storage;
window.fs = fs;
window.pdfToPrinter = pdfToPrinter;
window.chokidar = chokidar;
window.remote = remote;
