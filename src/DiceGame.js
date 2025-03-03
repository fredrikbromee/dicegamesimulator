// Dice game simulation logic

class DiceGame {
  constructor() {
    this.scores = [];
    this.currentPlayer = 0;
  }

  // Roll a die and return the result (1-6)
  rollDie() {
    return Math.floor(Math.random() * 6) + 1;
  }

  // Execute a single turn based on the strategy function
  executeTurn(strategyFn) {
    let turnScore = 0;
    let keepRolling = true;

    while (keepRolling) {
      const roll = this.rollDie();

      if (roll === 1) {
        return 0; // Lost all points for this turn
      }

      turnScore += roll;

      // Call the strategy function to decide whether to continue rolling
      const gameState = {
        myScore: this.scores[this.currentPlayer],
        opponentScores: this.scores.filter((_, i) => i !== this.currentPlayer),
        turnScore: turnScore,
        lastRoll: roll
      };

      try {
        keepRolling = strategyFn(gameState);
      } catch (error) {
        console.error('Strategy function error:', error);
        return 0;
      }
    }

    return turnScore;
  }

  // Play a complete multiplayer game
  playGame(strategies) {
    this.scores = new Array(strategies.length).fill(0);
    this.currentPlayer = Math.floor(Math.random() * strategies.length);
    let turns = 0;
    let winner = null;

    while (winner === null && turns < 200) {
      const turnResult = this.executeTurn(strategies[this.currentPlayer]);
      this.scores[this.currentPlayer] += turnResult;
      
      if (this.scores[this.currentPlayer] >= 100) {
        winner = this.currentPlayer;
      } else {
        this.currentPlayer = (this.currentPlayer + 1) % strategies.length;
      }
      turns++;
    }

    return {
      scores: [...this.scores],
      winner: winner !== null ? winner : -1,
      turns
    };
  }

  // Test solo performance (how quickly can the strategy reach 100 points)
  static testSoloPerformance(strategyFn, numGames = 1000) {
    let totalTurns = 0;
    let completedGames = 0;
    let fastestGame = Infinity;
    let slowestGame = 0;

    const game = new DiceGame();
    
    for (let i = 0; i < numGames; i++) {
      game.scores = [0];
      game.currentPlayer = 0;
      let turns = 0;
      
      while (game.scores[0] < 100 && turns < 200) {
        const turnResult = game.executeTurn(strategyFn);
        game.scores[0] += turnResult;
        turns++;
      }

      if (game.scores[0] >= 100) {
        completedGames++;
        totalTurns += turns;
        fastestGame = Math.min(fastestGame, turns);
        slowestGame = Math.max(slowestGame, turns);
      }
    }

    return {
      averageTurns: completedGames > 0 ? totalTurns / completedGames : Infinity,
      fastestGame: fastestGame === Infinity ? null : fastestGame,
      slowestGame: slowestGame === 0 ? null : slowestGame,
      gamesPlayed: numGames
    };
  }

  // Run tournament simulations with multiple strategies
  static runTournament(strategies, gamesPerMatch = 1000) {
    const wins = new Array(strategies.length).fill(0);
    const jumboFinishes = new Array(strategies.length).fill(0);
    const game = new DiceGame();

    // Play round-robin tournament
    for (let i = 0; i < gamesPerMatch; i++) {
      // Play one game with all strategies
      const gameResult = game.playGame(strategies);
      
      if (gameResult.winner !== -1) {
        wins[gameResult.winner]++;

        // Find last place (lowest score)
        let lowestScore = Infinity;
        let lastPlace = -1;

        for (let j = 0; j < gameResult.scores.length; j++) {
          if (gameResult.scores[j] < lowestScore) {
            lowestScore = gameResult.scores[j];
            lastPlace = j;
          }
        }

        if (lastPlace !== -1) {
          jumboFinishes[lastPlace]++;
        }
      }
    }

    // Calculate win rates and jumbo rates
    const winRates = wins.map(w => w / gamesPerMatch);
    const jumboRates = jumboFinishes.map(j => j / gamesPerMatch);

    return {
      winRates,
      totalGames: gamesPerMatch,
      numPlayers: strategies.length,
      jumboRates
    };
  }
}

export default DiceGame; 