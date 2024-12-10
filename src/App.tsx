import React, { useState, useEffect, useRef } from 'react';
import { GameMode } from './utils/gameModes';
import { calculateMatchPercentage, generateRandomColor, rgbToCssString } from './utils/colorUtils';

const App: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode>('standard');
  const [difficulty, setDifficulty] = useState<string>('normal');
  const [settings, setSettings] = useState({
    timeLimit: 60,
    maxActions: 50,
    accuracyThreshold: 98.5,
  });
  const [targetColor, setTargetColor] = useState(generateRandomColor());
  const [currentColor, setCurrentColor] = useState({ r: 0, g: 0, b: 0 });
  const [matchPercentage, setMatchPercentage] = useState(0);
  const [actions, setActions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(settings.timeLimit);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [hint, setHint] = useState('');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const timer = setInterval(() => {
        if (gameMode === 'time' || (gameMode === 'endless' && difficulty === 'hard')) {
          setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(timer);
              setGameOver(true);
              return 0;
            }
            return prevTime - 1;
          });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameStarted, gameOver, gameMode, difficulty]);

  useEffect(() => {
    setMatchPercentage(calculateMatchPercentage(targetColor, currentColor));

    if (difficulty === 'easy') {
      const diffR = targetColor.r - currentColor.r;
      const diffG = targetColor.g - currentColor.g;
      const diffB = targetColor.b - currentColor.b;
      const maxDiff = Math.max(Math.abs(diffR), Math.abs(diffG), Math.abs(diffB));

      if (maxDiff === Math.abs(diffR)) {
        setHint(diffR > 0 ? 'Too little red' : 'Too much red');
      } else if (maxDiff === Math.abs(diffG)) {
        setHint(diffG > 0 ? 'Too little green' : 'Too much green');
      } else {
        setHint(diffB > 0 ? 'Too little blue' : 'Too much blue');
      }
    } else {
      setHint('');
    }

    if (matchPercentage >= settings.accuracyThreshold) {
      setGameOver(true);
    }
  }, [currentColor, targetColor, difficulty, matchPercentage, settings.accuracyThreshold]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setCurrentColor({ r: 0, g: 0, b: 0 });
    setActions(0);
    setTimeLeft(settings.timeLimit);
    setTargetColor(generateRandomColor());
  };

  const adjustColor = (color: 'r' | 'g' | 'b' | 'all', amount: number) => {
    if (gameOver) return;
  
    if (color === "all") {
      setCurrentColor((prev) => ({
        r: Math.max(0, Math.min(255, prev.r + amount)),
        g: Math.max(0, Math.min(255, prev.g + amount)),
        b: Math.max(0, Math.min(255, prev.b + amount)),
      }));
    } else {
      setCurrentColor((prev) => ({
        ...prev,
        [color]: Math.max(0, Math.min(255, prev[color] + amount)),
      }));
    }
  
    setActions((prev) => prev + 1);
  
    if (gameMode === 'standard' && actions + 1 >= settings.maxActions) {
      setGameOver(true);
    }
  };

  const startAdjusting = (color: 'r' | 'g' | 'b' | 'all', amount: number) => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      adjustColor(color, amount);
    }, 50);
  };

  const stopAdjusting = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetColor = () => {
    setCurrentColor({ r: 0, g: 0, b: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-indigo-300 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold text-purple-600 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
          ColorCraftle
        </h1>

        <div className="flex justify-center space-x-4 mb-8">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Mode:</span>
            {["time", "standard", "endless"].map((mode) => (
              <button
                key={mode}
                className={`px-4 py-2 text-sm font-semibold rounded-lg shadow-md transition duration-300 ${
                  gameMode === mode
                    ? "bg-purple-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setGameMode(mode as GameMode)}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Difficulty:</span>
            {["easy", "normal", "hard"].map((diff) => (
              <button
                key={diff}
                className={`px-4 py-2 text-sm font-semibold rounded-lg shadow-md transition duration-300 ${
                  difficulty === diff
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setDifficulty(diff)}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center space-x-8 mb-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">Target Color</h2>
            <div
              className="w-28 h-28 rounded-lg shadow-lg mx-auto border-2 border-gray-300 flex items-center justify-center"
              style={{ backgroundColor: rgbToCssString(targetColor) }}
            >
              {/* <span className="text-sm text-gray-700 bg-white bg-opacity-75 px-2 py-1 rounded">
                RGB({targetColor.r}, {targetColor.g}, {targetColor.b})
              </span> */}
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">Your Color</h2>
            <div
              className="w-28 h-28 rounded-lg shadow-lg mx-auto border-2 border-gray-300 flex items-center justify-center"
              style={{ backgroundColor: rgbToCssString(currentColor) }}
            >
              <span className="text-sm text-gray-700 bg-white bg-opacity-75 px-2 py-1 rounded">
                RGB({currentColor.r}, {currentColor.g}, {currentColor.b})
              </span>
            </div>
          </div>
        </div>

        {!gameStarted ? (
          <button
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition duration-300 text-lg"
            onClick={startGame}
          >
            Start Game
          </button>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-2xl font-semibold mb-2">Match: {matchPercentage.toFixed(2)}%</p>
              {gameMode === "time" && <p className="text-lg">Time Left: {timeLeft}s</p>}
              {gameMode === "standard" && <p className="text-lg">Actions Left: {settings.maxActions - actions}</p>}
              {hint && <p className="text-lg text-yellow-600 font-medium mt-2">{hint}</p>}
            </div>

            <div className="space-y-4">
              {["Red", "Green", "Blue"].map((color) => (
                <div key={color} className="flex items-center justify-between">
                  <span className="font-medium text-lg">{color}</span>
                  <div className="space-x-2">
                    {[1, 5, 10, 50].map((amount) => (
                      <button
                        key={amount}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition duration-300"
                        onMouseDown={() => startAdjusting(color.toLowerCase()[0] as "r" | "g" | "b", amount)}
                        onMouseUp={stopAdjusting}
                        onMouseLeave={stopAdjusting}
                      >
                        +{amount}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {difficulty !== "hard" && (
              <div className="flex justify-between mt-6">
                <button
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300"
                  onMouseDown={() => startAdjusting("all", -5)}
                  onMouseUp={stopAdjusting}
                  onMouseLeave={stopAdjusting}
                >
                  Darken
                </button>
                <button
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300"
                  onMouseDown={() => startAdjusting("all", 5)}
                  onMouseUp={stopAdjusting}
                  onMouseLeave={stopAdjusting}
                >
                  Lighten
                </button>
              </div>
            )}

            <button
              className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition duration-300 text-lg"
              onClick={resetColor}
            >
              Reset Color
            </button>
          </>
        )}

        {gameOver && (
          <div className="mt-8">
            <h2 className="text-3xl font-bold mb-4">
              {matchPercentage >= settings.accuracyThreshold ? "You Win!" : "Game Over!"}
            </h2>
            <p className="text-xl mb-2">Final Match: {matchPercentage.toFixed(2)}%</p>
            <p className="text-xl mb-4">Total Actions: {actions}</p>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 text-lg"
              onClick={startGame}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
