import React from 'react';
import { motion } from 'framer-motion';
import ChessPiece from '@/components/atoms/ChessPiece';

const ChessSquare = ({ 
  square, 
  isLight, 
  piece, 
  isSelected, 
  isValidMove, 
  isInCheck,
  onClick,
  disabled = false 
}) => {
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  const getSquareClasses = () => {
    let classes = 'chess-square ';
    classes += isLight ? 'light ' : 'dark ';
    
    if (isSelected) classes += 'highlighted ';
    if (isValidMove && piece) classes += 'capture-move ';
    else if (isValidMove) classes += 'valid-move ';
    if (isInCheck) classes += 'ring-4 ring-chess-error ring-opacity-75 ';
    
    return classes;
  };

  return (
    <motion.div
      className={getSquareClasses()}
      onClick={handleClick}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      {piece && (
        <ChessPiece
          type={piece.type}
          color={piece.color}
          dragging={false}
          disabled={disabled}
        />
      )}
    </motion.div>
  );
};

export default ChessSquare;