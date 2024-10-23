const NOT_ALLOWED_KEYS = [`_`];
const PRINTER_HISTORY_OFFSET = 20;

const ENABLE_PRINTING_TEXT_BUTTON = `Démarrer`;
const DISABLED_PRINTING_TEXT_BUTTON = `Arrêter`;
const ENABLED_TEXT = `Wiispool écoute le dossier paramétré pour l'impression`;
const DISABLED_TEXT = `Wiispool n'est actuellement pas lancé`;

$(function () {
    const $enablePrinting = $(`.enable-printing`);

    const {autoLaunch} = storage.get(`settings`);
    if (autoLaunch) {
        enablePrinting($enablePrinting);
    }

    $(`.manage-settings`).on(`click`, function () {
        const modal = new Modal({
            template: `templates/modal-settings.html`,
            onOpen: function () {
                onOpenSettings(this);
            },
            onSave: function () {
                onSaveSettings(this);
            },
        });
        modal.open();     
    });

    $(`.print-history`).on(`click`, () => {
        const modal = new Modal({
            template: `templates/modal-print-history.html`,
            onOpen: function () {
                onOpenPrintHistory(this);
            },
        });
        modal.open();
    });

    $enablePrinting.on(`click`, function () {
        const $button = $(this);

        if ($button.hasClass(`enabled`)) {
            disablePrinting($button);
        } else {
            enablePrinting($button);
        }
    });
});

function addPrefix($modal, printers, name = undefined, printer = undefined) {
    const options = printers
        .map(({name, deviceId}) => `<option value="${deviceId}" ${deviceId === printer ? `selected` : ``}>${name}</option>"`, ``)
        .join(``);
    const $element = $(`
        <div class="prefix-container d-flex justify-content-between">
            <label class="wii-field-name w-100">
                Nom
                <input type="text" class="form-control" name="prefix" value="${name || ``}">
            </label>
            <div class="d-flex flex-column w-100">
                <label class="wii-field-name w-100">Imprimante</label>
                <div class="d-flex align-items-center">
                    <select class="form-control" name="printer">
                        ${options}
                    </select>
                    <div class="delete-line d-flex align-items-center" title="Supprimer le préfixe"></div>
                </div>
            </div>
        </div>
    `);

    $modal.find(`.prefixes-container`).append($element[0].outerHTML);
}

function enablePrinting($button) {
    if(!storage.readyToPrint) {
        Flash.add(Flash.ERROR, `Les paramètres du dossier d'impression et des préfixes sont requis pour lancer le processus.`);
    } else {
        const {directory, printFilesAlreadyInDirectory} = storage.get(`settings`);
        $button
            .addClass(`enabled`)
            .text(DISABLED_PRINTING_TEXT_BUTTON)
            .siblings(`span`)
            .text(ENABLED_TEXT);

        Printing.start(directory, printFilesAlreadyInDirectory);
    }
}

function disablePrinting($button) {
    $button
        .removeClass(`enabled`)
        .text(ENABLE_PRINTING_TEXT_BUTTON)
        .siblings(`span`)
        .text(DISABLED_TEXT);

    const {directory} = storage.get(`settings`);
    Printing.stop(directory);
}

function initSettingsValues($modal, printers) {
    const $prefixesContainer = $(`.prefixes-container`);
    $prefixesContainer.empty();

    const {
        directory,
        prefixes,
        printFilesAlreadyInDirectory,
        autoLaunch,
        deleteFileAfterPrinting,
        orientation,
    } = storage.get(`settings`);
    prefixes.forEach(({name, printer}) => addPrefix($modal, printers, name, printer));
    $modal.find(`[name=directory]`).val(directory);
    $modal.find(`[name=printFilesAlreadyInDirectory]`).prop(`checked`, printFilesAlreadyInDirectory);
    $modal.find(`[name=autoLaunch]`).prop(`checked`, autoLaunch);
    $modal.find(`[name=deleteFileAfterPrinting]`).prop(`checked`, deleteFileAfterPrinting);
    $modal.find(`[name=orientation][value=${orientation}]`).prop('checked', true);
}

