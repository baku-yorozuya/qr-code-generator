import type {
  CornerDotType,
  CornerSquareType,
  DotType,
  ErrorCorrectionLevel,
} from "./types";

export async function renderMaskedQr(options: {
  data: string;
  size: number;
  margin: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  imageUrl: string;
  invert?: boolean;
  bgColor?: string;
  dotType: DotType;
  cornerSquareType: CornerSquareType;
  cornerDotType: CornerDotType;
}): Promise<HTMLCanvasElement> {
  const {
    data,
    size,
    margin,
    errorCorrectionLevel,
    imageUrl,
    invert = false,
    bgColor = "#ffffff",
    dotType,
    cornerSquareType,
    cornerDotType,
  } = options;

  const qrCanvas = await renderStyledMaskCanvas({
    data,
    size,
    margin,
    errorCorrectionLevel,
    dotType,
    cornerSquareType,
    cornerDotType,
  });

  const image = await loadImage(imageUrl);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unsupported");

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  const scale = Math.max(size / image.width, size / image.height);
  const drawW = image.width * scale;
  const drawH = image.height * scale;
  const dx = (size - drawW) / 2;
  const dy = (size - drawH) / 2;
  ctx.drawImage(image, dx, dy, drawW, drawH);

  ctx.globalCompositeOperation = invert ? "destination-out" : "destination-in";
  ctx.drawImage(qrCanvas, 0, 0, size, size);
  ctx.globalCompositeOperation = "source-over";

  return canvas;
}

async function renderStyledMaskCanvas(options: {
  data: string;
  size: number;
  margin: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  dotType: DotType;
  cornerSquareType: CornerSquareType;
  cornerDotType: CornerDotType;
}): Promise<HTMLCanvasElement> {
  const { default: QRCodeStyling } = await import("qr-code-styling");

  const qr = new QRCodeStyling({
    width: options.size,
    height: options.size,
    type: "canvas",
    data: options.data || " ",
    margin: options.margin,
    qrOptions: {
      errorCorrectionLevel: options.errorCorrectionLevel,
    },
    dotsOptions: {
      type: options.dotType,
      color: "#000000",
    },
    backgroundOptions: {
      color: "#00000000",
    },
    cornersSquareOptions: {
      type: options.cornerSquareType,
      color: "#000000",
    },
    cornersDotOptions: {
      type: options.cornerDotType,
      color: "#000000",
    },
  });

  const blob = await qr.getRawData("png");
  if (!blob || !(blob instanceof Blob)) {
    throw new Error("Failed to render styled QR mask");
  }

  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = options.size;
    canvas.height = options.size;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unsupported");
    ctx.drawImage(img, 0, 0, options.size, options.size);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}
