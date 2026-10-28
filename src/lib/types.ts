export type DotType =
  | "square"
  | "dots"
  | "rounded"
  | "classy"
  | "classy-rounded"
  | "extra-rounded";

export type CornerSquareType =
  | "square"
  | "dot"
  | "extra-rounded"
  | "rounded"
  | "dots"
  | "classy"
  | "classy-rounded";

export type CornerDotType =
  | "square"
  | "dot"
  | "rounded"
  | "dots"
  | "classy"
  | "classy-rounded"
  | "extra-rounded";

export type ColorMode = "solid" | "gradient" | "mask";

export type GradientType = "linear" | "radial";

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QrSettings {
  data: string;
  size: number;
  margin: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  dotType: DotType;
  cornerSquareType: CornerSquareType;
  cornerDotType: CornerDotType;
  colorMode: ColorMode;
  fgColor: string;
  bgColor: string;
  gradientType: GradientType;
  gradientFrom: string;
  gradientTo: string;
  gradientRotation: number;
  maskImageUrl: string | null;
  maskInvert: boolean;
  logoUrl: string | null;
  logoSize: number;
}

export const DEFAULT_SETTINGS: QrSettings = {
  data: "https://vercel.com",
  size: 320,
  margin: 12,
  errorCorrectionLevel: "H",
  dotType: "rounded",
  cornerSquareType: "extra-rounded",
  cornerDotType: "dot",
  colorMode: "solid",
  fgColor: "#0f766e",
  bgColor: "#f8fafc",
  gradientType: "linear",
  gradientFrom: "#0f766e",
  gradientTo: "#0369a1",
  gradientRotation: 45,
  maskImageUrl: null,
  maskInvert: false,
  logoUrl: null,
  logoSize: 0.22,
};

export const DOT_STYLES: { value: DotType; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "dots", label: "Dots" },
  { value: "rounded", label: "Rounded" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy round" },
  { value: "extra-rounded", label: "Soft" },
];

export const CORNER_SQUARE_STYLES: { value: CornerSquareType; label: string }[] =
  [
    { value: "square", label: "Square" },
    { value: "dot", label: "Dot" },
    { value: "extra-rounded", label: "Soft" },
    { value: "rounded", label: "Rounded" },
    { value: "dots", label: "Dots" },
    { value: "classy", label: "Classy" },
    { value: "classy-rounded", label: "Classy round" },
  ];

export const CORNER_DOT_STYLES: { value: CornerDotType; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "dot", label: "Dot" },
  { value: "rounded", label: "Rounded" },
  { value: "dots", label: "Dots" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy round" },
  { value: "extra-rounded", label: "Soft" },
];

export const PRESETS: {
  name: string;
  patch: Partial<QrSettings>;
}[] = [
  {
    name: "Teal solid",
    patch: {
      colorMode: "solid",
      fgColor: "#0f766e",
      bgColor: "#f8fafc",
      dotType: "rounded",
      cornerSquareType: "extra-rounded",
      cornerDotType: "dot",
    },
  },
  {
    name: "Ink dots",
    patch: {
      colorMode: "solid",
      fgColor: "#111827",
      bgColor: "#ffffff",
      dotType: "dots",
      cornerSquareType: "dot",
      cornerDotType: "dot",
    },
  },
  {
    name: "Ocean fade",
    patch: {
      colorMode: "gradient",
      gradientType: "linear",
      gradientFrom: "#0f766e",
      gradientTo: "#0284c7",
      gradientRotation: 135,
      bgColor: "#f0f9ff",
      dotType: "extra-rounded",
      cornerSquareType: "extra-rounded",
      cornerDotType: "rounded",
    },
  },
  {
    name: "Sunset",
    patch: {
      colorMode: "gradient",
      gradientType: "radial",
      gradientFrom: "#ea580c",
      gradientTo: "#be123c",
      bgColor: "#fff7ed",
      dotType: "classy-rounded",
      cornerSquareType: "classy-rounded",
      cornerDotType: "classy",
    },
  },
];
