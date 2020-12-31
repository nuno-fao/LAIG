class DisplayInterface {
    constructor(callback) {
        this.callback = callback;
    }
    display() {
        this.callback();
    }
}