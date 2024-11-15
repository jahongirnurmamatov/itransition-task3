const AsciiTable = require('ascii-table');
const chalk = require('chalk');

// Function to simulate dice comparison between two dice
function simulateDiceComparison(die1, die2) {
    let die1Wins = 0;
    const totalComparisons = die1.length * die2.length;

    die1.forEach(face1 => {
        die2.forEach(face2 => {
            if (face1 > face2) {
                die1Wins++;
            }
        });
    });

    // Calculate win probability for die1
    const die1WinProbability = (die1Wins / totalComparisons) * 100;
    return die1WinProbability;
}

function padString(str, length) {
    return str.padEnd(length, ' ');
}

function displayProbabilityMatrix(diceArray) {
    console.log(chalk.cyanBright('Here are the possible winning probabilities of the given dice'));
    const numDice = diceArray.length;
    const table = new AsciiTable();

    const headers = ['Dice \\ Dice', ...diceArray.map(die => `[${die.join(', ')}]`)];
    const maxHeaderLength = Math.max(...headers.map(header => header.length));
    const formattedHeaders = headers.map(header => padString(chalk.cyan(header), maxHeaderLength));

    table.setHeading(...formattedHeaders);

    for (let i = 0; i < numDice; i++) {
        const rowName = padString(chalk.magenta(`[${diceArray[i].join(', ')}]`), maxHeaderLength);
        const row = [rowName];
        
        for (let j = 0; j < numDice; j++) {
            if (i === j) {
                row.push(padString(chalk.gray('N/A'), maxHeaderLength));
            } else {
                const rawProbability = simulateDiceComparison(diceArray[i], diceArray[j]);
                const formattedProbability = padString(
                    rawProbability > 50 ? chalk.green(`${rawProbability.toFixed(2)}%`) : chalk.red(`${rawProbability.toFixed(2)}%`),
                    maxHeaderLength
                );
                row.push(formattedProbability);
            }
        }

        table.addRow(...row);
    }

    console.log(table.toString());
}

// Function to select the best dice among given dice based on highest average win probability
function selectBestDice(diceArray) {
    const numDice = diceArray.length;
    let bestDiceIndex = 0;
    let highestAverageWinProbability = 0;

    for (let i = 0; i < numDice; i++) {
        let totalWinProbability = 0;
        let numComparisons = 0;

        for (let j = 0; j < numDice; j++) {
            if (i !== j) {
                totalWinProbability += simulateDiceComparison(diceArray[i], diceArray[j]);
                numComparisons++;
            }
        }

        const averageWinProbability = totalWinProbability / numComparisons;
        if (averageWinProbability > highestAverageWinProbability) {
            highestAverageWinProbability = averageWinProbability;
            bestDiceIndex = i;
        }
    }
    return bestDiceIndex;
}

module.exports = { displayProbabilityMatrix, selectBestDice };