function getPrintHistory($modal) {
    const printHistory = storage.get(`printHistory`);

    const $emptyHistory = $modal.find(`.empty-history`);
    const $printHistoryContainer = $modal.find(`.print-history-container`);
    const $clearHistory = $modal.find(`.clear-history`);

    $printHistoryContainer.empty();

    if(printHistory && printHistory.length > 0) {
        $emptyHistory.addClass(`d-none`);
        $printHistoryContainer.removeClass(`d-none`);
        $clearHistory.removeClass(`d-none`);

        printHistory
            .reverse()
            .slice(0, PRINTER_HISTORY_OFFSET)
            .forEach(({fileName, date}) => {
                $printHistoryContainer.append(`
                    <li class="list-group-item print-history-item">
                        <span>${fileName}</span>
                        <strong>${date}</strong>
                    </li>
                `);
            });
    } else {
        $emptyHistory.removeClass(`d-none`);
        $printHistoryContainer.addClass(`d-none`);
        $clearHistory.addClass(`d-none`);
    }
}

function onSaveSettings(modal) {
    const $modal = modal.$modal;
    const $directory = $modal.find(`[name=directory`);
    const prefixes = Array.from($modal.find(`.prefix-container`))
        .map((container) => {
            const $container = $(container);
            const name = $container.find(`[name=prefix]`).val();
            const printer = $container.find(`[name=printer]`).val();

            return {
                name,
                printer,
            };
        })
        .filter(({name, printer}) => name && printer);
    const printFilesAlreadyInDirectory = $modal.find(`[name=printFilesAlreadyInDirectory]`).is(`:checked`);
    const autoLaunch = $modal.find(`[name=autoLaunch]`).is(`:checked`);
    const deleteFileAfterPrinting = $modal.find(`[name=deleteFileAfterPrinting]`).is(`:checked`);

    const orientation =  $(`[name=orientation]:checked`).first().val();
    const hasDuplicatedPrefixes = prefixes
        .map(({name}) => name)
        .some((name, index, names) => names.indexOf(name) !== index)
    if (!$directory.val()) {
        Flash.add(Flash.ERROR, `Vous devez renseigner un chemin vers le dossier pour l'impression.`);
    } else if(hasDuplicatedPrefixes) {
        Flash.add(Flash.ERROR, `Un ou plusieurs noms de préfixes sont dupliqués.`);
    } else {
        const values = {
            directory: $directory.val(),
            prefixes,
            printFilesAlreadyInDirectory,
            autoLaunch,
            deleteFileAfterPrinting,
            orientation,
        };

        disablePrinting($(`.enable-printing`));
        storage.set(`settings`, values);

        modal.close();
        Flash.add(Flash.SUCCESS, `Les paramètrages ont bien été enregistrés.`);
    }
}

async function getChoosenDirectory() {
    const showDialog = await remote.dialog.showOpenDialog({
        properties: [`openDirectory`],
    });

    return showDialog.filePaths[0];
}

function clearHistory($modal) {
    storage.set(`printHistory`, []);
    getPrintHistory($modal);

    Flash.add(Flash.SUCCESS, `L'historique a bien été supprimé.`);
}

async function onOpenSettings(modal) {
    const $modal = modal.$modal;
    const printers = await Printing.getPrinters();

    initSettingsValues($modal, printers);
    $modal.find(`.add-prefix`).on(`click`, function () {
        addPrefix($modal, printers);
    });

    $modal.find(`.choose-directory`).on(`click`, async function () {
        await getChoosenDirectory().then((path) => {
            const cleanedPath = path.replace(`//`, `/`);
            $modal.find(`[name=directory]`).val(cleanedPath);
        });
    });

    $modal.on(`keydown`, `[name=prefix]`, function (event) {
       if(NOT_ALLOWED_KEYS.includes(event.key)) {
           event.preventDefault();
       }
    });

    $modal.on(`click`, `.delete-line`, function () {
        $(this).closest(`.prefix-container`).remove();
    });
}

function onOpenPrintHistory(modal) {
    modal.$modal.find(`.clear-history`).on(`click`, () => {
        clearHistory(modal.$modal);
    });

    getPrintHistory(modal.$modal);
}
