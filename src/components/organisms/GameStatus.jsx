import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const GameStatus = ({ gameState, playerColor, computerThinking }) => {
  if (!gameState) return null;

  const getCurrentTurnDisplay = () => {
    if (gameState.gameStatus !== 'active') {
      switch (gameState.gameStatus) {
        case 'checkmate':
          const winner = gameState.currentTurn === 'white' ? 'Black' : 'White';
          return `Checkmate! ${winner} wins!`;
        case 'stalemate':
          return 'Stalemate - Draw!';
        case 'draw':
          return 'Draw!';
        default:
          return 'Game Over';
      }
    }

    if (computerThinking) {
      return 'Computer is thinking...';
    }

    const isPlayerTurn = gameState.currentTurn === playerColor;
    return isPlayerTurn ? 'Your turn' : "Computer's turn";
  };

  const getStatusIcon = () => {
    if (gameState.gameStatus !== 'active') {
      return gameState.gameStatus === 'checkmate' ? 'Trophy' : 'Equal';
    }
    if (computerThinking) return 'Brain';
    return gameState.currentTurn === playerColor ? 'User' : 'Cpu';
  };

  const getStatusColor = () => {
    if (gameState.gameStatus !== 'active') {
      return gameState.gameStatus === 'checkmate' ? 'chess-success' : 'chess-info';
    }
    if (computerThinking) return 'chess-warning';
    return gameState.currentTurn === playerColor ? 'chess-accent' : 'chess-info';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="status-card"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className={`w-10 h-10 bg-${getStatusColor()} bg-opacity-20 rounded-full flex items-center justify-center`}>
          <ApperIcon name={getStatusIcon()} className={`w-5 h-5 text-${getStatusColor()}`} />
        </div>
        <div>
          <h3 className="font-display font-semibold text-chess-dark">
            Game Status
          </h3>
          <p className={`text-sm font-medium text-${getStatusColor()}`}>
            {getCurrentTurnDisplay()}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-chess-dark">You are playing:</span>
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${playerColor === 'white' ? 'bg-white border-2 border-chess-dark' : 'bg-chess-dark'}`}></div>
            <span className="font-semibold capitalize text-chess-dark">{playerColor}</span>
          </div>
        </div>

        {gameState.isInCheck && gameState.gameStatus === 'active' && (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-2 p-2 bg-chess-error bg-opacity-10 rounded-md"
          >
            <ApperIcon name="AlertTriangle" className="w-4 h-4 text-chess-error" />
            <span className="text-sm font-medium text-chess-error">
              {gameState.currentTurn === playerColor ? 'You are in check!' : 'Computer is in check!'}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default GameStatus;