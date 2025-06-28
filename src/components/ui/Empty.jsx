import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "No data available",
  message = "There's nothing to display right now.",
  actionLabel = "Get Started",
  onAction = null,
  icon = "Database"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 space-y-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 bg-gradient-to-br from-chess-light to-chess-dark bg-opacity-10 rounded-full flex items-center justify-center"
      >
        <ApperIcon name={icon} className="w-10 h-10 text-chess-dark opacity-60" />
      </motion.div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-display font-semibold text-chess-dark">
          {title}
        </h3>
        <p className="text-chess-dark opacity-70 max-w-md">
          {message}
        </p>
      </div>
      
      {onAction && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="game-button flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>{actionLabel}</span>
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;