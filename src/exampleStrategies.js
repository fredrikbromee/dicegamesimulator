export const exampleStrategies = [
  {
    name: "Stop at 20",
    strategy: "(gameState) => { return gameState.turnScore < 20; }"
  },
  {
    name: "Adaptive (Based on Position)",
    strategy: `(gameState) => {
      const maxOpponentScore = Math.max(...gameState.opponentScores);
      // Play aggressively if behind
      if (gameState.myScore < maxOpponentScore) {
        return gameState.turnScore < 25;
      }
      // Play safely if ahead
      return gameState.turnScore < 15;
    }`
  },
  {
    name: "Catch-up Strategy",
    strategy: `(gameState) => {
      // If I'm behind, stop at 25. If I'm winning, stop at 18
      const maxOpponentScore = Math.max(...gameState.opponentScores);
      if (gameState.myScore < maxOpponentScore) {
        return gameState.turnScore < 25;  // More aggressive when behind
      }
      return gameState.turnScore < 18;    // More conservative when ahead
    }`
  },
  {
    name: "End Game Strategy",
    strategy: `(gameState) => {
      // Need this many points to win
      const pointsToWin = 100 - gameState.myScore;
      
      // If we're very close to winning and can win this turn
      if (pointsToWin <= 25) {
        // Only keep rolling if we need a reasonable amount more
        // and haven't accumulated too many points
        return gameState.turnScore < pointsToWin && gameState.turnScore < 20;
      }
      
      // If not in end game, play normally
      const maxOpponentScore = Math.max(...gameState.opponentScores);
      if (gameState.myScore < maxOpponentScore) {
        return gameState.turnScore < 20; // Slightly aggressive
      }
      return gameState.turnScore < 15;   // Conservative
    }`
  },
  {
    name: "Dynamic Risk",
    strategy: `(gameState) => {
      const maxOpponentScore = Math.max(...gameState.opponentScores);
      const pointsToWin = 100 - gameState.myScore;
      
      // If we can win this turn, keep rolling until we do
      if (gameState.turnScore < pointsToWin && pointsToWin <= 25) {
        return true;
      }
      
      // Adjust risk based on game situation
      if (gameState.myScore < 50) {
        // Early game: moderate risk
        return gameState.turnScore < 20;
      } else if (gameState.myScore < maxOpponentScore) {
        // Behind in late game: high risk
        return gameState.turnScore < 25;
      } else {
        // Ahead in late game: low risk
        return gameState.turnScore < 15;
      }
    }`
  },
  {
    name: "Roll Count Strategy",
    strategy: `(gameState) => {
      // Stop after 3 rolls unless we have a low score
      if (gameState.rollCount >= 3) {
        return gameState.turnScore < 15;  // Only continue if score is very low
      }
      return gameState.turnScore < 20;    // Normal threshold for early rolls
    }`
  }
]; 