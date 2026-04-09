


class Controls {
    constructor() {
        this.keys = {
            ArrowRight: false,
            ArrowLeft: false,
            ArrowDown: false,
            ArrowUp: false
        };
        this.#addEventListeners();
    }

    #addEventListeners() {
        document.addEventListener("keydown", (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = true;
            }
        });
        document.addEventListener("keyup", (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = false;
            }
        });
    };


}