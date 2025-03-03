import { useState, useRef, useEffect } from 'react'
import './App.css'
import DiceGame from './DiceGame'
import Results from './components/Results'
import { generateStrategyCode } from './services/togetherApi'
import { exampleStrategies } from './exampleStrategies'

function App() {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const strategyInputRef = useRef(null);

  // Load example strategies on first mount without running simulations
  useEffect(() => {
    if (strategies.length === 0) {
      const example = exampleStrategies[0];
      setStrategies([{
        name: example.name,
        strategy: example.strategy,
        results: null
      }]);
    }
  }, []);

  const handleAddStrategy = async () => {
    const strategyDescription = strategyInputRef.current.value.trim();
    if (!strategyDescription) {
      setError('Please enter a strategy description');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Generate strategy code from natural language description
      const strategyFunction = await generateStrategyCode(strategyDescription);
      
      setStrategies(prev => [...prev, {
        name: strategyDescription,
        strategy: strategyFunction.toString(),
        results: null
      }]);

      // Clear input
      strategyInputRef.current.value = '';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadExample = (example) => {
    setStrategies(prev => [...prev, {
      name: example.name,
      strategy: example.strategy,
      results: null
    }]);
  };

  const handleRunSimulations = async () => {
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const updatedStrategies = [];
      const totalStrategies = strategies.length;
      const strategiesWithCode = strategies.map(s => eval(s.strategy));
      
      // First phase: Test each strategy's solo performance
      for (let i = 0; i < strategies.length; i++) {
        const strategy = strategies[i];
        const strategyFunction = eval(strategy.strategy);
        
        // Test solo performance
        const soloResults = DiceGame.testSoloPerformance(strategyFunction, 1000);
        
        // Update progress
        setProgress((i / totalStrategies) * 50); // First 50% is solo testing
        await new Promise(resolve => setTimeout(resolve, 0));

        updatedStrategies.push({
          ...strategy,
          results: {
            ...soloResults,
            tournamentResults: null // Will be filled in phase 2
          }
        });
      }

      // Second phase: Run tournament with all strategies
      const tournamentResults = DiceGame.runTournament(strategiesWithCode, 10000);
      
      // Update each strategy with its tournament results
      const finalStrategies = updatedStrategies.map((strategy, index) => ({
        ...strategy,
        results: {
          ...strategy.results,
          tournamentResults: {
            winRate: tournamentResults.winRates[index],
            totalGames: tournamentResults.totalGames,
            numPlayers: tournamentResults.numPlayers,
            jumboRate: tournamentResults.jumboRates[index]
          }
        }
      }));

      setProgress(100);
      setStrategies(finalStrategies);
      document.querySelector('.results-section')?.scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStrategy = (index) => {
    setStrategies(prev => prev.filter((_, i) => i !== index));
  };

  const hasUntestedStrategies = strategies.some(s => s.results === null);

  return (
    <div className="app-container">
      <header>
        <h1>Dice Strategy Simulator</h1>
        <p>Test and compare different strategies for the 100-point dice game</p>
      </header>

      <main>
        <section className="strategy-input-section">
          <div className="section-header">
            <h2>Add Strategies</h2>
          </div>
          <div className="strategy-input-container">
            <textarea
              ref={strategyInputRef}
              placeholder={window.innerWidth <= 768 ? 
                "Describe your strategy...\n\nConsider:\n- Your total points (0-100)\n- Other players' points\n- Current turn points\n- Last roll (2-6)" :
                "Describe your strategy in natural language...\n\nWhen deciding whether to roll again, your strategy can consider:\n- How many points you have in total (0-100)\n- How many points other players have\n- How many points you've scored this turn so far\n- What number you just rolled (2-6, since rolling 1 ends your turn)\n\nExample: 'Play aggressively with 25+ if I'm behind, otherwise stop at 20. Stop at 15 if I'm close to winning'"}
              maxLength={500}
              autoFocus
            />
            <button 
              onClick={handleAddStrategy}
              disabled={loading}
              className="primary-button"
            >
              Add Strategy
            </button>
            <div className="example-strategies">
              <h3>Or add an example strategy:</h3>
              <div className="example-buttons">
                {exampleStrategies.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleLoadExample(example)}
                    disabled={loading}
                  >
                    {example.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {loading && (
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{ width: `${progress}%` }}
              />
              <span>{Math.round(progress)}% complete</span>
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
        </section>

        <section className="results-section">
          <div className="section-header">
            <h2>Results</h2>
            {strategies.length > 0 && (
              <button
                onClick={handleRunSimulations}
                disabled={loading}
                className="run-button"
              >
                {loading ? `Running Simulations (${Math.round(progress)}%)` : 'Run 10,000 Tournament Games'}
              </button>
            )}
          </div>
          {strategies.length > 0 ? (
            <Results 
              strategies={strategies} 
              onDeleteStrategy={handleDeleteStrategy}
            />
          ) : (
            <p>No strategies added yet. Add a strategy to begin!</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App
