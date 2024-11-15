#Dice Game with Fair Random Protocol
##Overview
This is a command-line dice game where two players (you and the computer) select dice, throw them, and determine the winner based on the outcome. The game includes a Fair Random Protocol to randomly choose which player starts the game, using HMAC (Hash-based Message Authentication Code) to ensure fairness.

##Features
- **Fair Random Selection**: The computer selects a random value and the user must guess it to determine who goes first.
- **Dice Selection**: Both players choose their dice, each with different values.
- **Game Flow**: Players take turns throwing dice, and the winner is determined by comparing the dice results.
- **ASCII Table Display**: The result of the game ("I win" or "You win") is displayed in an ASCII table, making the outcome more prominent.

##Requirements
- **Node.js**: This project requires Node.js to run. You can download it from here.

- **Dependencies**:

    - `chalk`: For colorful terminal output.
    - `ascii-table`: To create and display ASCII tables.

You can install the dependencies by running:
```
npm install
```
##Setup
   
1.Clone this repository to your local machine:
```
git clone https://github.com/yourusername/dice-game.git
cd dice-game```

2.Install the necessary dependencies:
```
npm install````

3. Run the game:

node main.js 2,3,5,4,5 5,4,6,7,7,5 4,8,9,5,3,4

##Game Instructions

1.**Starting the Game**:

    -The game starts by determining who makes the first move.
    -The computer selects a random value, and you have to guess it.
2.**Selecting Dice**:
    -After the first move is determined, you will be asked to choose one of the available dice.
    -The computer will also choose its dice, and the game proceeds to the throw.

3.**Throwing Dice**:
    -Players take turns selecting a number to add to their dice roll.
    -The dice values are used to determine the winner.

4.**Winning**:
    -After each round, the winner is displayed in an ASCII table with the message "I WIN!" or "YOU WIN!" in bold, making it stand out.

5.**Help**:
    -You can type ? at any point to display the current probability matrix for dice throws.

6.**Exit**:
    -Type X to exit the game at any time.

##Example Output
When you start the game and make your guess:

```
Let's determine who makes the first move.
I selected a random value in the range 0..1 (HMAC=4b54d0406599d603cbb4f66d1d06dc6aa080392d0349ecbf58acb76736a00853).
Try to guess my selection.
0 - 0
1 - 1
X - exit
? - help

Your selection: 1
My selection: 1 (KEY=5d10012844f975cc38b657d3c596ec78fc7c2edd95988d82c5698b512f2f87d8).
You guessed correctly! You make the first move.
```
After the game ends, the winner message is displayed in a table:
if you win
```YOU WIN! 🎉 (8 > 5)!````
or
```I WIN! 😈 (8 > 4)!``` 
in case you lose
or 
```It is a tie```
in case of tie.

##Contributing

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes.
4. Push to your branch.
5. Open a pull request.
