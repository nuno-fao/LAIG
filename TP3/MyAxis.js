class MyAxis {
    constructor(axis, active) {
        this.axis = axis;
        this.active = active
    }
    display() {
        if (this.active == true) {
            this.axis.display();
        }
    }
}