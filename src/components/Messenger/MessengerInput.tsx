import React, { useRef } from "react";
import { Button, TextArea } from "../index";
import {
  faGear,
  faMicrophone,
  faPaperPlane,
  faStop,
  faVolumeHigh,
  faVolumeMute,
  faImage as faImageIcon,
} from "@fortawesome/free-solid-svg-icons";

// ---------- Image helpers ----------

// Nutze createImageBitmap wenn verfügbar (korrekte EXIF-Orientierung)
async function decodeImage(file: File): Promise<{ bmp: ImageBitmap; w: number; h: number }> {
  if ("createImageBitmap" in window) {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" as any });
    return { bmp, w: bmp.width, h: bmp.height };
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    });
    const bmp = await createImageBitmap(img);
    return { bmp, w: img.naturalWidth, h: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function roundTo8(n: number) {
  const x = Math.max(1, Math.floor(n));
  return x - (x % 8);
}

type ResizeOpts = {
  maxSide?: number; // max. lange Kante (px)
  maxBytes?: number; // Zielgröße (Bytes; Best-Effort)
  prefer?: "jpeg" | "png" | "webp";
  quality?: number; // 0..1
};

// Re-encode: proportional skalieren, Vielfache von 8, Base64 **raw** zurückgeben
export async function fileToBase64Raw(file: File, opts: ResizeOpts = {}): Promise<string> {
  const { maxSide = 1536, maxBytes = 4_500_000, prefer = "jpeg", quality = 0.9 } = opts;

  if (/image\/(heic|heif)/i.test(file.type)) {
    throw new Error("HEIC/HEIF wird vom Browser nicht unterstützt. Bitte als JPG/PNG/WebP hochladen.");
  }

  const { bmp, w, h } = await decodeImage(file);

  // proportionaler Scale-Faktor
  const side = Math.max(w, h);
  let scale = side > maxSide ? maxSide / side : 1;

  // Größen-Annäherung (Dateien skalieren ~quadratisch)
  const approxScaleBytes = Math.sqrt(maxBytes / Math.max(1, file.size));
  if (approxScaleBytes < 1) scale = Math.min(scale, approxScaleBytes);

  const tw = Math.max(8, roundTo8(w * scale));
  const th = Math.max(8, roundTo8(h * scale));

  const canvas = document.createElement("canvas");
  canvas.width = tw;
  canvas.height = th;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) throw new Error("Canvas 2D Context not available");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bmp, 0, 0, tw, th);

  // Formatwahl: PNG behalten, wenn Quelle PNG mit echter Transparenz ist
  let mime: string = `image/${prefer}`;
  if (/image\/png/i.test(file.type)) {
    const sample = ctx.getImageData(0, 0, Math.min(16, tw), Math.min(16, th)).data;
    let hasAlpha = false;
    for (let i = 3; i < sample.length; i += 4) {
      if (sample[i] !== 255) {
        hasAlpha = true;
        break;
      }
    }
    mime = hasAlpha ? "image/png" : mime;
  }
  // WebP-Fallback
  if (mime === "image/webp" && !HTMLCanvasElement.prototype.toDataURL.call(canvas, "image/webp").startsWith("data:image/webp")) {
    mime = "image/jpeg";
  }

  let q = quality;
  let dataUrl = canvas.toDataURL(mime, q);
  let raw = dataUrl.replace(/^data:.*;base64,/, "");

  // ggf. stärker komprimieren
  while (raw.length * 0.75 > maxBytes) {
    if (mime !== "image/jpeg" && mime !== "image/webp") {
      mime = "image/jpeg";
      q = 0.85;
    } else {
      q = Math.max(0.5, q - 0.1);
    }
    dataUrl = canvas.toDataURL(mime, q);
    raw = dataUrl.replace(/^data:.*;base64,/, "");
    if (q <= 0.5) break;
  }

  bmp.close?.();
  return raw;
}

