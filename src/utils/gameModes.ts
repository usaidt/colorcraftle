export type GameMode = "time" | "standard" | "endless";

export const gameModes = {
  time: (timeLimit: number, callback: () => void) => {
    const timer = setTimeout(callback, timeLimit * 1000);
    return () => clearTimeout(timer);
  },
  count: (maxActions: number, currentActions: number) => {
    return currentActions >= maxActions;
  },
  endless: () => {
    return false;
  },
};
