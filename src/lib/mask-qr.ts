import QRCode from "qrcode";
import type { ErrorCorrectionLevel } from "./types";

export async function renderMaskedQr(options: {
  data: string;
  size: number;
  margin: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  imageUrl: string;
  invert?: boolean;
  bgColor?: string;
}): Promise<HTMLCanvasElement> {
  const {
    data,
    size,
    margin,
    errorCorrectionLevel,
    imageUrl,
    invert = false,
    bgColor = "#ffffff",
  } = options;

  const qrCanvas = document.createElement("canvas");
  await QRCode.toCanvas(qrCanvas, data || " ", {
    errorCorrectionLevel,
    margin: Math.max(0, Math.round(margin / 8)),
    width: size,
    color: {
      dark: "#000000",
      light: "#00000000",
    },
  });

  const image = await loadImage(imageUrl);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unsupported");

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // Draw the photo, then keep only QR-dark pixels.
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

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load mask image"));
    img.src = src;
  });
}
