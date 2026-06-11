class Node {
    constructor(name) {
        this.name = name;
        this.state = null;
    }

    // This method will be overridden by child classes
    evaluate() {
        throw new Error("Evaluate method must be implemented by subclasses");
    }
}