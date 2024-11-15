const asciiTable = require('ascii-table');
const chalk = require('chalk');  // Import chalk library

// Function to simulate dice comparison between two dice
function simulateDiceComparison(die1, die2) {
    let die1Wins = 0;
    let die2Wins = 0;
    const totalComparisons = die1.length * die2.length;

    die1.forEach(face1 => {
        die2.forEach(face2 => {
            if (face1 > face2) {
                die1Wins++;
            } else if (face1 < face2) {
                die2Wins++;
            }
        });
    });

    // Calculate win probability for die1
    const die1WinProbability = (die1Wins / totalComparisons) * 100;
    return die1WinProbability;
}

// Main function to create and display an ASCII table with probabilities
function displayProbabilityMatrix(diceArray) {
    const numDice = diceArray.length;
    const table = new asciiTable();

    // Set table heading with dice arrays displayed as headers
    const header = ['Dice \\ Dice', ...Array.from({ length: numDice }, (_, i) => chalk.cyan(`[${diceArray[i].join(', ')}]`))];
    table.setHeading(...header);

    // Add rows for each dice comparison
    for (let i = 0; i < numDice; i++) {
        const row = [chalk.magenta(`[${diceArray[i].join(', ')}]`)];
        for (let j = 0; j < numDice; j++) {
            if (i === j) {
                row.push(chalk.gray('N/A'));  // Diagonal cells (self-comparison) are N/A
            } else {
                const probability = simulateDiceComparison(diceArray[i], diceArray[j]).toFixed(2);
                if (probability > 50) {
                    row.push(chalk.green(`${probability}%`));  // Green if die1 wins more than 50%
                } else {
                    row.push(chalk.red(`${probability}%`));    // Red if die1 wins less than 50%
                }
            }
        }
        table.addRow(...row);
    }

    // Print the table
    console.log(table.toString());
}

// Define dice arrays
const diceArray = [
    [2, 2, 4, 4, 9, 9],
    [6, 8, 1, 6, 8, 1],
    [3, 3, 5, 5, 7, 7]
];

// Run the display function
displayProbabilityMatrix(diceArray);



// C# optimized prob count

// public int CountWins(int[] a, int[] b) {
//     return a.Select(x => ~Array.BinarySearch(b, x, 
//         Comparer<int>.Create((x, y) => Math.Sign(x - y + 0.5)))).Sum();
// }