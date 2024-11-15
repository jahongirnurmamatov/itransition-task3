const chalk = require('chalk');
const Table = require('ascii-table');
const { displayProbabilityMatrix, selectBestDice } = require('./diceProb');
const { FairRandomProtocol, SecureRandomGenerator } = require('./randomGenerators');

class Game {
    constructor(dice) {
        this.dice = dice;
        this.computerDice = null;
        this.userDice = null;
        this.isComputerTurn = false;
        this.matrix = this.dice.map(die => die.values);
        this.rl = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    start() {
        console.log(chalk.blue("Let's determine who makes the first move."));
        this.selectComputerDice();
    }

    selectComputerDice() {
        const { randomValue, key, hmac } = FairRandomProtocol.generateProof(2);
        console.log(chalk.green(`I selected a random value in the range 0..1 (HMAC=${hmac}).`));
        console.log(chalk.yellow("Try to guess my selection.\n0 - 0\n1 - 1\nX - exit\n? - help\n"));

        this.rl.question(chalk.cyan('Your selection: '), (userChoice) => {
            if (userChoice.toLowerCase() === 'x') {
                console.log(chalk.red("Exiting the game."));
                this.rl.close();
                return;
            }
            if (userChoice.toLowerCase() === '?') {
                displayProbabilityMatrix(this.matrix);
                return this.start();
            }

            if (userChoice !== '0' && userChoice !== '1') {
                console.log(chalk.red("Invalid choice. Please choose 0 or 1."));
                this.selectComputerDice();
                return;
            }

            console.log(chalk.green(`My selection: ${randomValue} (KEY=${key}).`));
            if (Number(userChoice) === randomValue) {
                console.log(chalk.green("You guessed correctly! You make the first move."));                
                this.chooseUserDice(false);
            } else {
                //computer selecting best die
                this.computerDice = this.dice[selectBestDice(this.matrix)]
                console.log(chalk.red(`You guessed it wrong! I make the first move and choose the [${this.computerDice.values.join(', ')}] dice.`));
                this.isComputerTurn = true;
                this.chooseUserDice(true);
            }
        });
    }

    chooseUserDice(computerStarts) {
        console.log(chalk.blue("Choose your dice:"));
        const table = new Table();
        this.dice.forEach((die, index) => {
            if (die !== this.computerDice) {
                table.addRow(`${index}`, `[${die.values.join(', ')}]`);
            }
        });
        console.log(table.toString());
        console.log(chalk.yellow("X - exit\n? - help\n"));

        this.rl.question(chalk.cyan('Your selection: '), (userChoice) => {
            if (userChoice.toLowerCase() === 'x') {
                console.log(chalk.red("Exiting the game."));
                this.rl.close();
                return;
            }
            if(userChoice=='?'){
                displayProbabilityMatrix(this.matrix);
                return this.chooseUserDice(computerStarts);
            }

            const selectedDiceIndex = parseInt(userChoice);
            if (isNaN(selectedDiceIndex) || selectedDiceIndex < 0 || selectedDiceIndex >= this.dice.length || this.dice[selectedDiceIndex] === this.computerDice) {
                console.log(chalk.red("Invalid choice. Please choose a valid dice index."));
                this.chooseUserDice(computerStarts);
                return;
            }

            this.userDice = this.dice[selectedDiceIndex];
            console.log(chalk.blue(`You choose the [${this.userDice.values.join(', ')}] dice.`));

            if (computerStarts) {
                this.throwComputer();
            } else {
                const reducedMatrix = this.matrix.filter((_, index) => index !== selectedDiceIndex);
                console.log(reducedMatrix);
                const bestIndexInReducedMatrix = selectBestDice(reducedMatrix);
                const actualIndex = this.dice.findIndex(die => die !== this.userDice && die.values === reducedMatrix[bestIndexInReducedMatrix]);         
                this.computerDice = this.dice[actualIndex];
                console.log(`I choose [${this.computerDice.values.join(', ')}] dice for myself`)
                this.throwUser();
            }
        });
    }

    throwComputer(userRoll) {
        console.log(chalk.green("It's time for my throw."));
        const { randomValue: computerValue, key: computerKey, hmac: computerHmac } = FairRandomProtocol.generateProof(6);
        console.log(chalk.green(`I selected a random value in the range 0..5 (HMAC=${computerHmac}).`));

        this.rl.question(chalk.cyan('Add your number modulo 6.\n0 - 0\n1 - 1\n2 - 2\n3 - 3\n4 - 4\n5 - 5\nX - exit\n? - help\n\nYour selection: '), (userSelection) => {
            if (userSelection.toLowerCase() === 'x') {
                console.log(chalk.red("Exiting the game."));
                this.rl.close();
                return;
            }
            if(userSelection=='?'){
                displayProbabilityMatrix(this.matrix);
                return this.throwComputer()
            }

            const userNumber = parseInt(userSelection);
            if (isNaN(userNumber) || userNumber < 0 || userNumber > 5) {
                console.log(chalk.red("Invalid choice. Please choose a number between 0 and 5."));
                this.throwComputer(userRoll);
                return;
            }

            console.log(chalk.green(`My number is ${computerValue} (KEY=${computerKey}).`));
            const computerResult = (computerValue + userNumber) % 6;
            const computerRoll = this.computerDice.values[computerResult];
            console.log(chalk.green(`The result for my throw is ${computerValue} + ${userNumber} = ${computerResult} (mod 6).`));
            console.log(chalk.blue(`\nMy throw is ${computerRoll}.\n`));

            if (userRoll) {
                this.decideWinner(userRoll, computerRoll);
            } else {
                this.throwComputer(computerRoll);
            }
        });
    }

    throwUser(computerRoll) {
        console.log(chalk.green("It's time for your throw."));
        const { randomValue: computerGuess, key: guessKey, hmac: guessHmac } = FairRandomProtocol.generateProof(6);
        console.log(chalk.green(`I selected a random value in the range 0..5 (HMAC=${guessHmac}).`));

        this.rl.question(chalk.cyan('Add your number modulo 6.\n0 - 0\n1 - 1\n2 - 2\n3 - 3\n4 - 4\n5 - 5\nX - exit\n? - help\n\nYour selection: '), (userSelection) => {
            if (userSelection.toLowerCase() === 'x') {
                console.log(chalk.red("Exiting the game."));
                this.rl.close();
                return;
            }
            if(userSelection=='?'){
                displayProbabilityMatrix(this.matrix);
                return this.throwUser();
            }

            const userNumber = parseInt(userSelection);
            if (isNaN(userNumber) || userNumber < 0 || userNumber > 5) {
                console.log(chalk.red("Invalid choice. Please choose a number between 0 and 5."));
                this.throwUser(computerRoll);
                return;
            }

            console.log(chalk.green(`My number is ${computerGuess} (KEY=${guessKey}).`));
            const userResult = (computerGuess + userNumber) % 6;
            const userRoll = this.userDice.values[userResult];
            console.log(chalk.green(`The result for your throw is ${computerGuess} + ${userNumber} = ${userResult} (mod 6).`));
            console.log(chalk.blue(`\nYour throw is ${userRoll}.\n`));

            if (computerRoll) {
                this.decideWinner(userRoll, computerRoll);
            } else {
                this.throwComputer(userRoll);
            }
        });
    }

    decideWinner(userRoll, computerRoll) {
        if (userRoll > computerRoll) {
            console.log(chalk.green.bold(`YOU WIN! 🎉 (${userRoll} > ${computerRoll})!`));
        } else if (userRoll < computerRoll) {
            console.log(chalk.red.bold(`I WIN! 😈 (${computerRoll} > ${userRoll})!`));
        } else {
            console.log(chalk.yellow(`It's a tie (${userRoll} = ${computerRoll})!`));
        }

        console.log(chalk.blue("\nStarting a new round...\n"));
        this.isComputerTurn = !this.isComputerTurn; // Toggle the turn
        if (this.isComputerTurn) {
            this.throwComputer();
        } else {
            this.throwUser();
        }
    }
}
module.exports = Game;