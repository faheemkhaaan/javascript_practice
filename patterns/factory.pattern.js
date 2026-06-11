


class FactoryManager {
    constructor() {
        this.facotories = new Map();
    }

    addStratagy(name, stratagy) {
        this.facotories.set(name, stratagy);
    }

    getFactory(type) {
        return this.facotories.get(type);
    }
};

class Factory1 {
    constructor() { }

    hello() {
        console.log("Hello from", Factory1.name)
    }
}

class Factory2 {
    constructor() { }


    hello() {
        console.log("Hello from", this.type)
    }
};

const manager = new FactoryManager();

manager.addStratagy(Factory1.name, Factory1);
manager.addStratagy(Factory2.name, Factory2);

const Strategy = manager.getFactory(Factory1.name);

const factory1 = new Strategy();
factory1.hello()