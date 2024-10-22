import {Modal as BSModal} from 'bootstrap';
const DIRECTORY_PATH = `templates/`;

export class Modal {
    /**
     * @var {jQuery}
     */
    $modal;

    /**
     * @var {BSModal}
     */
    bsModal;

    /**
     * @var {string}
     */
    path;

    onOpen;
    onSave;

    constructor(options) {
        this.path = options.path;
        this.onOpen = options.onOpen;
        this.onSave = options.onSave;
    }

    close() {
        if (this.$modal) {
            this.bsModal.hide();
            this.$modal.remove();
        }
    }

    async open() {
        const template = await $.get(DIRECTORY_PATH + this.path);
        this.$modal = $(template);
        $(`body`).append(this.$modal);

        this.bsModal = new BSModal(this.$modal[0]);

        this.$modal.on(`click`, `[data-dismiss=modal]`, () => {
            this.close();
        });

        this.$modal.find(`[type=submit]`).on(`click`, () => {
            if (this.onSave) {
                this.onSave.apply(this);
            }
        });

        this.$modal.on(`hidden.bs.modal`, () => {
            this.$modal.remove();
        });

        if (this.onOpen) {
            this.onOpen.apply(this, []);
        }

        this.bsModal.show();
    }
}
