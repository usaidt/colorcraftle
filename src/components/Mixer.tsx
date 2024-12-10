import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { calculateMatchPercentage, normalizeColor } from "../utils/colorUtils";
import { GameMode } from "../utils/gameModes";

interface MixerProps {
  targetColor: { r: number; g: number; b: number };
  currentColor: { r: number; g: number; b: number };
  mode: GameMode;
  settings: {
    timeLimit: number;
    maxActions: number;
    accuracyThreshold: number;
    difficulty: string;
  };
  addColor: (adjustment: { r: number; g: number; b: number }, amount: number) => void;
  adjustShadeHandler: (percentage: number, isBlack: boolean) => void;
  resetGame: () => void;
  actions: number;
  timeLeft: number;
  gameOver: boolean;
  matchPercentage: number;
}

const Mixer: React.FC<MixerProps> = ({
  targetColor,
  currentColor,
  mode,
  settings,
  addColor,
  adjustShadeHandler,
  resetGame,
  actions,
  timeLeft,
  gameOver,
  matchPercentage,
}) => {
  const [hint, setHint] = useState("");
  const [finalMatchPercentage, setFinalMatchPercentage] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAdjusting = (color: { r: number; g: number; b: number }, amount: number) => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      addColor(color, amount);
    }, 100);
  };

  const stopAdjusting = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (settings.difficulty === "easy") {
      const diffR = targetColor.r - currentColor.r;
      const diffG = targetColor.g - currentColor.g;
      const diffB = targetColor.b - currentColor.b;
      const maxDiff = Math.max(Math.abs(diffR), Math.abs(diffG), Math.abs(diffB));

      if (maxDiff === Math.abs(diffR)) {
        setHint(diffR > 0 ? "Too little red" : "Too much red");
      } else if (maxDiff === Math.abs(diffG)) {
        setHint(diffG > 0 ? "Too little green" : "Too much green");
      } else {
        setHint(diffB > 0 ? "Too little blue" : "Too much blue");
      }
    } else {
      setHint("");
    }
  }, [currentColor, targetColor, settings.difficulty]);

  useEffect(() => {
    if (gameOver) {
      setFinalMatchPercentage(matchPercentage);
    }
  }, [gameOver, matchPercentage]);

  if (gameOver) {
    return (
      <div className="stats space-y-4 text-center">
        <h2 className="text-2xl font-bold">
          {finalMatchPercentage >= settings.accuracyThreshold
            ? "You Win!"
            : "Game Over!"}
        </h2>
        <p>Final Match Percentage: {finalMatchPercentage.toFixed(2)}%</p>
        <p>Total Actions: {actions}</p>
        {(mode === "time" || (mode === "endless" && settings.difficulty === "hard")) && <p>Time Remaining: {timeLeft}s</p>}
        <Link
          to="/"
          className="inline-block mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out"
          onClick={resetGame}
        >
          Play Again
        </Link>
      </div>
    );
  }

  return (
    <div className="mixer space-y-6 max-w-md mx-auto">
      <div
        className="color-box w-48 h-48 mx-auto rounded-lg shadow-lg"
        style={{
          backgroundColor: `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`,
        }}
      ></div>
      <p className="text-center text-lg">
        Your Color: RGB ({currentColor.r.toFixed(0)}, {currentColor.g.toFixed(0)},{" "}
        {currentColor.b.toFixed(0)})
      </p>
      <p className="text-center text-lg font-semibold">Match Percentage: {matchPercentage.toFixed(2)}%</p>

      {(mode === "time" || (mode === "endless" && settings.difficulty === "hard")) && (
        <p className="text-center text-lg">Time Left: {timeLeft}s</p>
      )}
      {(mode === "standard" || (mode === "endless" && settings.difficulty === "hard")) && (
        <p className="text-center text-lg">Actions Remaining: {settings.maxActions - actions}</p>
      )}

      {hint && <p className="text-center text-lg font-semibold text-yellow-600">{hint}</p>}

      <div className="space-y-4">
        {["Red", "Green", "Blue"].map((color) => (
          <div key={color} className="flex items-center justify-between">
            <span className="font-medium text-lg">{color}</span>
            <div className="space-x-2">
              {[1, 5, 10, 50].map((amount) => (
                <button
                  key={amount}
                  className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 ease-in-out"
                  onMouseDown={() =>
                    startAdjusting({
                      r: color === "Red" ? 1 : 0,
                      g: color === "Green" ? 1 : 0,
                      b: color === "Blue" ? 1 : 0,
                    }, amount)
                  }
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

      {settings.difficulty !== "hard" && (
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out"
            onClick={() => adjustShadeHandler(0.1, true)}
          >
            Darken
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out"
            onClick={() => adjustShadeHandler(0.1, false)}
          >
            Lighten
          </button>
        </div>
      )}

      <button
        className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
        onClick={() => addColor({ r: -currentColor.r, g: -currentColor.g, b: -currentColor.b }, 1)}
      >
        Reset Color
      </button>
    </div>
  );
};

export default Mixer;

