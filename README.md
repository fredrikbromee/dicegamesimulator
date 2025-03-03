# Dice Strategy Simulator

A web application that lets you test and compare different strategies for the 100-point dice game. Create strategies using natural language, and the simulator will convert them into code and run tournaments to evaluate their performance.

## Features

- 🎲 Create custom dice game strategies using natural language
- 🤖 AI-powered conversion of natural language to code
- 🏆 Tournament simulation with multiple strategies
- 📊 Performance statistics including:
  - Solo game performance (average turns, best/worst games)
  - Tournament results (win rates)
  - "Jumbo" rate (frequency of last-place finishes)
- 📱 Responsive design for desktop and mobile
- 🎮 Example strategies to get started

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Together.ai API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dicegamesimulator.git
   cd dicegamesimulator
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory and add your Together.ai API key:
   ```
   VITE_TOGETHER_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Game Rules

The 100-point dice game is a simple game of chance and strategy:

1. Players take turns rolling a six-sided die
2. On each turn, a player can:
   - Roll again to accumulate more points
   - Stop and bank their current turn's points
3. If a player rolls a 1:
   - They lose all points accumulated this turn
   - Their turn ends immediately
4. First player to reach 100 points wins

## Strategy Creation

When creating a strategy, you can consider:
- Your total score (0-100)
- Other players' scores
- Points accumulated in the current turn
- The last number rolled (2-6, since 1 ends the turn)

Example strategy:
"Play aggressively with 25+ points if I'm behind, otherwise stop at 20. Stop at 15 if I'm close to winning"

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
