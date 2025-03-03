const TOGETHER_API_KEY = import.meta.env.VITE_TOGETHER_API_KEY;
const API_URL = 'https://api.together.ai/inference';

const generateStrategyCode = async (strategyDescription) => {
  if (!TOGETHER_API_KEY) {
    throw new Error('Together.ai API key is not configured');
  }

  const systemPrompt = `You are a precise code generator that converts natural language strategy descriptions into JavaScript code. Your task is to create arrow functions that implement dice game strategies.

Game State Properties:
- myScore: Current player's total score (0-100)
- opponentScores: Array of other players' scores
- turnScore: Points accumulated in current turn
- lastRoll: Most recent die roll value (2-6, since 1 ends the turn)

Rules:
1. Return true to CONTINUE rolling, false to STOP
2. Use the gameState object properties listed above
3. Keep the logic simple and efficient
4. Include brief comments explaining the strategy
5. DO NOT use console.logs or side effects
6. DO NOT use properties that don't exist (like totalScore)
7. Common patterns:
   - Stop at X points: return gameState.turnScore < X
   - Play aggressively: use higher X
   - Play safely: use lower X
   - Consider opponents: use gameState.opponentScores
   - End game: use (100 - gameState.myScore) for points needed

Example:
(gameState) => {
  // Stop at 20 points, but be aggressive if behind
  const maxOpponentScore = Math.max(...gameState.opponentScores);
  if (gameState.myScore < maxOpponentScore) {
    return gameState.turnScore < 25;  // More aggressive
  }
  return gameState.turnScore < 20;    // Normal play
}`;

  const userPrompt = `${systemPrompt}

Convert this strategy description into code:
"${strategyDescription}"

The function must:
- Take a gameState parameter
- Return true to continue rolling, false to stop
- Be in this exact format, with NO other text or formatting:
(gameState) => {
  // Strategy logic here
  return true/false;
}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        prompt: userPrompt,
        max_tokens: 500,
        temperature: 0.3,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        stop: ['```'],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'API request failed');
    }

    const data = await response.json();
    const generatedCode = data.output.choices[0].text;

    // Debug logging
    console.log('Raw LLM output:', generatedCode);
    console.log('Raw LLM output length:', generatedCode.length);

    // Clean the code first by removing any comment tokens and extra whitespace
    const cleanedCode = generatedCode
      .replace(/\*\//g, '')
      .trim();
    
    console.log('Cleaned code:', cleanedCode);
    console.log('Cleaned code length:', cleanedCode.length);

    // Extract the function from the cleaned response using a balanced brace matcher
    const functionMatch = cleanedCode.match(/\(gameState\)\s*=>\s*(\{(?:\{[^{}]*\}|[^{}])*\})/);
    if (!functionMatch) {
      console.error('Failed to match function pattern in:', cleanedCode);
      throw new Error('Could not parse generated code');
    }

    // Get the extracted function - use the captured group that contains just the function body
    let extractedFunction = functionMatch[0];
    console.log('Extracted function:', extractedFunction);

    // Create and validate the function
    try {
      const strategyFunction = eval(extractedFunction);
      
      // Test with various game states to catch common issues
      const testStates = [
        { myScore: 50, opponentScores: [60], turnScore: 10, lastRoll: 4 },
        { myScore: 90, opponentScores: [85], turnScore: 5, lastRoll: 3 },
        { myScore: 20, opponentScores: [30], turnScore: 25, lastRoll: 6 }
      ];
      
      for (const state of testStates) {
        const result = strategyFunction(state);
        if (typeof result !== 'boolean') {
          throw new Error('Strategy must return a boolean');
        }
      }
      
      // Check for invalid property access
      const functionStr = extractedFunction.toString();
      if (functionStr.includes('totalScore') || functionStr.includes('score.total')) {
        throw new Error('Invalid property "totalScore". Use "myScore" instead.');
      }
      
      return strategyFunction;
    } catch (error) {
      console.error('Function validation error:', error);
      throw new Error('Invalid generated code: ' + error.message);
    }
  } catch (error) {
    if (error.message.includes('Invalid generated code')) {
      throw error;
    }
    throw new Error('Failed to generate strategy code: ' + error.message);
  }
};

export { generateStrategyCode }; 