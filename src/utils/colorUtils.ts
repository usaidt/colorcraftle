export function generateRandomColor(): { r: number; g: number; b: number } {
    return {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256),
    };
}

export function calculateColorDistance(
    color1: { r: number; g: number; b: number },
    color2: { r: number; g: number; b: number }
    ): number {
    return Math.sqrt(
        Math.pow(color1.r - color2.r, 2) +
        Math.pow(color1.g - color2.g, 2) +
        Math.pow(color1.b - color2.b, 2)
    );
}

export function rgbToCssString(color: { r: number; g: number; b: number }): string {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
}
  