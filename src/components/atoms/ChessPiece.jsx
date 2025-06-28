import React from 'react';
import { motion } from 'framer-motion';

const ChessPiece = ({ type, color, dragging = false, disabled = false }) => {
  const getPieceSymbol = () => {
    const pieces = {
      white: {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙'
      },
      black: {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟'
      }
    };
    
    return pieces[color]?.[type] || '?';
  };

  const pieceClasses = `chess-piece ${dragging ? 'dragging' : ''} ${disabled ? 'opacity-60' : ''}`;

  return (
    <motion.div
      className={pieceClasses}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{
        fontSize: '2.5rem',
        lineHeight: 1,
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        userSelect: 'none',
        pointerEvents: disabled ? 'none' : 'auto'
      }}
    >
      {getPieceSymbol()}
    </motion.div>
  );
};

export default ChessPiece;