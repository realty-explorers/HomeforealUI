// Programmatic marker pill, registered with the Mapbox style as an
// image so the symbol layer's icon-text-fit can stretch it around the
// property label. Drawn at 2x for crisp rendering on retina maps.
//
// The image has two zones:
//   1. A rounded pill body that grows horizontally to fit the label.
//      Only the bands *between* the rounded caps and the centered
//      arrow tail stretch — caps and arrow stay pixel-perfect.
//   2. A downward arrow tail below the pill that points at the
//      property's geographic coordinate.

import type { Map as MapboxMap } from 'mapbox-gl';

export const PILL_IMAGE_ID = 'marker-pill';

const PILL_BG = '#0f172a'; // slate-900 — looks pure black on the map

// Native display dimensions. Height drives the cap radius and provides
// vertical breathing room around the text. Width is the minimum
// cap-to-cap span; the bands either side of the arrow stretch for
// longer labels.
const PILL_HEIGHT = 17;
const PILL_WIDTH = 28;
const ARROW_HEIGHT = 6;
const ARROW_HALF_WIDTH = 4;
const PIXEL_RATIO = 2;

const drawPill = (bgColor: string): HTMLCanvasElement | null => {
  if (typeof document === 'undefined') return null;

  const totalHeight = PILL_HEIGHT + ARROW_HEIGHT;
  const canvas = document.createElement('canvas');
  canvas.width = PILL_WIDTH * PIXEL_RATIO;
  canvas.height = totalHeight * PIXEL_RATIO;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.scale(PIXEL_RATIO, PIXEL_RATIO);
  ctx.clearRect(0, 0, PILL_WIDTH, totalHeight);

  const radius = PILL_HEIGHT / 2;
  ctx.fillStyle = bgColor;

  // Rounded pill body
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(PILL_WIDTH - radius, 0);
  ctx.arc(PILL_WIDTH - radius, radius, radius, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(radius, PILL_HEIGHT);
  ctx.arc(radius, radius, radius, Math.PI / 2, -Math.PI / 2);
  ctx.closePath();
  ctx.fill();

  // Down arrow tail. Overlap the pill base by ~0.5px to avoid a hairline
  // seam from antialiasing where the triangle meets the rectangle.
  const cx = PILL_WIDTH / 2;
  ctx.beginPath();
  ctx.moveTo(cx - ARROW_HALF_WIDTH, PILL_HEIGHT - 0.5);
  ctx.lineTo(cx + ARROW_HALF_WIDTH, PILL_HEIGHT - 0.5);
  ctx.lineTo(cx, PILL_HEIGHT + ARROW_HEIGHT);
  ctx.closePath();
  ctx.fill();

  return canvas;
};

export const registerPillImages = (map: MapboxMap | undefined) => {
  if (!map) return;
  if (map.hasImage(PILL_IMAGE_ID)) return;

  const canvas = drawPill(PILL_BG);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Source-pixel coordinates (canvas is drawn at PIXEL_RATIO scale).
  const capRaw = (PILL_HEIGHT / 2) * PIXEL_RATIO;
  const widthRaw = PILL_WIDTH * PIXEL_RATIO;
  const pillBodyHeightRaw = PILL_HEIGHT * PIXEL_RATIO;
  const centerRaw = (PILL_WIDTH / 2) * PIXEL_RATIO;
  const arrowHalfRaw = ARROW_HALF_WIDTH * PIXEL_RATIO;

  try {
    map.addImage(
      PILL_IMAGE_ID,
      imageData,
      {
        pixelRatio: PIXEL_RATIO,
        // Two stretch zones — left of arrow and right of arrow — so
        // the rounded caps and the centered arrow stay fixed in size
        // while the bands between them grow with longer labels.
        stretchX: [
          [capRaw, centerRaw - arrowHalfRaw],
          [centerRaw + arrowHalfRaw, widthRaw - capRaw]
        ],
        // Don't stretch vertically — fixes the arrow height regardless
        // of how icon-text-fit interprets the vertical axis.
        stretchY: [[0, pillBodyHeightRaw]],
        // Text must sit inside the pill body only — never over the
        // arrow tail.
        content: [capRaw, 0, widthRaw - capRaw, pillBodyHeightRaw]
      } as any
    );
  } catch {
    try {
      map.addImage(PILL_IMAGE_ID, imageData, { pixelRatio: PIXEL_RATIO });
    } catch {
      // give up silently — layer will render text only
    }
  }
};
