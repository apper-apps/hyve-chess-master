import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ 
  message = "Something went wrong", 
  onRetry = null,
  details = null 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-8 space-y-4 text-center"
    >
      <div className="w-16 h-16 bg-chess-error bg-opacity-10 rounded-full flex items-center justify-center">
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-chess-error" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-display font-semibold text-chess-error">
          Oops!
        </h3>
        <p className="text-chess-dark font-medium">
          {message}
        </p>
        {details && (
          <p className="text-sm text-chess-dark opacity-70">
            {details}
          </p>
        )}
      </div>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="game-button flex items-center space-x-2"
        >
          <ApperIcon name="RotateCcw" className="w-4 h-4" />
          <span>Try Again</span>
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;