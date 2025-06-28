import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const GameControls = ({ 
  onNewGame, 
  playerColor, 
  onColorChange, 
  difficulty,
  onDifficultyChange,
  gameActive 
}) => {
  const difficulties = [
    { level: 1, label: 'Beginner', description: 'Easy opponent' },
    { level: 2, label: 'Novice', description: 'Learning mode' },
    { level: 3, label: 'Intermediate', description: 'Balanced challenge' },
    { level: 4, label: 'Advanced', description: 'Strong opponent' },
    { level: 5, label: 'Expert', description: 'Very challenging' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="status-card"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-6">
        {/* New Game Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewGame}
          className="game-button flex items-center space-x-2"
        >
          <ApperIcon name="RotateCcw" className="w-4 h-4" />
          <span>New Game</span>
        </motion.button>

        {/* Color Selection */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-chess-dark">Play as:</span>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onColorChange('white')}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                playerColor === 'white' 
                  ? 'bg-white border-chess-accent shadow-md' 
                  : 'bg-white border-chess-dark hover:border-chess-accent'
              }`}
              disabled={gameActive}
            >
              {playerColor === 'white' && (
                <ApperIcon name="Check" className="w-4 h-4 text-chess-accent" />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onColorChange('black')}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                playerColor === 'black' 
                  ? 'bg-chess-dark border-chess-accent shadow-md' 
                  : 'bg-chess-dark border-chess-light hover:border-chess-accent'
              }`}
              disabled={gameActive}
            >
              {playerColor === 'black' && (
                <ApperIcon name="Check" className="w-4 h-4 text-chess-accent" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-chess-dark">Difficulty:</span>
          <select
            value={difficulty}
            onChange={(e) => onDifficultyChange(parseInt(e.target.value))}
            className="px-3 py-1 bg-chess-surface border border-chess-light rounded-md text-chess-dark font-medium focus:outline-none focus:ring-2 focus:ring-chess-accent transition-all"
            disabled={gameActive}
          >
            {difficulties.map((diff) => (
              <option key={diff.level} value={diff.level}>
                {diff.label} - {diff.description}
              </option>
            ))}
          </select>
        </div>
      </div>

      {gameActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-xs text-chess-dark opacity-70"
        >
          * Start a new game to change color or difficulty settings
        </motion.div>
      )}
    </motion.div>
  );
};

export default GameControls;