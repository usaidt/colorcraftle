import React from "react";
import { rgbToCssString } from "../utils/colorUtils";

interface TargetColorProps {
  color: { r: number; g: number; b: number };
}

const TargetColor: React.FC<TargetColorProps> = ({ color }) => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-semibold mb-4">Target Color</h2>
      <div
        className="w-48 h-48 mx-auto rounded-lg shadow-lg"
        style={{
          backgroundColor: rgbToCssString(color),
        }}
      ></div>
      <p className="mt-4 text-lg">
        RGB({color.r}, {color.g}, {color.b})
      </p>
    </div>
  );
};

export default TargetColor;