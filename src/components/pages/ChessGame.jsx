import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ChessBoard from '@/components/organisms/ChessBoard';
import GameStatus from '@/components/organisms/GameStatus';
import CapturedPieces from '@/components/organisms/CapturedPieces';
import GameControls from '@/components/organisms/GameControls';
import PiecePromotionModal from '@/components/molecules/PiecePromotionModal';
import ChessService from '@/services/api/ChessService';
import Loading from '@/components/ui/Loading';

const ChessGame = () => {
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [computerThinking, setComputerThinking] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [promotionMove, setPromotionMove] = useState(null);
  const [playerColor, setPlayerColor] = useState('white');
  const [difficulty, setDifficulty] = useState(3);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (gameState && gameState.currentTurn !== playerColor && gameState.gameStatus === 'active') {
      makeComputerMove();
    }
  }, [gameState?.currentTurn, playerColor]);

  const initializeGame = async () => {
    try {
      setLoading(true);
      const newGame = await ChessService.newGame(playerColor);
      setGameState(newGame);
      setSelectedSquare(null);
      setValidMoves([]);
      toast.success(`New game started! You are playing as ${playerColor}.`);
    } catch (error) {
      console.error('Failed to initialize game:', error);
      toast.error('Failed to start new game');
    } finally {
      setLoading(false);
    }
  };

  const makeComputerMove = async () => {
    if (!gameState || gameState.gameStatus !== 'active') return;
    
    try {
      setComputerThinking(true);
      
      // Add a small delay to make the computer "think"
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedState = await ChessService.makeComputerMove(gameState, difficulty);
      setGameState(updatedState);
      
      if (updatedState.gameStatus !== 'active') {
        handleGameEnd(updatedState.gameStatus);
      }
    } catch (error) {
      console.error('Computer move failed:', error);
      toast.error('Computer move failed');
    } finally {
      setComputerThinking(false);
    }
  };

  const handleSquareClick = async (square) => {
    if (!gameState || gameState.currentTurn !== playerColor || computerThinking) return;

    // If clicking on already selected square, deselect
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    // If no square selected, select this square if it has a piece of current player
    if (!selectedSquare) {
      const piece = gameState.board[square];
      if (piece && piece.color === playerColor) {
        setSelectedSquare(square);
        const moves = await ChessService.getValidMoves(gameState, square);
        setValidMoves(moves);
      }
      return;
    }

    // If square is selected and clicking on a valid move
    if (validMoves.includes(square)) {
      await makePlayerMove(selectedSquare, square);
    } else {
      // If clicking on another piece of same color, select it
      const piece = gameState.board[square];
      if (piece && piece.color === playerColor) {
        setSelectedSquare(square);
        const moves = await ChessService.getValidMoves(gameState, square);
        setValidMoves(moves);
      } else {
        // Deselect
        setSelectedSquare(null);
        setValidMoves([]);
      }
    }
  };

  const makePlayerMove = async (from, to) => {
    try {
      const piece = gameState.board[from];
      
      // Check for pawn promotion
      if (piece.type === 'pawn' && 
          ((piece.color === 'white' && to[1] === '8') || 
           (piece.color === 'black' && to[1] === '1'))) {
        setPromotionMove({ from, to });
        setShowPromotionModal(true);
        return;
      }

      const updatedState = await ChessService.makeMove(gameState, from, to);
      setGameState(updatedState);
      setSelectedSquare(null);
      setValidMoves([]);

      if (updatedState.gameStatus !== 'active') {
        handleGameEnd(updatedState.gameStatus);
      }
    } catch (error) {
      console.error('Move failed:', error);
      toast.error('Invalid move');
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  const handlePromotion = async (promotionPiece) => {
    if (!promotionMove) return;

    try {
      const updatedState = await ChessService.makeMove(
        gameState, 
        promotionMove.from, 
        promotionMove.to, 
        promotionPiece
      );
      setGameState(updatedState);
      setSelectedSquare(null);
      setValidMoves([]);
      setShowPromotionModal(false);
      setPromotionMove(null);

      if (updatedState.gameStatus !== 'active') {
        handleGameEnd(updatedState.gameStatus);
      }
    } catch (error) {
      console.error('Promotion failed:', error);
      toast.error('Promotion failed');
    }
  };

  const handleGameEnd = (status) => {
    switch (status) {
      case 'checkmate':
        const winner = gameState.currentTurn === 'white' ? 'Black' : 'White';
        toast.success(`Checkmate! ${winner} wins!`);
        break;
      case 'stalemate':
        toast.info('Stalemate! The game is a draw.');
        break;
      case 'draw':
        toast.info('Draw! The game ended in a draw.');
        break;
      default:
        break;
    }
  };

  const handleNewGame = () => {
    initializeGame();
  };

  const handleColorChange = (color) => {
    setPlayerColor(color);
    setTimeout(() => initializeGame(), 100);
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  if (loading) {
    return <Loading message="Setting up the chess board..." />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Game Controls */}
        <div className="lg:col-span-3">
          <GameControls
            onNewGame={handleNewGame}
            playerColor={playerColor}
            onColorChange={handleColorChange}
            difficulty={difficulty}
            onDifficultyChange={handleDifficultyChange}
            gameActive={gameState?.gameStatus === 'active'}
          />
        </div>

        {/* Left Panel - Captured Pieces & Game Status */}
        <div className="space-y-4">
          <GameStatus
            gameState={gameState}
            playerColor={playerColor}
            computerThinking={computerThinking}
          />
          <CapturedPieces
            capturedPieces={gameState?.capturedPieces || { white: [], black: [] }}
          />
        </div>

        {/* Center - Chess Board */}
        <div className="flex justify-center">
          <ChessBoard
            gameState={gameState}
            selectedSquare={selectedSquare}
            validMoves={validMoves}
            onSquareClick={handleSquareClick}
            playerColor={playerColor}
            disabled={computerThinking || gameState?.gameStatus !== 'active'}
          />
        </div>

        {/* Right Panel - Move History & Stats */}
        <div className="space-y-4">
          <div className="status-card">
            <h3 className="font-display font-semibold text-chess-dark mb-3">
              Game Statistics
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Move Number:</span>
                <span className="font-semibold">{gameState?.fullMoveNumber || 1}</span>
              </div>
              <div className="flex justify-between">
                <span>Difficulty:</span>
                <span className="font-semibold">Level {difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span>Search Depth:</span>
                <span className="font-semibold">{difficulty} moves</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Promotion Modal */}
      {showPromotionModal && (
        <PiecePromotionModal
          color={playerColor}
          onSelect={handlePromotion}
          onClose={() => {
            setShowPromotionModal(false);
            setPromotionMove(null);
            setSelectedSquare(null);
            setValidMoves([]);
          }}
        />
      )}
    </div>
  );
};

export default ChessGame;