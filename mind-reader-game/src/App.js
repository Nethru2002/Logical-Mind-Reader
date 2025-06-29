// src/App.js

import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// A list of possible symbols (emojis work great!)
const SYMBOL_LIST = ['😀', '🤖', '👻', '💀', '🎃', '👽', '👾', '🤡', '🐸', '🦄', '🐲', '👹', '🔮', '✨', '🌟'];

function App() {
  // Game state can be: 'start', 'thinking', 'reveal'
  const [gameState, setGameState] = useState('start');
  const [symbols, setSymbols] = useState([]);
  const [magicSymbol, setMagicSymbol] = useState(null);
  const [isFading, setIsFading] = useState(false); // New state for transitions

  const generateNewSymbols = useCallback(() => {
    const newMagicSymbol = SYMBOL_LIST[Math.floor(Math.random() * SYMBOL_LIST.length)];
    setMagicSymbol(newMagicSymbol);

    const newSymbols = [];
    for (let i = 0; i < 100; i++) {
      if (i > 0 && i % 9 === 0) { // All non-zero multiples of 9 get the magic symbol
        newSymbols.push(newMagicSymbol);
      } else {
        newSymbols.push(SYMBOL_LIST[Math.floor(Math.random() * SYMBOL_LIST.length)]);
      }
    }
    setSymbols(newSymbols);
  }, []);

  useEffect(() => {
    // Generate symbols only when the game is at the start screen
    if (gameState === 'start') {
      generateNewSymbols();
    }
  }, [gameState, generateNewSymbols]);

  // A helper function to handle the fade transition between game states
  const handleTransition = (nextState) => {
    setIsFading(true); // Start fading out
    setTimeout(() => {
      setGameState(nextState); // Change the state after fade out
      setIsFading(false); // Fade back in
    }, 500); // This duration should match the CSS transition time
  };

  const handleStart = () => {
    handleTransition('thinking');
  };

  const handleReveal = () => {
    handleTransition('reveal');
  };

  const handleReset = () => {
    handleTransition('start');
  };

  return (
    <div className="App">
      {/* Conditionally apply the 'fading-out' class */}
      <div className={`container ${isFading ? 'fading-out' : ''}`}>
        <h1>Mind Reader</h1>

        {/* --- START SCREEN --- */}
        {gameState === 'start' && (
          <div className="game-step">
            <div className="start-icon">🔮</div>
            <h2>Welcome, Seeker of Truth!</h2>
            <p>I can peer into your thoughts. Follow my instructions, and I will reveal the symbol you are thinking of.</p>
            <button onClick={handleStart} className="action-button">
              Begin the Ritual
            </button>
          </div>
        )}

        {/* --- THINKING SCREEN --- */}
        {gameState === 'thinking' && (
          <div className="game-step">
            <h2>Follow these steps carefully:</h2>
            <ol className="instructions">
              <li>Pick any two-digit number (e.g., 54).</li>
              <li>Add the two digits together (5 + 4 = 9).</li>
              <li>Subtract this sum from your original number (54 - 9 = 45).</li>
              <li>Find your final number in the grid below and concentrate on its symbol.</li>
            </ol>
            <button onClick={handleReveal} className="action-button">
              I have my symbol!
            </button>
            <div className="symbol-grid">
              {symbols.map((symbol, index) => (
                <div key={index} className="symbol-item">
                  <span>{index}</span>: <span className="symbol">{symbol}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- REVEAL SCREEN --- */}
        {gameState === 'reveal' && (
          <div className="game-step reveal-screen">
            <h2>The mists clear, and I see...</h2>
            <p>The symbol locked within your mind is:</p>
            <div className="magic-symbol">{magicSymbol}</div>
            <button onClick={handleReset} className="action-button">
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;