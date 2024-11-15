
const Game = require('./middlewares/game');
const DiceParser = require('./model/diceModel');

try {
    const args = process.argv.slice(2);
    const dice = DiceParser.parse(args);
    const game = new Game(dice);
    game.start();
} catch (error) {
    console.error(error.message);
    console.log("Example usage: node game.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3");
}