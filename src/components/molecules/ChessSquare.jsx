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
  isDraggedFrom = false,
  dragActive = false,
  onClick,
  onDragStart,
  onDragEnd,
  onDrop,
  disabled = false 
}) => {
  const [dragOver, setDragOver] = React.useState(false);

  const handleClick = () => {
    if (!disabled && !dragActive) {
      onClick();
    }
  };

  const handleDragOver = (e) => {
    if (disabled || !onDrop) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (isValidMove) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    // Only trigger if actually leaving this square (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOver(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    
    if (disabled || !onDrop) return;
    
    const success = await onDrop(square);
    return success;
  };

  const handleTouchMove = (e) => {
    if (dragActive) {
      e.preventDefault();
      
      // Get the element under the touch point
      const touch = e.touches[0];
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      
      // Find the chess square element
      const squareElement = elementBelow?.closest('[data-square]');
      if (squareElement) {
        const targetSquare = squareElement.getAttribute('data-square');
        if (targetSquare !== square && isValidMove) {
          // Trigger visual feedback for valid drop zone
          setDragOver(true);
        }
      }
    }
  };

  const handleTouchEnd = async (e) => {
    if (dragActive) {
      e.preventDefault();
      
      const touch = e.changedTouches[0];
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      const squareElement = elementBelow?.closest('[data-square]');
      
      if (squareElement) {
        const targetSquare = squareElement.getAttribute('data-square');
        if (targetSquare && targetSquare !== square && onDrop) {
          await onDrop(targetSquare);
        }
      }
      
      setDragOver(false);
    }
  };
const getSquareClasses = () => {
    let classes = 'chess-square ';
    classes += isLight ? 'light ' : 'dark ';
    
    if (isSelected) classes += 'highlighted ';
    if (isValidMove && piece) classes += 'capture-move ';
    else if (isValidMove) classes += 'valid-move ';
    if (isInCheck) classes += 'ring-4 ring-chess-error ring-opacity-75 ';
    if (dragOver && isValidMove) classes += 'drag-over ';
    if (dragActive && isValidMove) classes += 'drop-zone ';
    
    return classes;
  };

  return (
    <motion.div
      className={getSquareClasses()}
      data-square={square}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      whileHover={!disabled && !dragActive ? { scale: 1.02 } : {}}
      whileTap={!disabled && !dragActive ? { scale: 0.98 } : {}}
      style={{ 
        cursor: disabled ? 'not-allowed' : dragActive ? 'default' : 'pointer',
        touchAction: 'none'
      }}
    >
      {piece && (
        <ChessPiece
          type={piece.type}
          color={piece.color}
          square={square}
          dragging={false}
          disabled={disabled}
          isDraggedFrom={isDraggedFrom}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      )}
    </motion.div>
  );
};
export default ChessSquare;