import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Header = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-chess-dark to-chess-light shadow-lg"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-chess-accent rounded-lg flex items-center justify-center">
              <ApperIcon name="Crown" className="w-6 h-6 text-chess-dark" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">
                Chess Master Classic
              </h1>
              <p className="text-chess-surface text-sm opacity-90">
                Play against a classical algorithm
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-chess-surface">
              <ApperIcon name="Cpu" className="w-4 h-4" />
              <span className="text-sm font-medium">Minimax AI</span>
            </div>
            <div className="flex items-center space-x-2 text-chess-surface">
              <ApperIcon name="Brain" className="w-4 h-4" />
              <span className="text-sm font-medium">Alpha-Beta Pruning</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;