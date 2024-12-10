import React, { useState } from "react";
import { rgbToCssString, calculateColorDistance } from "../utils/colorUtils";

interface MixerProps {
  targetColor: { r: number; g: number; b: number };
}

const Mixer: React.FC<MixerProps> = ({ targetColor }) => {
  const [currentColor, setCurrentColor] = useState({ r: 0, g: 0, b: 0 });

  const handleColorChange = (color: keyof typeof currentColor, value: number) => {
    setCurrentColor((prev) => ({
      ...prev,
      [color]: Math.min(Math.max(prev[color] + value, 0), 255),
    }));
  };

  const matchPercentage =
    100 -
    (calculateColorDistance(currentColor, targetColor) / Math.sqrt(3 * 255 ** 2)) * 100;

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Mix Colors</h2>
      <div
        style={{
          width: "100px",
          height: "100px",
          backgroundColor: rgbToCssString(currentColor),
          margin: "0 auto",
          border: "1px solid #000",
        }}
      ></div>
      <p>{`RGB(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`}</p>
      <p>Match: {matchPercentage.toFixed(2)}%</p>
      <div>
        {["r", "g", "b"].map((color) => (
          <div key={color}>
            <button onClick={() => handleColorChange(color as "r" | "g" | "b", 5)}>
              Add {color.toUpperCase()}
            </button>
            <button onClick={() => handleColorChange(color as "r" | "g" | "b", -5)}>
              Subtract {color.toUpperCase()}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mixer;