// errät MIME aus Base64-Header
function guessMimeFromRaw(b64: string): "image/png" | "image/jpeg" | "image/webp" | "image/*" {
  if (!b64) return "image/*";
  if (b64.startsWith("iVBORw0KGgo")) return "image/png"; // PNG
  if (b64.startsWith("/9j/")) return "image/jpeg"; // JPEG
  if (b64.startsWith("UklGR")) return "image/webp"; // WebP
  return "image/jpeg";
}

function toDataUrl(b64?: string | null) {
  if (!b64) return "";
  const mime = guessMimeFromRaw(b64);
  return `data:${mime};base64,${b64}`;
}

// ---------- Component ----------

type MessengerInputProps = {
  input: string;
  setInput: (v: string) => void;
  inputPlaceholder: string;
  isLoading: boolean;
  enableSTT: boolean;
  enableTTS: boolean;
  recording: boolean;
  ttsMuted: boolean;
  setTtsMuted: (f: (v: boolean) => boolean) => void;
  onToggleRecord: () => void;
  onToggleSettings: () => void;
  onSend: () => void;
  childrenButtons?: React.ReactNode;
  labelSendButton?: string;
  settingsOpen: boolean;
  isLightColor?: boolean;
  image?: string | null; // Base64 **raw**
  setImage: (b64: string | null) => void;
};

export function MessengerInput({
  input,
  setInput,
  inputPlaceholder,
  isLoading,
  enableSTT,
  enableTTS,
  recording,
  ttsMuted,
  setTtsMuted,
  onToggleRecord,
  onToggleSettings,
  onSend,
  childrenButtons,
  labelSendButton = "Send",
  settingsOpen,
  isLightColor,
  image,
  setImage,
}: MessengerInputProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handlePick = () => fileRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const raw = await fileToBase64Raw(f, {
        maxSide: 1536,
        maxBytes: 4_500_000,
        prefer: "jpeg",
        quality: 0.9,
      });
      setImage(raw); // raw ohne Prefix → passt zu Backend
    } catch (err: any) {
      console.error("Bild konnte nicht verarbeitet werden:", err?.message || err);
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleClearImage = () => setImage(null);
  const previewUrl = toDataUrl(image);

  return (
    <div className="input-area">
      <div className="input-function" style={{ display: "flex", alignItems: "center", gap: ".35rem" }}>
        {childrenButtons}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Button
          isLightColor={isLightColor}
          icon={faImageIcon}
          onClick={handlePick}
          disabled={isLoading}
          tooltip="Bild anhängen"
        />

        <Button
          isLightColor={isLightColor}
          icon={recording ? faStop : faMicrophone}
          onClick={onToggleRecord}
          disabled={isLoading || !enableSTT}
        />
        {enableTTS && (
          <Button
            isLightColor={isLightColor}
            icon={ttsMuted ? faVolumeMute : faVolumeHigh}
            onClick={() => setTtsMuted((v) => !v)}
          />
        )}

        {image && (
          <div
            style={{
              position: "relative",
              width: 28,
              height: 28,
              borderRadius: 6,
              overflow: "hidden",
              display: "inline-flex",
              marginLeft: ".25rem",
              boxShadow: "0 0 0 1px rgba(255,255,255,.1) inset",
            }}
            title="Angehängtes Bild"
          >
            <img src={previewUrl} alt="attached" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <button
              type="button"
              onClick={handleClearImage}
              aria-label="Bild entfernen"
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                background: "rgba(0,0,0,.6)",
                color: "#fff",
                padding: 0,
              }}
            >
              <span style={{ fontSize: 12, lineHeight: 1 }}>×</span>
            </button>
          </div>
        )}
      </div>

      <div className="input-chat-mode">
        <Button icon={faGear} color="info" isLightColor={isLightColor} expander expanderValue={settingsOpen} onClick={onToggleSettings} />
        <TextArea label={inputPlaceholder} value={input} onChange={setInput} rows={2} />
        <Button
          icon={faPaperPlane}
          color="success"
          text={labelSendButton}
          isLightColor={isLightColor}
          isLoading={isLoading}
          onClick={onSend}
          disabled={isLoading}
          fontSize="0.8rem"
        />
      </div>
    </div>
  );
}
