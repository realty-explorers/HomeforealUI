// Programmatic marker pill, registered with the Mapbox style as an
// image so the symbol layer's icon-text-fit can stretch it around the
// property label. Drawn at 2x for crisp rendering on retina maps with
// a stretchX zone so the rounded caps stay circular while only the
// middle band grows with the label.

import type { Map as MapboxMap } from 'mapbox-gl';

export const PILL_IMAGE_ID = 'marker-pill';

const PILL_BG = '#0f172a'; // slate-900 — looks pure black on the map

// Native display dimensions. Height drives the cap radius. Kept very
// tight so short labels don't get visual gaps between the text and the
// rounded ends; the middle band stretches for longer labels.
const PILL_HEIGHT = 12;
const PILL_WIDTH = 18;
const PIXEL_RATIO = 2;

const drawPill = (bgColor: string): HTMLCanvasElement | null => {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = PILL_WIDTH * PIXEL_RATIO;
  canvas.height = PILL_HEIGHT * PIXEL_RATIO;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.scale(PIXEL_RATIO, PIXEL_RATIO);
  ctx.clearRect(0, 0, PILL_WIDTH, PILL_HEIGHT);

  const radius = PILL_HEIGHT / 2;
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(PILL_WIDTH - radius, 0);
  ctx.arc(PILL_WIDTH - radius, radius, radius, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(radius, PILL_HEIGHT);
  ctx.arc(radius, radius, radius, Math.PI / 2, -Math.PI / 2);
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

  const capRaw = (PILL_HEIGHT / 2) * PIXEL_RATIO;
  const widthRaw = PILL_WIDTH * PIXEL_RATIO;
  const heightRaw = PILL_HEIGHT * PIXEL_RATIO;

  try {
    map.addImage(
      PILL_IMAGE_ID,
      imageData,
      {
        pixelRatio: PIXEL_RATIO,
        // Stretch the middle band only so the rounded caps stay
        // pixel-perfect at any label length.
        stretchX: [[capRaw, widthRaw - capRaw]],
        content: [capRaw, 0, widthRaw - capRaw, heightRaw]
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
