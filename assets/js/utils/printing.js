const IGNORED_FILES = /.pdf.[a-z]*/;
const DEFAULT_PRINT_OPTIONS = {
    scale: `noscale`,
    win32: [],
};

class Printing {
    static watcher;

    static start(directory, printFilesAlreadyInDirectory) {
        this.watch(directory, printFilesAlreadyInDirectory).then((watcher) => {
            this.watcher = watcher;

            this.watcher.on(`add`, (path) => proceedPrinting(path));
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
        }
    }

    static async getPrinters() {
        const printers = await pdfToPrinter.getPrinters();
        return printers.map(({name, deviceId}) => ({name, deviceId}));
    }
}

function proceedPrinting(path, options = DEFAULT_PRINT_OPTIONS) {
    const explodedPath = path.split(`\\`);
    const fileName = explodedPath[explodedPath.length - 1];
    const prefix = fileName.split(`_`)[0];
    const {orientation} = storage.get(`settings`);
    const printer = getPrinterByPrefix(prefix);
    if(printer) {
        options.printer = printer;
        options.orientation = orientation;
        Flash.add(Flash.INFO, `Impression du fichier <strong>${fileName}</strong> en cours.`);
        pdfToPrinter.print(path, options).then(() => {
            updatePrintHistory(fileName);

            const {deleteFileAfterPrinting} = storage.get(`settings`);
            if(deleteFileAfterPrinting) {
                deleteFile(path);
            }
        });
    }
}

function getPrinterByPrefix(prefix) {
    const {prefixes} = storage.get(`settings`) || {};
    const prefixConfig = prefixes?.find(({name}) => name === prefix);
    return prefixConfig?.printer;
}

function updatePrintHistory(fileName) {
    const printHistory = storage.get(`printHistory`);

    const date = (new Date());
    printHistory.push({
        fileName,
        date: `${date.toLocaleDateString()} à ${date.toLocaleTimeString()}`,
    });

    storage.set(`printHistory`, printHistory);
}

function deleteFile(path) {
    fs.access(path, fs.constants.F_OK, (error) => {
        if(!error) {
            fs.unlink(path, () => {});
        }
    });
}

global.Printing = Printing;
