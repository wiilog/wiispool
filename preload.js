const fs = require(`node:fs`);
const pdfToPrinter = require(`pdf-to-printer`);
const chokidar = require(`chokidar`);
const remote = require(`@electron/remote`);

const {Storage} = require('./assets/js/utils/storage');

const {background, readyToPrint} = remote.getGlobal('arguments') || {};

Storage.init();

window.storage = Storage;
window.fs = fs;
window.pdfToPrinter = pdfToPrinter;
window.chokidar = chokidar;
window.remote = remote;
window.wiispoolArgs = {
    background,
    readyToPrint
};
