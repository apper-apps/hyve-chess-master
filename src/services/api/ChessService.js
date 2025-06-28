import ChessEngine from '@/utils/ChessEngine';

class ChessService {
  static async newGame(playerColor = 'white') {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return ChessEngine.createInitialGameState(playerColor);
  }

  static async makeMove(gameState, from, to, promotion = null) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return ChessEngine.makeMove(gameState, from, to, promotion);
  }

  static async makeComputerMove(gameState, difficulty = 3) {
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return ChessEngine.makeComputerMove(gameState, difficulty);
  }

  static async getValidMoves(gameState, square) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return ChessEngine.getValidMoves(gameState, square);
  }

  static async isGameOver(gameState) {
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return ChessEngine.isGameOver(gameState);
  }
}

export default ChessService;