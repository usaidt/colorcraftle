import React from "react";
import { Link } from "react-router-dom";
import { GameMode } from "../utils/gameModes";

interface HeaderProps {
  gameMode: GameMode;
  difficulty: string;
  onModeChange: (mode: GameMode) => void;
  onDifficultyChange: (difficulty: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  gameMode,
  difficulty,
  onModeChange,
  onDifficultyChange,
}) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          ColorCraft
        </Link>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Mode:</span>
            {["time", "standard", "endless"].map((mode) => (
              <button
                key={mode}
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  gameMode === mode
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => onModeChange(mode as GameMode)}
              >
                {mode}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">
              Difficulty:
            </span>
            {["easy", "normal", "hard"].map((diff) => (
              <button
                key={diff}
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  difficulty === diff
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => onDifficultyChange(diff)}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;