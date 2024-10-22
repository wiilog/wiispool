import {Flash} from "./flash";
import {Storage} from "./storage";
import * as PrinterManager from "pdf-to-printer/src";
import * as fs from "fs";
import chokidar from "chokidar";

console.log(PrinterManager)

const IGNORED_FILES = /.pdf.[a-z]*/;
const DEFAULT_PRINT_OPTIONS = {
    scale: `noscale`,
    win32: [],
};

export class Printing {
    static watcher;

    static start(directory, printFilesAlreadyInDirectory) {
        this.watch(directory, printFilesAlreadyInDirectory).then((watcher) => {
            this.watcher = watcher;

            this.watcher.on(`add`, (path) => {
                Printing.print(path);
            });
        });
    }

    static stop(directory) {
        this.unwatch(directory)
    }

    static async watch(directory, printFilesAlreadyInDirectory) {
        return chokidar.watch(directory, {
            ignored: IGNORED_FILES,
            persistent: true,
            ignoreInitial: !printFilesAlreadyInDirectory,
        });
    }

    static unwatch(directory) {
        if(this.watcher) {
            this.watcher.unwatch(directory);
            this.watcher = null;
        }
    }

    static async print(path, options = DEFAULT_PRINT_OPTIONS) {
        const explodedPath = path.split(`\\`);
        const fileName = explodedPath[explodedPath.length - 1];
        const prefix = fileName.split(`_`)[0];
        const {orientation} = Storage.get(`settings`);
        const printer = getPrinterByPrefix(prefix);
        if(printer) {
            options.printer = printer;
            options.orientation = orientation;
            Flash.add(Flash.INFO, `Impression du fichier <strong>${fileName}</strong> en cours.`);

            await PrinterManager.print(path, options)
            updatePrintHistory(fileName);

            const {deleteFileAfterPrinting} = Storage.get(`settings`);
            if(deleteFileAfterPrinting) {
                deleteFile(path);
            }
        }
    }

    /**
     * @return {Promise<{name: string, deviceId: string}[]>}
     */
    static get printers() {
        return PrinterManager.getPrinters()
            .then((printers) => printers.map(({name, deviceId}) => ({name, deviceId})))
    }
}



function getPrinterByPrefix(prefix) {
    const {prefixes} = Storage.get(`settings`) || {};
    const prefixConfig = prefixes?.find(({name}) => name === prefix);
    return prefixConfig?.printer;
}

function updatePrintHistory(fileName) {
    const printHistory = Storage.get(`printHistory`);

    const date = (new Date());
    printHistory.push({
        fileName,
        date: `${date.toLocaleDateString()} à ${date.toLocaleTimeString()}`,
    });

    Storage.set(`printHistory`, printHistory);
}

function deleteFile(path) {
    fs.access(path, fs.constants.F_OK, (error) => {
        if(!error) {
            fs.unlink(path, () => {});
        }
    });
}
