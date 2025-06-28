import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ message = "Thinking..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <motion.div
        className="w-16 h-16 border-4 border-chess-accent border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        className="text-chess-dark font-semibold text-lg"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      >
        {message}
      </motion.p>
    </div>
  );
};

export default Loading;