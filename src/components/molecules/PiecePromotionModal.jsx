import React from 'react';
import { motion } from 'framer-motion';
import ChessPiece from '@/components/atoms/ChessPiece';
import ApperIcon from '@/components/ApperIcon';

const PiecePromotionModal = ({ color, onSelect, onClose }) => {
  const promotionPieces = ['queen', 'rook', 'bishop', 'knight'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-chess-surface p-6 rounded-lg shadow-2xl border border-chess-light"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-display font-semibold text-chess-dark">
            Choose Promotion Piece
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-1 hover:bg-chess-light hover:bg-opacity-20 rounded"
          >
            <ApperIcon name="X" className="w-5 h-5 text-chess-dark" />
          </motion.button>
        </div>

        <div className="flex space-x-4">
          {promotionPieces.map((piece, index) => (
            <motion.button
              key={piece}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(piece)}
              className="w-16 h-16 bg-chess-light bg-opacity-20 rounded-lg border-2 border-chess-light border-opacity-30 hover:border-chess-accent hover:border-opacity-75 flex items-center justify-center transition-all"
            >
              <ChessPiece type={piece} color={color} />
            </motion.button>
          ))}
        </div>

        <p className="text-sm text-chess-dark opacity-70 mt-4 text-center">
          Click on a piece to promote your pawn
        </p>
      </motion.div>
    </motion.div>
  );
};

export default PiecePromotionModal;