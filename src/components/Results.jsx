import React, { useState } from 'react';

const Results = ({ strategies, onDeleteStrategy }) => {
  const [selectedCode, setSelectedCode] = useState(null);
  const simulatedStrategies = strategies.filter(s => s.results !== null);

  return (
    <div className="results-content">
      <table className="results-table">
        <thead>
          <tr>
            <th data-tooltip="The name and code of your strategy">Strategy</th>
            <th data-tooltip="How the strategy performs in single-player mode">Solo Performance</th>
            <th data-tooltip="How the strategy performs against other strategies">Tournament Results</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {strategies.map((strategy, index) => (
            <React.Fragment key={index}>
              <tr className={strategy.results ? '' : 'pending-strategy'}>
                <td>
                  <div className="code-preview-container">
                    <span className="strategy-name" data-tooltip="Hover to view the strategy's code">
                      {strategy.name}
                    </span>
                    <pre className="code-tooltip">
                      {strategy.strategy}
                    </pre>
                  </div>
                </td>
                <td>
                  {strategy.results ? (
                    <div>
                      <div 
                        className={getTurnsClass(strategy.results.averageTurns)}
                        data-tooltip="Average number of turns needed to reach 100 points in solo play. Lower is better."
                      >
                        Avg. Turns: {strategy.results.averageTurns.toFixed(1)}
                      </div>
                      <div 
                        className="small-text"
                        data-tooltip="Best: Fewest turns needed to win. Worst: Most turns needed to win."
                      >
                        Best: {strategy.results.fastestGame} | 
                        Worst: {strategy.results.slowestGame}
                      </div>
                    </div>
                  ) : '-'}
                </td>
                <td>
                  {strategy.results?.tournamentResults ? (
                    <div>
                      <div 
                        className={getTournamentClass(
                          strategy.results.tournamentResults.winRate,
                          strategy.results.tournamentResults.numPlayers
                        )}
                        data-tooltip={`Win rate in tournaments. Green: Above expected (better than 1/${strategy.results.tournamentResults.numPlayers}), Yellow: Within 75% of expected, Red: Below 75% of expected.`}
                      >
                        Win Rate: {(strategy.results.tournamentResults.winRate * 100).toFixed(1)}%
                      </div>
                      <div 
                        className={getJumboClass(
                          strategy.results.tournamentResults.jumboRate,
                          strategy.results.tournamentResults.numPlayers
                        )}
                        data-tooltip={`How often this strategy finishes in last place. Green: Better than expected (below 1/${strategy.results.tournamentResults.numPlayers}), Yellow: Up to 50% worse than expected, Red: More than 50% worse than expected.`}
                      >
                        Jumbo Rate: {(strategy.results.tournamentResults.jumboRate * 100).toFixed(1)}%
                      </div>
                    </div>
                  ) : '-'}
                </td>
                <td>
                  <button
                    className="delete-strategy"
                    onClick={() => onDeleteStrategy(index)}
                    data-tooltip="Remove this strategy"
                  >
                    ×
                  </button>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const getTurnsClass = (turns) => {
  if (turns <= 15) return 'high-performance';
  if (turns <= 20) return 'medium-performance';
  return 'low-performance';
};

const getTournamentClass = (winRate, numPlayers) => {
  const expectedWinRate = 1 / numPlayers;
  if (winRate > expectedWinRate) return 'high-performance';
  if (winRate >= expectedWinRate * 0.75) return 'medium-performance';
  return 'low-performance';
};

const getJumboClass = (jumboRate, numPlayers) => {
  const expectedJumboRate = 1 / numPlayers;
  if (jumboRate < expectedJumboRate) return 'high-performance';    // Better than expected (less than 1/n)
  if (jumboRate <= expectedJumboRate * 1.5) return 'medium-performance';  // Up to 50% worse than expected
  return 'low-performance';  // More than 50% worse than expected
};

export default Results; 