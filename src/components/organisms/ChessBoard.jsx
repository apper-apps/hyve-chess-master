import React from 'react';
import { motion } from 'framer-motion';
import ChessSquare from '@/components/molecules/ChessSquare';

const ChessBoard = ({ 
  gameState, 
  selectedSquare, 
  validMoves, 
  onSquareClick, 
  playerColor,
  disabled = false 
}) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  
  // Flip board if player is black
  const displayFiles = playerColor === 'black' ? [...files].reverse() : files;
  const displayRanks = playerColor === 'black' ? [...ranks].reverse() : ranks;

  const isValidMove = (square) => validMoves.includes(square);
  const isSelected = (square) => selectedSquare === square;
  const isInCheck = (square) => {
    if (!gameState) return false;
    const piece = gameState.board[square];
    return piece && piece.type === 'king' && piece.color === gameState.currentTurn && gameState.isInCheck;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      {/* Board */}
      <div className="bg-chess-dark p-4 rounded-lg shadow-2xl">
        <div className="grid grid-cols-8 gap-0 w-96 h-96 sm:w-[480px] sm:h-[480px] border-2 border-chess-dark rounded-md overflow-hidden">
          {displayRanks.map((rank) =>
            displayFiles.map((file) => {
              const square = `${file}${rank}`;
              const isLight = (files.indexOf(file) + parseInt(rank)) % 2 === 1;
              
              return (
                <ChessSquare
                  key={square}
                  square={square}
                  isLight={isLight}
                  piece={gameState?.board[square]}
                  isSelected={isSelected(square)}
                  isValidMove={isValidMove(square)}
                  isInCheck={isInCheck(square)}
                  onClick={() => !disabled && onSquareClick(square)}
                  disabled={disabled}
                />
              );
            })
          )}
        </div>
        
        {/* File labels (a-h) */}
        <div className="flex justify-center mt-2">
          <div className="grid grid-cols-8 w-96 sm:w-[480px]">
            {displayFiles.map((file) => (
              <div key={file} className="text-center text-chess-surface font-semibold text-sm">
                {file}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Rank labels (1-8) */}
      <div className="absolute left-0 top-4 bottom-4 flex flex-col justify-center">
        <div className="grid grid-rows-8 h-96 sm:h-[480px] mr-2">
          {displayRanks.map((rank) => (
            <div key={rank} className="flex items-center justify-center text-chess-dark font-semibold text-sm">
              {rank}
            </div>
          ))}
        </div>
      </div>

      {/* Thinking overlay */}
      {disabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center"
        >
          <div className="bg-chess-surface px-4 py-2 rounded-lg shadow-lg">
            <span className="text-chess-dark font-semibold">Computer is thinking...</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChessBoard;