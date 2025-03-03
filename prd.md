## **Comprehensive Tool Specification: Strategy Simulator**

### **Overview:**
The tool is a web-based **dice strategy simulator** where users can input natural language descriptions of their strategies, have them converted into JavaScript, run simulations to evaluate performance, and compare strategies against each other. The user interacts with the tool through a simple, responsive interface that focuses on usability and minimalism.

### **Core Features:**
1. **Strategy Input** – Users input their strategy in natural language, which is then converted into JavaScript code by the tool via Together.ai's API.
2. **Simulation** – The tool runs 10,000 simulations for each strategy and provides detailed performance stats.
3. **Comparison** – Users can compare strategies by win rate and average turns to victory.
4. **Error Handling** – If the strategy code fails, the tool explains the issue and allows the user to revise their strategy.
5. **Dynamic Visualization** – A results table and bar chart compare strategy performance in real-time, with color-coded indicators for win rate and average turns.

---

### **Game Rules:**
The game is a **turn-based dice game** where the objective is to reach **100 points**. 

- **Players take turns** rolling a six-sided die (values 1–6).
- **On each roll**:
  - If the die shows **1**, the player's turn is over, and they **lose all points accumulated** during that turn.
  - If the die shows **2 to 6**, the player **adds that value to their turn score** (the points accumulated during the current turn).
  - After rolling, the player must decide whether to **stop rolling** and **keep the turn score** or **keep rolling** to try to accumulate more points for the turn.
  - The player may stop at any time to lock in the **turn score**, which is then added to their total score.
  
- The **game ends** when a player reaches **100 points** or more, at which point they are declared the winner.

---

### **Functional Requirements:**

#### **1. User Interface:**
- **Strategy Input:**
  - Users enter strategies in natural language.
  - The strategy input box is **resizable**.
  - **500-character max limit** for strategy descriptions.
  - **Auto-selected focus** on page load for immediate input.
  - **Standard tab navigation** for form elements.

- **Results Section:**
  - Displays a **stats table** showing win rate and average turns to victory.
  - Results are shown in **real-time** with **color-coded indicators**:
    - 🟢 Green (high win rate, e.g., 60%+)
    - 🟡 Yellow (mid-range win rate, e.g., 40-59%)
    - 🔴 Red (low win rate, e.g., below 40%)
    - 🟢 Green (lower turn count, efficient strategy)
    - 🔴 Red (higher turn count, slower wins)
  - **Bar chart** showing win rates of the latest strategies.
  - **Auto-scrolls** to the results once the simulation completes, with a **fade-in animation**.

- **Strategy List:**
  - Strategies are displayed in a **single list** in the order they were tested.
  - **Pre-filled example strategy** included at first load.
  - Users can **delete any strategy**, including the pre-filled example.
  - Long strategy names are **truncated** with a tooltip to show the full name.

- **Navigation & Interaction:**
  - Tooltips provide **contextual help** when users hover over key elements.
  - **Progress bar** is shown during simulation to indicate the number of games completed.
  - **No undo for deletion**, and **no "Clear" button**—users modify the input manually.
  - **Input box auto-focuses** when the page loads.

#### **2. Strategy Code Generation:**
- **Natural Language to JavaScript Conversion:**
  - The tool sends the user’s strategy description to **Together.ai's Mixtral LLM** for conversion into JavaScript.
  - The **API request** is made directly from the browser (no backend).
  - The API response contains the **generated JavaScript code**, which is tested in isolation first.

- **Test Suite for Strategy Code:**
  - A **test suite** runs to verify the stability of the generated code.
  - If the code fails, an **error message** is shown, explaining the issue and suggesting corrections.
  - If the code passes, the simulation proceeds.

#### **3. Simulation:**
- **Simulation Process:**
  - Each strategy is tested using **10,000 simulations** per strategy.
  - Simulations are **batch-processed** in **1,000-game increments** to avoid UI lag.
  - A **progress indicator** shows the number of games completed.
  - **No canceling of simulations**; refreshing the page will reset the tool.

- **Competitive Benchmarking:**
  - The strategy is tested against a **set of predefined opponents** (e.g., “Stop at 20”, “Risky Player”, “Cautious Player”).
  - The user can select which opponents to benchmark against, and the tool compares strategies accordingly.
  - **All strategies tested** are shown in a comparison chart with **win rate** as the key metric.

#### **4. Error Handling & Data Validation:**
- **API Failures:** 
  - If the API request fails, a message is shown to the user explaining the error (e.g., API down, API key credit exhausted).
  - The tool will not attempt automatic retries; users must manually retry or check the API key.

- **Strategy Code Errors:**
  - If the generated strategy code fails during testing, an error message is shown to the user with suggested fixes.
  - The user can **revise the strategy** and regenerate the code.

- **Simulation Errors:**
  - If any errors occur during the simulation (e.g., an unexpected behavior in the strategy), the tool will notify the user that the simulation could not be completed.

---

### **Architecture Choices:**

- **Frontend:**
  - **JavaScript (ES6)** for the logic and interaction.
  - **HTML/CSS** for structure and styling. The tool will be **responsive**, using **flexbox** or **grid layout** to handle different screen sizes.
  - **Chart.js** for rendering the win rate bar chart.

- **Backend (optional):**
  - The tool is **fully frontend-based** and **does not require a backend** for the main functionality.
  - The strategy code is **generated via API requests** to Together.ai directly from the user's browser.

- **API Integration:**
  - The tool sends user strategy input to **Together.ai’s Mixtral LLM** for code generation.
  - The API key will be embedded in the frontend code, with a limited number of credits.
  - The API response contains the JavaScript code for the strategy, which is validated via a test suite.

---

### **Testing Plan:**

1. **Unit Tests for Code Validation:**
   - Verify that the strategy code passes the test suite.
   - Ensure that the generated code does not cause syntax errors or return invalid values.
   - Test a variety of game states (e.g., different scores, turn numbers, and win probabilities) to ensure correct behavior.

2. **End-to-End Tests:**
   - Simulate multiple strategies (including edge cases like "stop rolling at 100" or "roll until 0 points") to ensure the tool functions as expected.
   - Test the full cycle: input → code generation → simulation → result display.
   - Verify that the **progress bar** updates properly during simulation and that **auto-scrolling** to results works as expected.

3. **UI/UX Testing:**
   - Test responsiveness across different devices (desktop, tablet, mobile).
   - Ensure that **tooltips** and **interactive elements** (e.g., progress bar, dropdowns) are user-friendly.
   - Verify that **error messages** are clear and provide actionable feedback.

4. **Performance Testing:**
   - Test the tool’s performance with **10,000 games simulated** at once.
   - Ensure the tool handles batch processing smoothly with real-time progress updates.

---

### **Deployment Plan:**

1. **Hosting:**
   - Host the tool on **GitHub Pages**, where users can easily access it via a URL.
   - The repository will contain all necessary files (HTML, CSS, JavaScript), including the **API key** for Together.ai.

2. **API Key Management:**
   - Use a **limited API key** with limited credits to avoid abuse.
   - Regularly monitor the usage of the API key, ensuring it does not run out of credits unexpectedly.

3. **Version Control:**
   - Use **Git** for version control, allowing for easy updates and feature additions.
   - Regularly commit changes and track issues in **GitHub**.