

class Dice {
    constructor(values) {
        if (values.length !== 6 || values.some(isNaN)) {
            throw new Error('Each dice must have exactly 6 integer values.');
        }
        this.values = values;
    }

    roll() {
        const index = SecureRandomGenerator.generateInt(0, this.values.length - 1);
        return this.values[index];
    }
}

 class DiceParser {
    static parse(args) {
        if (args.length < 3) {
            throw new Error("At least 3 dice configurations are required.");
        }

        return args.map(arg => {
            const values = arg.split(',').map(Number);
            if (values.length !== 6 || values.some(isNaN)) {
                throw new Error(`Invalid dice configuration: "${arg}". Must contain 6 integers.`);
            }
            return new Dice(values);
        });
    }
}

module.exports = DiceParser;