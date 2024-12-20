const ElectronStore = require(`electron-store`);

const defaultPrintHistory = [];
const defaultSettings = {
    directory: ``,
    prefixes: [],
    printFilesAlreadyInDirectory: true,
    autoLaunch: false,
    deleteFileAfterPrinting: true,
    orientation: 'portrait',
};


class Storage {

    static electronStore;

    static init() {
        if (!Storage.electronStore) {
            Storage.electronStore = new ElectronStore();

            if(!Storage.has(`settings`)) {
                Storage.set(`settings`, defaultSettings);
            }

            if(!Storage.has(`printHistory`)) {
                Storage.set(`printHistory`, defaultPrintHistory);
            }
        }
    }

    /**
     * @param {string} key
     * @param {*} value
     */
    static set(key, value) {
        Storage.electronStore.set(key, value);
    }

    /**
     * @param {string} key
     * @return {any}
     */
    static get(key) {
        return Storage.electronStore.get(key);
    }

    /**
     * @param {string} key
     */
    static has(key) {
        return Storage.electronStore.has(key);
    }

    static get readyToPrint() {
        const settings = Storage.get(`settings`)
        return Boolean(
            settings
            && settings.directory
            && settings.prefixes
            && settings.prefixes.length > 0
        );
    }
}

exports.Storage = Storage;
