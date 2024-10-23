class Modal {
    $modal;
    template;
    onOpen;
    onSave;

    constructor(options) {
        this.template = options.template;
        this.onOpen = options.onOpen;
        this.onSave = options.onSave;
    }

    close() {
        if (this.$modal) {
            this.$modal.modal(`hide`);
            this.$modal.remove();
        }
    }
    
    async open() {
        const template = await $.get(this.template);
        let $modal = $(template);
        this.$modal = $modal;

        $(`body`).append($modal);

        $modal.on(`click`, `[data-dismiss=modal]`, () => {
            this.close();
        });

        $modal.find(`[type=submit]`).on(`click`, () => {
            if (this.onSave) {
                this.onSave.apply(this);
            }
        });

        $modal.on(`hidden.bs.modal`, () => {
            $modal.remove();
        });

        if (this.onOpen) {
            this.onOpen.apply(this, []);
        }

        $modal.modal(`show`);
    }
}
