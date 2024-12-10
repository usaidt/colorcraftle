import React from "react";
import "./App.css";
import TargetColor from "./components/TargetColor";
import Mixer from "./components/Mixer";
import { generateRandomColor } from "./utils/colorUtils";

const App: React.FC = () => {
  const targetColor = generateRandomColor();

  return (
    <div className="App">
      <h1>ColorCraftle</h1>
      <TargetColor color={targetColor} />
      <Mixer targetColor={targetColor} />
    </div>
  );
};

export default App;