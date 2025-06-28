import React from 'react';
import { motion } from 'framer-motion';
import ChessSquare from '@/components/molecules/ChessSquare';

const ChessBoard = ({ 
  gameState, 
  selectedSquare, 
  validMoves, 
  onSquareClick, 
  onDragStart,
  onDragEnd,
  onDrop,
  draggedPiece,
  draggedFrom,
  dragActive,
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
      className={`relative ${dragActive ? 'drag-active' : ''}`}
    >
      {/* Board */}
      <div className="bg-chess-dark p-2 xs:p-3 sm:p-4 rounded-lg shadow-2xl">
        <div className="board-container grid grid-cols-8 gap-0 border-2 border-chess-dark rounded-md overflow-hidden">
          {displayRanks.map((rank) =>
            displayFiles.map((file) => {
              const square = `${file}${rank}`;
              const isLight = (files.indexOf(file) + parseInt(rank)) % 2 === 1;
              const isDraggedFrom = draggedFrom === square;
              
              return (
                <ChessSquare
                  key={square}
                  square={square}
                  isLight={isLight}
                  piece={gameState?.board[square]}
                  isSelected={isSelected(square)}
                  isValidMove={isValidMove(square)}
                  isInCheck={isInCheck(square)}
                  isDraggedFrom={isDraggedFrom}
                  dragActive={dragActive}
                  onClick={() => !disabled && onSquareClick(square)}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  onDrop={onDrop}
                  disabled={disabled}
                />
              );
            })
          )}
        </div>
        
        {/* File labels (a-h) */}
        <div className="flex justify-center mt-2">
          <div className="board-container grid grid-cols-8">
            {displayFiles.map((file) => (
              <div key={file} className="text-center text-chess-surface font-semibold text-xs xs:text-sm">
                {file}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Rank labels (1-8) */}
      <div className="absolute left-0 top-2 xs:top-3 sm:top-4 bottom-2 xs:bottom-3 sm:bottom-4 flex flex-col justify-center">
        <div className="board-container grid grid-rows-8 mr-1 xs:mr-2">
          {displayRanks.map((rank) => (
            <div key={rank} className="flex items-center justify-center text-chess-dark font-semibold text-xs xs:text-sm">
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
          className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-xs"
        >
          <div className="bg-chess-surface px-3 xs:px-4 py-2 rounded-lg shadow-lg">
            <span className="text-chess-dark font-semibold text-sm xs:text-base">Computer is thinking...</span>
          </div>
        </motion.div>
      )}

      {/* Drag Preview */}
      {draggedPiece && (
        <motion.div
          className="absolute pointer-events-none z-50"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1.2 }}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '3rem',
            textShadow: '0 4px 8px rgba(0,0,0,0.5)',
            filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.8))'
          }}
        >
          {draggedPiece.type === 'king' && draggedPiece.color === 'white' ? '♔' :
           draggedPiece.type === 'queen' && draggedPiece.color === 'white' ? '♕' :
           draggedPiece.type === 'rook' && draggedPiece.color === 'white' ? '♖' :
           draggedPiece.type === 'bishop' && draggedPiece.color === 'white' ? '♗' :
           draggedPiece.type === 'knight' && draggedPiece.color === 'white' ? '♘' :
           draggedPiece.type === 'pawn' && draggedPiece.color === 'white' ? '♙' :
           draggedPiece.type === 'king' && draggedPiece.color === 'black' ? '♚' :
           draggedPiece.type === 'queen' && draggedPiece.color === 'black' ? '♛' :
           draggedPiece.type === 'rook' && draggedPiece.color === 'black' ? '♜' :
           draggedPiece.type === 'bishop' && draggedPiece.color === 'black' ? '♝' :
           draggedPiece.type === 'knight' && draggedPiece.color === 'black' ? '♞' :
           draggedPiece.type === 'pawn' && draggedPiece.color === 'black' ? '♟' : '?'}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChessBoard;