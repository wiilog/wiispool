const INFO = `info`;
const SUCCESS = `success`;
const ERROR = `danger`;
const LABELS = {
    [INFO]: `Information`,
    [SUCCESS]: `Succès`,
    [ERROR]: `Erreur`,
};
const SPINNER_WRAPPER_CLASS = `spinner-border-wrapper`;

class Flash {
    static INFO = INFO;
    static SUCCESS = SUCCESS;
    static ERROR = ERROR;

    static serverError(error = null, unique = false) {
        if(error) {
            console.error(`%cServer error: %c${error}`, ...[
                `font-weight: bold;`,
                `font-weight: normal;`,
            ]);
        }

        Flash.add(ERROR, `Une erreur est survenue lors du traitement de votre requête par le serveur`, true, unique);
    }

    static add(type, message, remove = true, unique = false, presentLoading = false) {
        console.log('test');
        const $alertContainer = $('.alerts-container');
        const $loader = $('<div/>', {
            class: SPINNER_WRAPPER_CLASS,
            html: $('<div/>', {
                class: `spinner-border spinner-border-sm text-light`,
                role: 'status',
                html: $('<span/>', {
                    class: 'sr-only',
                    text: 'Loading...'
                })
            })
        });

        if(unique) {
            Flash.clear();
        }

        const $alert = $('.alert-wrapper')
            .clone()
            .removeAttr('id')
            .addClass(`wii-alert-${type}`)
            .removeClass('d-none');

        $alert
            .find('.content')
            .html(message);

        $alert
            .find('.alert-content')
            .find('.type')
            .html(`<strong>${LABELS[type]}</strong> ${presentLoading ? $loader.html() : ``}`);

        $alertContainer.append($alert);

        if (remove) {
            $alert.delay(5500).fadeOut(500);

            setTimeout(() => {
                if ($alert.parent().length) {
                    $alert.remove();
                }
            }, 6000);
        }

        return $alert;
    }

    static clear($alert = undefined) {
        if($alert) {
            $alert.remove()
        } else {
            $('.alerts-container').empty();
        }
    }

    static presentFlashWhile(action = undefined, message = `Chargement...`) {
        const $alert = this.add(this.INFO, message, false, false, true);

        if (action) {
            action()
                .then((success) => {
                    if (!success) {
                        this.clear($alert);
                    }
                })
                .catch(() => {
                    this.clear();
                });
        }
    }
}

global.Flash = Flash;
