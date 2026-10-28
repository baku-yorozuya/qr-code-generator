"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type QRCodeStyling from "qr-code-styling";
import { renderMaskedQr } from "@/lib/mask-qr";
import {
  CORNER_DOT_STYLES,
  CORNER_SQUARE_STYLES,
  DEFAULT_SETTINGS,
  DOT_STYLES,
  PRESETS,
  SIZE_UNITS,
  resolveSizePx,
  type QrSettings,
  type SizeUnit,
} from "@/lib/types";

export default function QrStudio() {
  const [settings, setSettings] = useState<QrSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const [, startTransition] = useTransition();
  const mountRef = useRef<HTMLDivElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const objectUrls = useRef<string[]>([]);

  const sizePx = resolveSizePx(settings);
  const showStyled = settings.colorMode !== "mask";

  const update = <K extends keyof QrSettings>(key: K, value: QrSettings[K]) => {
    startTransition(() => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    });
  };

  const rememberUrl = (url: string) => {
    objectUrls.current.push(url);
    return url;
  };

  useEffect(() => {
    return () => {
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      const { default: QRCodeStyling } = await import("qr-code-styling");
      if (cancelled || !mountRef.current) return;

      const instance = new QRCodeStyling(buildOptions(settings, sizePx));
      mountRef.current.replaceChildren();
      instance.append(mountRef.current);
      qrRef.current = instance;
      setReady(true);
    }

    boot();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- boot once
  }, []);

  useEffect(() => {
    if (!ready) return;

    async function sync() {
      if (settings.colorMode === "mask") {
        if (!settings.maskImageUrl || !maskCanvasRef.current) return;
        try {
          const canvas = await renderMaskedQr({
            data: settings.data || " ",
            size: sizePx,
            margin: settings.margin,
            errorCorrectionLevel: settings.errorCorrectionLevel,
            imageUrl: settings.maskImageUrl,
            invert: settings.maskInvert,
            bgColor: settings.bgColor,
          });
          const target = maskCanvasRef.current;
          const ctx = target.getContext("2d");
          if (!ctx) return;
          target.width = sizePx;
          target.height = sizePx;
          ctx.clearRect(0, 0, sizePx, sizePx);
          ctx.drawImage(canvas, 0, 0);
        } catch {
          // Keep previous frame if mask image fails.
        }
        return;
      }

      qrRef.current?.update(buildOptions(settings, sizePx));
    }

    sync();
  }, [settings, ready, sizePx]);

  const onFile = (
    file: File | undefined,
    key: "maskImageUrl" | "logoUrl",
  ) => {
    if (!file) return;
    const url = rememberUrl(URL.createObjectURL(file));
    if (key === "maskImageUrl") {
      setSettings((prev) => ({
        ...prev,
        maskImageUrl: url,
        colorMode: "mask",
        errorCorrectionLevel: "H",
      }));
      return;
    }
    update(key, url);
  };

  const download = async (ext: "png" | "svg") => {
    if (settings.colorMode === "mask") {
      const canvas = maskCanvasRef.current;
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = "dotmask-qr.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      return;
    }
    await qrRef.current?.download({ name: "dotmask-qr", extension: ext });
  };

  return (
    <div className="studio">
      <section className="preview-pane" aria-label="QR preview">
        <div className="preview-stage">
          <div
            ref={mountRef}
            className="qr-mount"
            hidden={!showStyled}
            aria-hidden={!showStyled}
          />
          <canvas
            ref={maskCanvasRef}
            className="mask-canvas"
            hidden={showStyled}
            aria-hidden={showStyled}
            width={sizePx}
            height={sizePx}
          />
          {!settings.maskImageUrl && settings.colorMode === "mask" ? (
            <p className="mask-hint">Upload a photo to mask the QR modules.</p>
          ) : null}
        </div>

        <div className="preview-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={() => download("png")}
          >
            Download PNG
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => download("svg")}
            disabled={!showStyled}
            title={showStyled ? "Download SVG" : "SVG unavailable in mask mode"}
          >
            Download SVG
          </button>
        </div>
      </section>

      <section className="controls" aria-label="QR settings">
        <div className="control-row">
          <label className="field">
            <span>Content</span>
            <textarea
              value={settings.data}
              onChange={(e) => update("data", e.target.value)}
              rows={3}
              placeholder="URL or text"
            />
          </label>
        </div>

        <div className="control-row">
          <div className="field">
            <span>Presets</span>
            <div className="chip-row">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  className="chip"
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, ...preset.patch }))
                  }
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="settings-block">
          <div className="control-row">
            <label className="field">
              <span>Module style</span>
              <select
                value={settings.dotType}
                disabled={!showStyled}
                onChange={(e) =>
                  update("dotType", e.target.value as QrSettings["dotType"])
                }
              >
                {DOT_STYLES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="control-row row-2">
            <label className="field">
              <span>Finder outer</span>
              <select
                value={settings.cornerSquareType}
                disabled={!showStyled}
                onChange={(e) =>
                  update(
                    "cornerSquareType",
                    e.target.value as QrSettings["cornerSquareType"],
                  )
                }
              >
                {CORNER_SQUARE_STYLES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Finder center</span>
              <select
                value={settings.cornerDotType}
                disabled={!showStyled}
                onChange={(e) =>
                  update(
                    "cornerDotType",
                    e.target.value as QrSettings["cornerDotType"],
                  )
                }
              >
                {CORNER_DOT_STYLES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="control-row">
            <div className="field">
              <span>Fill</span>
              <div className="segmented" role="tablist" aria-label="Fill mode">
                {(
                  [
                    ["solid", "Solid"],
                    ["gradient", "Gradient"],
                    ["mask", "Image mask"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    role="tab"
                    aria-selected={settings.colorMode === value}
                    className={settings.colorMode === value ? "active" : ""}
                    onClick={() => update("colorMode", value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="control-row">
            {settings.colorMode === "solid" ? (
              <ColorField
                label="Foreground"
                value={settings.fgColor}
                onChange={(v) => update("fgColor", v)}
              />
            ) : null}

            {settings.colorMode === "gradient" ? (
              <div className="row-2">
                <ColorField
                  label="From"
                  value={settings.gradientFrom}
                  onChange={(v) => update("gradientFrom", v)}
                />
                <ColorField
                  label="To"
                  value={settings.gradientTo}
                  onChange={(v) => update("gradientTo", v)}
                />
              </div>
            ) : null}

            {settings.colorMode === "mask" ? (
              <div className="row-2 mask-row">
                <label className="field">
                  <span>Mask image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      onFile(e.target.files?.[0], "maskImageUrl")
                    }
                  />
                </label>
                <label className="check invert-switch">
                  <input
                    type="checkbox"
                    checked={settings.maskInvert}
                    onChange={(e) => update("maskInvert", e.target.checked)}
                  />
                  Invert mask
                </label>
              </div>
            ) : null}
          </div>

          {settings.colorMode === "gradient" ? (
            <div className="control-row row-2">
              <label className="field">
                <span>Gradient type</span>
                <select
                  value={settings.gradientType}
                  onChange={(e) =>
                    update(
                      "gradientType",
                      e.target.value as QrSettings["gradientType"],
                    )
                  }
                >
                  <option value="linear">Linear</option>
                  <option value="radial">Radial</option>
                </select>
              </label>
              <label className="field">
                <span>Rotation {settings.gradientRotation}°</span>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={settings.gradientRotation}
                  onChange={(e) =>
                    update("gradientRotation", Number(e.target.value))
                  }
                />
              </label>
            </div>
          ) : null}

          <div className="control-row">
            <ColorField
              label="Background"
              value={settings.bgColor}
              onChange={(v) => update("bgColor", v)}
            />
          </div>

          <div className="control-row row-2">
            <label className="field">
              <span>
                Size
                <em className="size-hint">{sizePx}px render</em>
              </span>
              <div className="size-row">
                <input
                  type="number"
                  min={settings.sizeUnit === "px" ? 64 : 1}
                  max={settings.sizeUnit === "px" ? 2048 : 100}
                  step={settings.sizeUnit === "rem" ? 0.25 : 1}
                  value={settings.sizeValue}
                  onChange={(e) =>
                    update("sizeValue", Number(e.target.value) || 0)
                  }
                />
                <select
                  value={settings.sizeUnit}
                  aria-label="Size unit"
                  onChange={(e) =>
                    update("sizeUnit", e.target.value as SizeUnit)
                  }
                >
                  {SIZE_UNITS.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </label>
            <label className="field">
              <span>Error correction</span>
              <select
                value={settings.errorCorrectionLevel}
                onChange={(e) =>
                  update(
                    "errorCorrectionLevel",
                    e.target.value as QrSettings["errorCorrectionLevel"],
                  )
                }
              >
                <option value="L">L — 7%</option>
                <option value="M">M — 15%</option>
                <option value="Q">Q — 25%</option>
                <option value="H">H — 30%</option>
              </select>
            </label>
          </div>

          {showStyled ? (
            <div className="control-row">
              <label className="field">
                <span>Center logo (optional)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFile(e.target.files?.[0], "logoUrl")}
                />
              </label>
              {settings.logoUrl ? (
                <label className="field logo-size">
                  <span>Logo size {Math.round(settings.logoSize * 100)}%</span>
                  <input
                    type="range"
                    min={12}
                    max={35}
                    value={Math.round(settings.logoSize * 100)}
                    onChange={(e) =>
                      update("logoSize", Number(e.target.value) / 100)
                    }
                  />
                </label>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="field color-field">
      <span>{label}</span>
      <div className="color-row">
        <input
          type="color"
          value={normalizeHex(value)}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
      </div>
    </label>
  );
}

function normalizeHex(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000";
}

function buildOptions(settings: QrSettings, sizePx: number) {
  const fill =
    settings.colorMode === "gradient"
      ? {
          color: undefined as string | undefined,
          gradient: {
            type: settings.gradientType,
            rotation: (settings.gradientRotation * Math.PI) / 180,
            colorStops: [
              { offset: 0, color: settings.gradientFrom },
              { offset: 1, color: settings.gradientTo },
            ],
          },
        }
      : {
          color: settings.fgColor,
          gradient: undefined,
        };

  return {
    width: sizePx,
    height: sizePx,
    type: "canvas" as const,
    data: settings.data || " ",
    margin: settings.margin,
    qrOptions: {
      errorCorrectionLevel: settings.errorCorrectionLevel,
    },
    dotsOptions: {
      type: settings.dotType,
      ...fill,
    },
    backgroundOptions: {
      color: settings.bgColor,
    },
    cornersSquareOptions: {
      type: settings.cornerSquareType,
      ...fill,
    },
    cornersDotOptions: {
      type: settings.cornerDotType,
      ...fill,
    },
    image: settings.logoUrl || undefined,
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 6,
      imageSize: settings.logoSize,
      hideBackgroundDots: true,
    },
  };
}
