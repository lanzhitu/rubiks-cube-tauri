export type FaceColor = "U" | "R" | "F" | "D" | "L" | "B";

export type CubieKind = "corner" | "edge" | "center";

export type CubieType = {
    id: string;
    position: [number, number, number];
    stickers: Partial<Record<FaceColor, string>>;
    orientation?: [number, number, number];
    type: CubieKind;
};
