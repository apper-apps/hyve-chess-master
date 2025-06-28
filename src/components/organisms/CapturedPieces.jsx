import React from 'react';
import { motion } from 'framer-motion';
import ChessPiece from '@/components/atoms/ChessPiece';

const CapturedPieces = ({ capturedPieces }) => {
  const getValue = (type) => {
    const values = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9 };
    return values[type] || 0;
  };

  const getTotalValue = (pieces) => {
    return pieces.reduce((total, piece) => total + getValue(piece.type), 0);
  };

  const sortPieces = (pieces) => {
    const order = { queen: 0, rook: 1, bishop: 2, knight: 3, pawn: 4 };
    return [...pieces].sort((a, b) => order[a.type] - order[b.type]);
  };

  const whiteValue = getTotalValue(capturedPieces.white);
  const blackValue = getTotalValue(capturedPieces.black);
  const advantage = whiteValue - blackValue;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="status-card"
    >
      <h3 className="font-display font-semibold text-chess-dark mb-4">
        Captured Pieces
      </h3>

      <div className="space-y-4">
        {/* White captured pieces */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-chess-dark">White pieces</span>
            <span className="text-xs bg-chess-light bg-opacity-30 px-2 py-1 rounded">
              {whiteValue} pts
            </span>
          </div>
          <div className="flex flex-wrap gap-1 min-h-[40px] p-2 bg-chess-light bg-opacity-10 rounded">
            {sortPieces(capturedPieces.white).map((piece, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="captured-piece"
              >
                <ChessPiece type={piece.type} color="white" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Black captured pieces */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-chess-dark">Black pieces</span>
            <span className="text-xs bg-chess-dark bg-opacity-30 px-2 py-1 rounded">
              {blackValue} pts
            </span>
          </div>
          <div className="flex flex-wrap gap-1 min-h-[40px] p-2 bg-chess-dark bg-opacity-10 rounded">
            {sortPieces(capturedPieces.black).map((piece, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="captured-piece"
              >
                <ChessPiece type={piece.type} color="black" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Material advantage */}
        {advantage !== 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center p-2 rounded ${
              advantage > 0 
                ? 'bg-chess-success bg-opacity-10 text-chess-success' 
                : 'bg-chess-error bg-opacity-10 text-chess-error'
            }`}
          >
            <span className="text-sm font-semibold">
              {advantage > 0 ? 'White' : 'Black'} leads by {Math.abs(advantage)} points
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CapturedPieces;