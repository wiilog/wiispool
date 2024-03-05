const fs = require(`node:fs`);
const pdfToPrinter = require(`pdf-to-printer`);

$(function () {
    $(`.manage-settings`).on(`click`, () => {
        $.get(`../templates/modal/settings.html`).then((template) => {
            $(`body`).append(template);

            const $modal = $(`.settings-modal`);
            const $prefixContainerTemplate = $(`.prefix-container-template`);
            $modal.modal(`show`);

            pdfToPrinter.getPrinters().then((printers) => console.log(printers));

            console.log($modal.find(`.prefixes-container`));
            $modal.find(`.prefixes-container`).html($prefixContainerTemplate.html());

            $modal.find(`.delete-line`).on(`click`, function () {
                $(this).closest(`.prefix-container`).remove();
            });

            $modal.find(`[data-dismiss=modal]`).on(`click`, () => {
                closeModal($modal);
            });

            $modal.find(`[type=submit]`).on(`click`, () => {
                saveSettings($modal);
            });
        });
    });
});

function closeModal($modal) {
    $modal.modal(`hide`);
    $modal.remove();
}

function initPrinters($modal) {
    /*pdfToPrinter.getPrinters().then((printers) => {
        const $options = printers.map(({name, deviceId}) => new Option(name, deviceId));

        $modal.find(`[name=printers]`).html($options.html());
    });*/
}

function saveSettings($modal) {
    const $directory = $modal.find(`[name=directory`);

    if(!$directory.val()) {
        Flash.add(Flash.ERROR, `Le champ <strong>test</strong> est requis.`);
    } else {
        const values = {
            directory: $directory.val(),
            test: "oui",
        };

        fs.writeFileSync(`../../configuration.json`, JSON.stringify(values), function(err) {
            console.log(err);
        });

        fs.readFile(`../../configuration.json`, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(data); // Affichage du contenu du fichier
        });
    }
}