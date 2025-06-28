class ChessEngine {
  static createInitialGameState(playerColor = 'white') {
    const initialBoard = {
      'a8': { type: 'rook', color: 'black' },
      'b8': { type: 'knight', color: 'black' },
      'c8': { type: 'bishop', color: 'black' },
      'd8': { type: 'queen', color: 'black' },
      'e8': { type: 'king', color: 'black' },
      'f8': { type: 'bishop', color: 'black' },
      'g8': { type: 'knight', color: 'black' },
      'h8': { type: 'rook', color: 'black' },
      'a7': { type: 'pawn', color: 'black' },
      'b7': { type: 'pawn', color: 'black' },
      'c7': { type: 'pawn', color: 'black' },
      'd7': { type: 'pawn', color: 'black' },
      'e7': { type: 'pawn', color: 'black' },
      'f7': { type: 'pawn', color: 'black' },
      'g7': { type: 'pawn', color: 'black' },
      'h7': { type: 'pawn', color: 'black' },
      'a1': { type: 'rook', color: 'white' },
      'b1': { type: 'knight', color: 'white' },
      'c1': { type: 'bishop', color: 'white' },
      'd1': { type: 'queen', color: 'white' },
      'e1': { type: 'king', color: 'white' },
      'f1': { type: 'bishop', color: 'white' },
      'g1': { type: 'knight', color: 'white' },
      'h1': { type: 'rook', color: 'white' },
      'a2': { type: 'pawn', color: 'white' },
      'b2': { type: 'pawn', color: 'white' },
      'c2': { type: 'pawn', color: 'white' },
      'd2': { type: 'pawn', color: 'white' },
      'e2': { type: 'pawn', color: 'white' },
      'f2': { type: 'pawn', color: 'white' },
      'g2': { type: 'pawn', color: 'white' },
      'h2': { type: 'pawn', color: 'white' }
    };

    return {
      board: initialBoard,
      currentTurn: 'white',
      castlingRights: {
        white: { kingside: true, queenside: true },
        black: { kingside: true, queenside: true }
      },
      enPassantTarget: null,
      halfMoveClock: 0,
      fullMoveNumber: 1,
      capturedPieces: { white: [], black: [] },
      moveHistory: [],
      gameStatus: 'active',
      isInCheck: false
    };
  }

  static makeMove(gameState, from, to, promotion = null) {
    const newState = JSON.parse(JSON.stringify(gameState));
    const piece = newState.board[from];
    
    if (!piece || piece.color !== newState.currentTurn) {
      throw new Error('Invalid move: no piece or wrong color');
    }

    if (!this.isValidMove(newState, from, to)) {
      throw new Error('Invalid move');
    }

    // Handle captures
    const capturedPiece = newState.board[to];
    if (capturedPiece) {
      newState.capturedPieces[capturedPiece.color].push(capturedPiece);
    }

    // Handle en passant capture
    if (piece.type === 'pawn' && to === newState.enPassantTarget) {
      const captureSquare = to[0] + (piece.color === 'white' ? '5' : '4');
      const enPassantCaptured = newState.board[captureSquare];
      if (enPassantCaptured) {
        newState.capturedPieces[enPassantCaptured.color].push(enPassantCaptured);
        delete newState.board[captureSquare];
      }
    }

    // Move the piece
    delete newState.board[from];
    newState.board[to] = { ...piece };

    // Handle pawn promotion
    if (piece.type === 'pawn' && 
        ((piece.color === 'white' && to[1] === '8') || 
         (piece.color === 'black' && to[1] === '1'))) {
      newState.board[to].type = promotion || 'queen';
    }

    // Handle castling
    if (piece.type === 'king' && Math.abs(from.charCodeAt(0) - to.charCodeAt(0)) === 2) {
      const isKingside = to.charCodeAt(0) > from.charCodeAt(0);
      const rank = piece.color === 'white' ? '1' : '8';
      
      if (isKingside) {
        // Kingside castling
        const rookFrom = 'h' + rank;
        const rookTo = 'f' + rank;
        newState.board[rookTo] = newState.board[rookFrom];
        delete newState.board[rookFrom];
      } else {
        // Queenside castling
        const rookFrom = 'a' + rank;
        const rookTo = 'd' + rank;
        newState.board[rookTo] = newState.board[rookFrom];
        delete newState.board[rookFrom];
      }
      
      // Remove castling rights
      newState.castlingRights[piece.color] = { kingside: false, queenside: false };
    }

    // Update castling rights
    if (piece.type === 'king') {
      newState.castlingRights[piece.color] = { kingside: false, queenside: false };
    } else if (piece.type === 'rook') {
      if (from === 'a1' || from === 'a8') {
        newState.castlingRights[piece.color].queenside = false;
      } else if (from === 'h1' || from === 'h8') {
        newState.castlingRights[piece.color].kingside = false;
      }
    }

    // Update en passant target
    if (piece.type === 'pawn' && Math.abs(parseInt(from[1]) - parseInt(to[1])) === 2) {
      const enPassantRank = piece.color === 'white' ? '3' : '6';
      newState.enPassantTarget = from[0] + enPassantRank;
    } else {
      newState.enPassantTarget = null;
    }

    // Update move counters
    if (piece.type === 'pawn' || capturedPiece) {
      newState.halfMoveClock = 0;
    } else {
      newState.halfMoveClock++;
    }

    if (newState.currentTurn === 'black') {
      newState.fullMoveNumber++;
    }

    // Switch turns
    newState.currentTurn = newState.currentTurn === 'white' ? 'black' : 'white';

    // Check for check/checkmate/stalemate
    newState.isInCheck = this.isInCheck(newState, newState.currentTurn);
    newState.gameStatus = this.getGameStatus(newState);

    // Add move to history
    newState.moveHistory.push({
      from,
      to,
      piece: piece.type,
      captured: capturedPiece?.type || null,
      promotion,
      check: newState.isInCheck,
      checkmate: newState.gameStatus === 'checkmate'
    });

    return newState;
  }

  static makeComputerMove(gameState, difficulty = 3) {
    const result = this.minimax(gameState, difficulty, -Infinity, Infinity, true);
    
    if (!result.bestMove) {
      // No valid moves, game should be over
      return { ...gameState, gameStatus: this.getGameStatus(gameState) };
    }

    return this.makeMove(gameState, result.bestMove.from, result.bestMove.to, result.bestMove.promotion);
  }

  static minimax(gameState, depth, alpha, beta, isMaximizing) {
    if (depth === 0 || gameState.gameStatus !== 'active') {
      return {
        score: this.evaluatePosition(gameState),
        bestMove: null,
        nodesEvaluated: 1
      };
    }

    const moves = this.getAllValidMoves(gameState, gameState.currentTurn);
    let bestMove = null;
    let nodesEvaluated = 0;

    if (isMaximizing) {
      let maxEval = -Infinity;
      
      for (const move of moves) {
        try {
          const newState = this.makeMove(gameState, move.from, move.to, move.promotion);
          const result = this.minimax(newState, depth - 1, alpha, beta, false);
          nodesEvaluated += result.nodesEvaluated;
          
          if (result.score > maxEval) {
            maxEval = result.score;
            bestMove = move;
          }
          
          alpha = Math.max(alpha, result.score);
          if (beta <= alpha) {
            break; // Alpha-beta pruning
          }
        } catch (error) {
          // Invalid move, skip
          continue;
        }
      }
      
      return { score: maxEval, bestMove, nodesEvaluated };
    } else {
      let minEval = Infinity;
      
      for (const move of moves) {
        try {
          const newState = this.makeMove(gameState, move.from, move.to, move.promotion);
          const result = this.minimax(newState, depth - 1, alpha, beta, true);
          nodesEvaluated += result.nodesEvaluated;
          
          if (result.score < minEval) {
            minEval = result.score;
            bestMove = move;
          }
          
          beta = Math.min(beta, result.score);
          if (beta <= alpha) {
            break; // Alpha-beta pruning
          }
        } catch (error) {
          // Invalid move, skip
          continue;
        }
      }
      
      return { score: minEval, bestMove, nodesEvaluated };
    }
  }

  static evaluatePosition(gameState) {
    const pieceValues = {
      pawn: 1,
      knight: 3,
      bishop: 3,
      rook: 5,
      queen: 9,
      king: 100
    };

    let score = 0;

    // Material evaluation
    Object.values(gameState.board).forEach(piece => {
      const value = pieceValues[piece.type];
      score += piece.color === 'white' ? value : -value;
    });

    // Captured pieces evaluation
    gameState.capturedPieces.white.forEach(piece => {
      score -= pieceValues[piece.type];
    });
    gameState.capturedPieces.black.forEach(piece => {
      score += pieceValues[piece.type];
    });

    // Simple positional bonuses
    // Center control
    const centerSquares = ['d4', 'd5', 'e4', 'e5'];
    centerSquares.forEach(square => {
      const piece = gameState.board[square];
      if (piece) {
        const bonus = piece.type === 'pawn' ? 0.3 : 0.1;
        score += piece.color === 'white' ? bonus : -bonus;
      }
    });

    // Check penalty
    if (gameState.isInCheck) {
      score += gameState.currentTurn === 'white' ? -0.5 : 0.5;
    }

    // Game over states
    if (gameState.gameStatus === 'checkmate') {
      return gameState.currentTurn === 'white' ? -1000 : 1000;
    } else if (gameState.gameStatus === 'stalemate') {
      return 0;
    }

    return score;
  }

  static getAllValidMoves(gameState, color) {
    const moves = [];
    const squares = Object.keys(gameState.board);

    for (const square of squares) {
      const piece = gameState.board[square];
      if (piece && piece.color === color) {
        const validMoves = this.getValidMoves(gameState, square);
        for (const target of validMoves) {
          const move = { from: square, to: target };
          
          // Handle pawn promotion
          if (piece.type === 'pawn' && 
              ((piece.color === 'white' && target[1] === '8') || 
               (piece.color === 'black' && target[1] === '1'))) {
            // Add all promotion options
            ['queen', 'rook', 'bishop', 'knight'].forEach(promotion => {
              moves.push({ ...move, promotion });
            });
          } else {
            moves.push(move);
          }
        }
      }
    }

    return moves;
  }

  static getValidMoves(gameState, square) {
    const piece = gameState.board[square];
    if (!piece) return [];

    switch (piece.type) {
      case 'pawn':
        return this.getPawnMoves(gameState, square);
      case 'rook':
        return this.getRookMoves(gameState, square);
      case 'knight':
        return this.getKnightMoves(gameState, square);
      case 'bishop':
        return this.getBishopMoves(gameState, square);
      case 'queen':
        return this.getQueenMoves(gameState, square);
      case 'king':
        return this.getKingMoves(gameState, square);
      default:
        return [];
    }
  }

  static getPawnMoves(gameState, square) {
    const piece = gameState.board[square];
    const moves = [];
    const file = square[0];
    const rank = parseInt(square[1]);
    const direction = piece.color === 'white' ? 1 : -1;

    // Forward move
    const oneSquare = file + (rank + direction);
    if (this.isValidSquare(oneSquare) && !gameState.board[oneSquare]) {
      moves.push(oneSquare);

      // Two squares forward from starting position
      const twoSquares = file + (rank + direction * 2);
      const startingRank = piece.color === 'white' ? 2 : 7;
      if (rank === startingRank && this.isValidSquare(twoSquares) && !gameState.board[twoSquares]) {
        moves.push(twoSquares);
      }
    }

    // Diagonal captures
    const leftCapture = String.fromCharCode(file.charCodeAt(0) - 1) + (rank + direction);
    const rightCapture = String.fromCharCode(file.charCodeAt(0) + 1) + (rank + direction);

    [leftCapture, rightCapture].forEach(captureSquare => {
      if (this.isValidSquare(captureSquare)) {
        const target = gameState.board[captureSquare];
        if (target && target.color !== piece.color) {
          moves.push(captureSquare);
        }
        // En passant
        else if (captureSquare === gameState.enPassantTarget) {
          moves.push(captureSquare);
        }
      }
    });

    return moves.filter(move => {
      try {
        const testState = this.makeMove(gameState, square, move);
        return !this.isInCheck(testState, piece.color);
      } catch {
        return false;
      }
    });
  }

  static getRookMoves(gameState, square) {
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    return this.getSlidingMoves(gameState, square, directions);
  }

  static getBishopMoves(gameState, square) {
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    return this.getSlidingMoves(gameState, square, directions);
  }

  static getQueenMoves(gameState, square) {
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    return this.getSlidingMoves(gameState, square, directions);
  }

  static getSlidingMoves(gameState, square, directions) {
    const piece = gameState.board[square];
    const moves = [];
    const file = square.charCodeAt(0) - 97; // Convert to 0-7
    const rank = parseInt(square[1]) - 1; // Convert to 0-7

    for (const [df, dr] of directions) {
      for (let i = 1; i < 8; i++) {
        const newFile = file + df * i;
        const newRank = rank + dr * i;
        
        if (newFile < 0 || newFile > 7 || newRank < 0 || newRank > 7) break;
        
        const targetSquare = String.fromCharCode(97 + newFile) + (newRank + 1);
        const target = gameState.board[targetSquare];
        
        if (!target) {
          moves.push(targetSquare);
        } else {
          if (target.color !== piece.color) {
            moves.push(targetSquare);
          }
          break;
        }
      }
    }

    return moves.filter(move => {
      try {
        const testState = this.makeMove(gameState, square, move);
        return !this.isInCheck(testState, piece.color);
      } catch {
        return false;
      }
    });
  }

  static getKnightMoves(gameState, square) {
    const piece = gameState.board[square];
    const moves = [];
    const file = square.charCodeAt(0) - 97;
    const rank = parseInt(square[1]) - 1;
    
    const knightMoves = [
      [2, 1], [2, -1], [-2, 1], [-2, -1],
      [1, 2], [1, -2], [-1, 2], [-1, -2]
    ];

    for (const [df, dr] of knightMoves) {
      const newFile = file + df;
      const newRank = rank + dr;
      
      if (newFile >= 0 && newFile <= 7 && newRank >= 0 && newRank <= 7) {
        const targetSquare = String.fromCharCode(97 + newFile) + (newRank + 1);
        const target = gameState.board[targetSquare];
        
        if (!target || target.color !== piece.color) {
          moves.push(targetSquare);
        }
      }
    }

    return moves.filter(move => {
      try {
        const testState = this.makeMove(gameState, square, move);
        return !this.isInCheck(testState, piece.color);
      } catch {
        return false;
      }
    });
  }

  static getKingMoves(gameState, square) {
    const piece = gameState.board[square];
    const moves = [];
    const file = square.charCodeAt(0) - 97;
    const rank = parseInt(square[1]) - 1;
    
    const kingMoves = [
      [0, 1], [0, -1], [1, 0], [-1, 0],
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    for (const [df, dr] of kingMoves) {
      const newFile = file + df;
      const newRank = rank + dr;
      
      if (newFile >= 0 && newFile <= 7 && newRank >= 0 && newRank <= 7) {
        const targetSquare = String.fromCharCode(97 + newFile) + (newRank + 1);
        const target = gameState.board[targetSquare];
        
        if (!target || target.color !== piece.color) {
          moves.push(targetSquare);
        }
      }
    }

    // Castling
    if (!this.isInCheck(gameState, piece.color)) {
      const rank = piece.color === 'white' ? '1' : '8';
      
      // Kingside castling
      if (gameState.castlingRights[piece.color].kingside &&
          !gameState.board['f' + rank] && !gameState.board['g' + rank]) {
        if (!this.isSquareAttacked(gameState, 'f' + rank, piece.color === 'white' ? 'black' : 'white')) {
          moves.push('g' + rank);
        }
      }
      
      // Queenside castling
      if (gameState.castlingRights[piece.color].queenside &&
          !gameState.board['d' + rank] && !gameState.board['c' + rank] && !gameState.board['b' + rank]) {
        if (!this.isSquareAttacked(gameState, 'd' + rank, piece.color === 'white' ? 'black' : 'white')) {
          moves.push('c' + rank);
        }
      }
    }

    return moves.filter(move => {
      try {
        const testState = this.makeMove(gameState, square, move);
        return !this.isInCheck(testState, piece.color);
      } catch {
        return false;
      }
    });
  }

  static isValidMove(gameState, from, to) {
    const validMoves = this.getValidMoves(gameState, from);
    return validMoves.includes(to);
  }

  static isValidSquare(square) {
    return /^[a-h][1-8]$/.test(square);
  }

  static isInCheck(gameState, color) {
    const kingSquare = this.findKing(gameState, color);
    if (!kingSquare) return false;
    
    return this.isSquareAttacked(gameState, kingSquare, color === 'white' ? 'black' : 'white');
  }

  static findKing(gameState, color) {
    for (const [square, piece] of Object.entries(gameState.board)) {
      if (piece.type === 'king' && piece.color === color) {
        return square;
      }
    }
    return null;
  }

  static isSquareAttacked(gameState, square, byColor) {
    for (const [attackerSquare, piece] of Object.entries(gameState.board)) {
      if (piece.color === byColor) {
        const moves = this.getAttackingMoves(gameState, attackerSquare);
        if (moves.includes(square)) {
          return true;
        }
      }
    }
    return false;
  }

  static getAttackingMoves(gameState, square) {
    const piece = gameState.board[square];
    if (!piece) return [];

    // Similar to getValidMoves but without check validation (to avoid infinite recursion)
    switch (piece.type) {
      case 'pawn':
        return this.getPawnAttacks(gameState, square);
      case 'rook':
        return this.getRookAttacks(gameState, square);
      case 'knight':
        return this.getKnightAttacks(gameState, square);
      case 'bishop':
        return this.getBishopAttacks(gameState, square);
      case 'queen':
        return this.getQueenAttacks(gameState, square);
      case 'king':
        return this.getKingAttacks(gameState, square);
      default:
        return [];
    }
  }

  static getPawnAttacks(gameState, square) {
    const piece = gameState.board[square];
    const moves = [];
    const file = square[0];
    const rank = parseInt(square[1]);
    const direction = piece.color === 'white' ? 1 : -1;

    // Diagonal attacks only
    const leftCapture = String.fromCharCode(file.charCodeAt(0) - 1) + (rank + direction);
    const rightCapture = String.fromCharCode(file.charCodeAt(0) + 1) + (rank + direction);

    [leftCapture, rightCapture].forEach(captureSquare => {
      if (this.isValidSquare(captureSquare)) {
        moves.push(captureSquare);
      }
    });

    return moves;
  }

  static getRookAttacks(gameState, square) {
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    return this.getSlidingAttacks(gameState, square, directions);
  }

  static getBishopAttacks(gameState, square) {
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    return this.getSlidingAttacks(gameState, square, directions);
  }

  static getQueenAttacks(gameState, square) {
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    return this.getSlidingAttacks(gameState, square, directions);
  }

  static getSlidingAttacks(gameState, square, directions) {
    const piece = gameState.board[square];
    const moves = [];
    const file = square.charCodeAt(0) - 97;
    const rank = parseInt(square[1]) - 1;

    for (const [df, dr] of directions) {
      for (let i = 1; i < 8; i++) {
        const newFile = file + df * i;
        const newRank = rank + dr * i;
        
        if (newFile < 0 || newFile > 7 || newRank < 0 || newRank > 7) break;
        
        const targetSquare = String.fromCharCode(97 + newFile) + (newRank + 1);
        moves.push(targetSquare);
        
        // Stop at any piece
        if (gameState.board[targetSquare]) {
          break;
        }
      }
    }

    return moves;
  }

  static getKnightAttacks(gameState, square) {
    const moves = [];
    const file = square.charCodeAt(0) - 97;
    const rank = parseInt(square[1]) - 1;
    
    const knightMoves = [
      [2, 1], [2, -1], [-2, 1], [-2, -1],
      [1, 2], [1, -2], [-1, 2], [-1, -2]
    ];

    for (const [df, dr] of knightMoves) {
      const newFile = file + df;
      const newRank = rank + dr;
      
      if (newFile >= 0 && newFile <= 7 && newRank >= 0 && newRank <= 7) {
        const targetSquare = String.fromCharCode(97 + newFile) + (newRank + 1);
        moves.push(targetSquare);
      }
    }

    return moves;
  }

  static getKingAttacks(gameState, square) {
    const moves = [];
    const file = square.charCodeAt(0) - 97;
    const rank = parseInt(square[1]) - 1;
    
    const kingMoves = [
      [0, 1], [0, -1], [1, 0], [-1, 0],
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    for (const [df, dr] of kingMoves) {
      const newFile = file + df;
      const newRank = rank + dr;
      
      if (newFile >= 0 && newFile <= 7 && newRank >= 0 && newRank <= 7) {
        const targetSquare = String.fromCharCode(97 + newFile) + (newRank + 1);
        moves.push(targetSquare);
      }
    }

    return moves;
  }

  static getGameStatus(gameState) {
    const currentColor = gameState.currentTurn;
    const validMoves = this.getAllValidMoves(gameState, currentColor);
    
    if (validMoves.length === 0) {
      if (this.isInCheck(gameState, currentColor)) {
        return 'checkmate';
      } else {
        return 'stalemate';
      }
    }
    
    // Check for draw conditions
    if (gameState.halfMoveClock >= 50) {
      return 'draw';
    }
    
    // Insufficient material check (simplified)
    const pieces = Object.values(gameState.board);
    if (pieces.length <= 3) {
      const hasOnlyKingsAndMinor = pieces.every(piece => 
        piece.type === 'king' || piece.type === 'knight' || piece.type === 'bishop'
      );
      if (hasOnlyKingsAndMinor) {
        return 'draw';
      }
    }
    
    return 'active';
  }

  static isGameOver(gameState) {
    return gameState.gameStatus !== 'active';
  }
}

export default ChessEngine;