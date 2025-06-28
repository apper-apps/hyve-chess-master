import React from 'react';
import { motion } from 'framer-motion';

const ChessPiece = ({ 
  type, 
  color, 
  dragging = false, 
  disabled = false,
  onDragStart,
  onDragEnd,
  square,
  isDraggedFrom = false
}) => {
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

  const handleDragStart = async (e) => {
    if (disabled || !onDragStart) return;
    
    const canDrag = await onDragStart(square);
    if (!canDrag) {
      e.preventDefault();
      return;
    }
    
    // Set drag image to be invisible (we'll show our custom preview)
    const dragImage = document.createElement('div');
    dragImage.style.opacity = '0';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Clean up drag image after a short delay
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    }, 0);
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', square);
  };

  const handleDragEnd = (e) => {
    if (onDragEnd) {
      onDragEnd();
    }
  };

  const handleTouchStart = async (e) => {
    if (disabled || !onDragStart) return;
    
    const canDrag = await onDragStart(square);
    if (canDrag) {
      e.preventDefault(); // Prevent default touch behavior
    }
  };

  const handleTouchEnd = (e) => {
    if (onDragEnd) {
      e.preventDefault();
      onDragEnd();
    }
  };

  const pieceClasses = `
    chess-piece 
    ${dragging ? 'dragging' : ''} 
    ${disabled ? 'disabled' : ''} 
    ${isDraggedFrom ? 'drag-ghost' : ''}
  `.trim();
return (
    <motion.div
      className={pieceClasses}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      draggable={!disabled && !!onDragStart}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
        lineHeight: 1,
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        userSelect: 'none',
        pointerEvents: disabled ? 'none' : 'auto',
        touchAction: 'none'
      }}
    >
      {getPieceSymbol()}
    </motion.div>
  );
};

export default ChessPiece;