import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import ChessBoard from "@/components/organisms/ChessBoard";
import GameControls from "@/components/organisms/GameControls";
import GameStatus from "@/components/organisms/GameStatus";
import CapturedPieces from "@/components/organisms/CapturedPieces";
import PiecePromotionModal from "@/components/molecules/PiecePromotionModal";
import Loading from "@/components/ui/Loading";
import ChessService from "@/services/api/ChessService";

export default function ChessGame() {
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [computerThinking, setComputerThinking] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [promotionMove, setPromotionMove] = useState(null);
  const [playerColor, setPlayerColor] = useState('white');
  const [difficulty, setDifficulty] = useState(3);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
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
    if (!gameState || gameState.currentTurn !== playerColor || computerThinking || dragActive) return;

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

  const handleDragStart = async (square) => {
    if (!gameState || gameState.currentTurn !== playerColor || computerThinking) return false;
    
    const piece = gameState.board[square];
    if (!piece || piece.color !== playerColor) return false;
    
    setDraggedPiece(piece);
    setDraggedFrom(square);
    setDragActive(true);
    
    const moves = await ChessService.getValidMoves(gameState, square);
    setValidMoves(moves);
    setSelectedSquare(square);
    
    return true;
  };

  const handleDragEnd = () => {
    setDraggedPiece(null);
    setDraggedFrom(null);
    setDragActive(false);
    setSelectedSquare(null);
    setValidMoves([]);
  };

  const handleDrop = async (square) => {
    if (!draggedFrom || !draggedPiece) return false;
    
    if (validMoves.includes(square)) {
      await makePlayerMove(draggedFrom, square);
      handleDragEnd();
      return true;
    }
    
    handleDragEnd();
    return false;
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
    <div className="max-w-full lg:max-w-7xl mx-auto space-y-3 lg:space-y-6 px-2 lg:px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Game Controls */}
        <div className="w-full">
          <GameControls
            onNewGame={handleNewGame}
            playerColor={playerColor}
            onColorChange={handleColorChange}
            difficulty={difficulty}
            onDifficultyChange={handleDifficultyChange}
            gameActive={gameState?.gameStatus === 'active'}
          />
        </div>

        {/* Mobile Layout */}
        <div className="block lg:hidden space-y-4">
          {/* Mobile Status Panel */}
          <motion.div 
            className={`mobile-panel ${leftPanelCollapsed ? 'collapsed' : 'expanded'}`}
            layout
          >
            <div 
              className="flex items-center justify-between p-3 cursor-pointer"
              onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
            >
              <h3 className="font-display font-semibold text-chess-dark">Game Status</h3>
              <ApperIcon 
                name={leftPanelCollapsed ? "ChevronDown" : "ChevronUp"} 
                size={20} 
                className="text-chess-dark" 
              />
            </div>
            {!leftPanelCollapsed && (
              <div className="px-3 pb-3 space-y-3">
                <GameStatus
                  gameState={gameState}
                  playerColor={playerColor}
                  computerThinking={computerThinking}
                />
                <CapturedPieces
                  capturedPieces={gameState?.capturedPieces || { white: [], black: [] }}
                />
              </div>
            )}
          </motion.div>

          {/* Chess Board - Mobile */}
          <div className="flex justify-center">
            <ChessBoard
              gameState={gameState}
              selectedSquare={selectedSquare}
              validMoves={validMoves}
              onSquareClick={handleSquareClick}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              draggedPiece={draggedPiece}
              draggedFrom={draggedFrom}
              dragActive={dragActive}
              playerColor={playerColor}
              disabled={computerThinking || gameState?.gameStatus !== 'active'}
            />
          </div>

          {/* Mobile Stats Panel */}
          <motion.div 
            className={`mobile-panel ${rightPanelCollapsed ? 'collapsed' : 'expanded'}`}
            layout
          >
            <div 
              className="flex items-center justify-between p-3 cursor-pointer"
              onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
            >
              <h3 className="font-display font-semibold text-chess-dark">Statistics</h3>
              <ApperIcon 
                name={rightPanelCollapsed ? "ChevronDown" : "ChevronUp"} 
                size={20} 
                className="text-chess-dark" 
              />
            </div>
            {!rightPanelCollapsed && (
              <div className="px-3 pb-3">
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
            )}
          </motion.div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Desktop */}
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

          {/* Center - Chess Board Desktop */}
          <div className="flex justify-center">
            <ChessBoard
              gameState={gameState}
              selectedSquare={selectedSquare}
              validMoves={validMoves}
              onSquareClick={handleSquareClick}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              draggedPiece={draggedPiece}
              draggedFrom={draggedFrom}
              dragActive={dragActive}
              playerColor={playerColor}
              disabled={computerThinking || gameState?.gameStatus !== 'active'}
            />
          </div>

          {/* Right Panel - Desktop */}
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