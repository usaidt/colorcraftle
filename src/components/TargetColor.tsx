import React from "react";
import { rgbToCssString } from "../utils/colorUtils";

interface TargetColorProps {
  color: { r: number; g: number; b: number };
}

const TargetColor: React.FC<TargetColorProps> = ({ color }) => {
  return (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <h2>Target Color</h2>
      <div
        style={{
          width: "100px",
          height: "100px",
          backgroundColor: rgbToCssString(color),
          margin: "0 auto",
          border: "1px solid #000",
        }}
      ></div>
      <p>{`RGB(${color.r}, ${color.g}, ${color.b})`}</p>
    </div>
  );
};

export default TargetColor;