import { useState, useEffect } from "react";
import {
  normalizeColor,
  adjustColor,
  adjustShade,
  calculateMatchPercentage,
  generateRandomColor,
} from "../utils/colorUtils";
import { gameModes, GameMode } from "../utils/gameModes";

export const useGameState = (mode: GameMode, settings: any) => {
  const [targetColor, setTargetColor] = useState(generateRandomColor());
  const [currentColor, setCurrentColor] = useState({ r: 0, g: 0, b: 0 });
  const [normalizedColor, setNormalizedColor] = useState(
    normalizeColor(currentColor)
  );
  const [matchPercentage, setMatchPercentage] = useState(0);
  const [actions, setActions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(settings.timeLimit || 0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setMatchPercentage(
      calculateMatchPercentage(targetColor, normalizedColor)
    );
  }, [normalizedColor, targetColor]);

  useEffect(() => {
    if (mode === "time" || (mode === "endless" && settings.difficulty === "hard")) {
      const timer = setInterval(() => {
        setTimeLeft((prev: number) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, settings.difficulty]);

  const addColor = (adjustment: { r: number; g: number; b: number }, amount: number) => {
    setCurrentColor((prev) => adjustColor(prev, adjustment, amount));
    setActions((prev) => prev + 1);
    checkGameOver();
  };

  const adjustShadeHandler = (percentage: number, isBlack: boolean) => {
    setCurrentColor((prev) => adjustShade(prev, percentage, isBlack));
    setActions((prev) => prev + 1);
    checkGameOver();
  };

  const checkGameOver = () => {
    if (matchPercentage >= settings.accuracyThreshold) {
      if (mode === "endless") {
        setScore((prev) => prev + 1);
        setTargetColor(generateRandomColor());
        setCurrentColor({ r: 0, g: 0, b: 0 });
        setActions(0);
        setTimeLeft(settings.timeLimit);
      } else {
        setGameOver(true);
      }
    } else if ((mode === "standard" || (mode === "endless" && settings.difficulty === "hard")) && actions >= settings.maxActions) {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setTargetColor(generateRandomColor());
    setCurrentColor({ r: 0, g: 0, b: 0 });
    setActions(0);
    setTimeLeft(settings.timeLimit || 0);
    setScore(0);
    setGameOver(false);
  };

  return {
    targetColor,
    currentColor,
    normalizedColor,
    matchPercentage,
    actions,
    timeLeft,
    score,
    gameOver,
    addColor,
    adjustShadeHandler,
    resetGame,
  };
};

