export const calculateMatchPercentage = (target: { r: number; g: number; b: number }, mix: { r: number; g: number; b: number }) => {
    const diff = Math.sqrt(
        Math.pow(target.r - mix.r, 2) +
        Math.pow(target.g - mix.g, 2) +
        Math.pow(target.b - mix.b, 2)
    );
    const maxDiff = Math.sqrt(3 * Math.pow(255, 2));
    return Math.round((1 - diff / maxDiff) * 100);
};

export const generateRandomColor = () => {
    return {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256),
    };
};

export function rgbToCssString(color: { r: number; g: number; b: number }): string {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

export const normalizeColor = (color: { r: number; g: number; b: number }) => {
    const max = Math.max(color.r, color.g, color.b, 1);
    return {
        r: Math.round((color.r / max) * 255),
        g: Math.round((color.g / max) * 255),
        b: Math.round((color.b / max) * 255),
    };
};

export const adjustColor = (current: { r: number; g: number; b: number; }, adjustment: { r: number; g: number; b: number; }, amount: number) => {
    return {
        r: current.r + adjustment.r,
        g: current.g + adjustment.g,
        b: current.b + adjustment.b,
    };
};

export const adjustShade = (current: { r: number; g: number; b: number }, percentage: number, isBlack: boolean) => {
    const factor = isBlack ? 1 - percentage : 1 + percentage;
    return {
        r: Math.max(0, Math.min(255, Math.round(current.r * factor))),
        g: Math.max(0, Math.min(255, Math.round(current.g * factor))),
        b: Math.max(0, Math.min(255, Math.round(current.b * factor))),
    };
};
