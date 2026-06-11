const NodeState = {
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE',
    RUNNING: 'RUNNING'
};
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
class Selector extends Node {
    constructor(name, children = []) {
        super(name);
        this.children = children;
    }

    evaluate() {
        for (let child of this.children) {
            const result = child.evaluate();

            if (result === NodeState.SUCCESS) {
                this.state = NodeState.SUCCESS;
                return this.state;
            }
            if (result === NodeState.RUNNING) {
                this.state = NodeState.RUNNING;
                return this.state;
            }
        }
        // If all children fail, the selector fails
        this.state = NodeState.FAILURE;
        return this.state;
    }
}
class Sequence extends Node {
    constructor(name, children = []) {
        super(name);
        this.children = children;
    }

    evaluate() {
        for (let child of this.children) {
            const result = child.evaluate();

            if (result === NodeState.FAILURE) {
                this.state = NodeState.FAILURE;
                return this.state;
            }
            if (result === NodeState.RUNNING) {
                this.state = NodeState.RUNNING;
                return this.state;
            }
        }
        // If all children succeed, the sequence succeeds
        this.state = NodeState.SUCCESS;
        return this.state;
    }
}

class Task extends Node {
    constructor(name, actionCallback) {
        super(name);
        // The callback holds the actual game logic
        this.actionCallback = actionCallback;
    }

    evaluate() {
        // Execute the logic and store the result
        this.state = this.actionCallback();
        console.log(`[Task: ${this.name}] evaluated to ${this.state}`);
        return this.state;
    }
}
const blackboard = {
    isHungry: true,
    foodNearby: true
};

// 2. Create the Leaf Nodes (Tasks & Conditions)
const checkHunger = new Task("Check Hunger", () => {
    return blackboard.isHungry ? NodeState.SUCCESS : NodeState.FAILURE;
});

const checkFood = new Task("Check Food", () => {
    return blackboard.foodNearby ? NodeState.SUCCESS : NodeState.FAILURE;
});

const eatFood = new Task("Eat Food", () => {
    console.log("Eating the food... yum!");
    blackboard.isHungry = false; // Action changes the world state
    return NodeState.SUCCESS;
});

const wander = new Task("Wander", () => {
    console.log("Wandering around aimlessly...");
    return NodeState.SUCCESS;
});

// 3. Construct the Tree
// The sequence: Must be hungry AND food must be nearby AND then eat.
const forageSequence = new Sequence("Forage", [checkHunger, checkFood, eatFood]);

// The root: Either try to forage, OR just wander.
const rootBehavior = new Selector("Root AI", [forageSequence, wander]);

// 4. Run the Tree (This would normally happen in your game loop / tick)


// console.log("--- First Tick ---");
// rootBehavior.evaluate();

// console.log("\n--- Second Tick ---");
// rootBehavior.evaluate();



const wolfBehavior = new Selector("Wolf AI", [
    // Priority 1: If starving, break flock and attack closest rabbit
    new Sequence("Hunt Alone", [
        new Task("Is Starving?", () => blackboard.hunger > 0.8 ? NodeState.SUCCESS : NodeState.FAILURE),
        new Task("Find Closest Prey", () => targetSystem.locateRabbit()),
        new Task("Charge Target", () => movement.seek(blackboard.target)) // Pure steering force
    ]),

    // Priority 2: If a threat is near, flee together as a panic stampede
    new Sequence("Panic Flight", [
        new Task("Is Human Near?", () => sensorySystem.detectHuman() ? NodeState.SUCCESS : NodeState.FAILURE),
        new Task("Flock Flee", () => movement.applyBoidForces({
            separation: 2.0, // High separation because they are panicking
            alignment: 1.0,
            cohesion: 0.5
        }))
    ]),

    // Priority 3: Default behavior is to travel peacefully as a pack
    new Sequence("Pack Travel", [
        new Task("Flock with Pack", () => movement.applyBoidForces({
            separation: 1.0,
            alignment: 1.0,
            cohesion: 1.5 // High cohesion to keep the pack tight
        }))
    ])
]);

wolfBehavior.evaluate();