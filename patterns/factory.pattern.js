


class FactoryManager {
    constructor(...args) {
        this.facotories = new Map();

        args.forEach(a => this.facotories.set(a.type, a));
        console.log(this.facotories)
    }

    getFactory(type) {
        return this.facotories.get(type);
    }
};

class Factory1 {
    constructor() { }

    get type() {
        return "factory1";
    }
    hello() {
        console.log("Hello from", this.type)
    }
}

class Factory2 {
    constructor() { }

    get type() {
        return "factory2";
    }

    hello() {
        console.log("Hello from", this.type)
    }
};

const manager = new FactoryManager(
    new Factory1(),
    new Factory2()
);


const factory = manager.getFactory("factory1");
console.log(factory)
factory.hello();