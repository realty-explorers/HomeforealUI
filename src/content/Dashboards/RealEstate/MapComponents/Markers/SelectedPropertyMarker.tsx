import PropertyPreview from '@/models/propertyPreview';
import { Marker, Source, Layer } from 'react-map-gl';
import { useMemo } from 'react';
import { circle } from '@turf/turf';

type SelectedPropertyMarkerProps = {
  selectedProperty?: PropertyPreview;
  onClick: (property: PropertyPreview) => void;
};

const SelectedPropertyMarker = ({
  selectedProperty,
  onClick
}: SelectedPropertyMarkerProps) => {
  const circleData = useMemo(() => {
    const center = [
      selectedProperty?.coordinates[0] || 0,
      selectedProperty?.coordinates[1] || 0
    ];
    const myCircle = circle(center, 1, {
      steps: 64,
      units: 'miles',
      properties: { foo: 'bar' }
    });
    return myCircle;
  }, [selectedProperty]);
  return (
    selectedProperty &&
    (selectedProperty.masked ? (
      <Source id="circle-source" type="geojson" data={circleData}>
        <Layer
          id="circle-layer"
          type="fill"
          paint={{
            'fill-color': 'rgba(79, 136, 255, 0.4)',
            'fill-opacity': 0.7,
            'fill-outline-color': 'rgb(79, 136, 255)'
          }}
        />
        <Layer
          id="circle-outline-layer"
          type="line"
          source="circle-source"
          paint={{
            'line-color': 'rgb(79, 136, 255)',
            'line-width': 2,
            'line-dasharray': [4, 2]
          }}
        />
      </Source>
    ) : (
      <Marker
        longitude={selectedProperty.coordinates[0]}
        latitude={selectedProperty.coordinates[1]}
        anchor="bottom"
        onClick={() => onClick(selectedProperty)}
        style={{ cursor: 'pointer' }}
      >
        <TargetPin />
      </Marker>
    ))
  );
};

const TargetPin = () => (
  <div className="target-pin">
    <span className="target-pin__pulse target-pin__pulse--1" />
    <span className="target-pin__pulse target-pin__pulse--2" />
    <svg
      className="target-pin__svg"
      width={36}
      height={45}
      viewBox="0 0 56 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="targetPinBody" x1="28" y1="4" x2="28" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1e293b" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <radialGradient id="targetPinGlow" cx="0.5" cy="0.42" r="0.55">
          <stop offset="0" stopColor="#60a5fa" stopOpacity="0.55" />
          <stop offset="1" stopColor="#60a5fa" stopOpacity="0" />
        </radialGradient>
        <filter id="targetPinShadow" x="-30%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* outer glow halo */}
      <ellipse cx="28" cy="26" rx="24" ry="24" fill="url(#targetPinGlow)" />

      {/* teardrop pin */}
      <g filter="url(#targetPinShadow)">
        <path
          d="M28 4
             C 14.7 4 4 14.5 4 27.5
             C 4 41.3 16.8 53.5 26.3 64.7
             C 27.2 65.7 28.8 65.7 29.7 64.7
             C 39.2 53.5 52 41.3 52 27.5
             C 52 14.5 41.3 4 28 4 Z"
          fill="url(#targetPinBody)"
          stroke="#60a5fa"
          strokeWidth="1.5"
        />
        {/* inner accent ring */}
        <circle cx="28" cy="27" r="15" fill="none" stroke="rgba(96,165,250,0.35)" strokeWidth="1" />
        {/* crosshair ticks */}
        <g stroke="#60a5fa" strokeWidth="1.25" strokeLinecap="round" opacity="0.85">
          <line x1="28" y1="11.5" x2="28" y2="14.5" />
          <line x1="28" y1="39.5" x2="28" y2="42.5" />
          <line x1="11.5" y1="27" x2="14.5" y2="27" />
          <line x1="41.5" y1="27" x2="44.5" y2="27" />
        </g>
        {/* home glyph */}
        <g transform="translate(28 27)">
          <path
            d="M-7 1 L0 -6 L7 1 L7 7 C7 7.6 6.6 8 6 8 L-6 8 C-6.6 8 -7 7.6 -7 7 Z"
            fill="#ffffff"
          />
          <rect x="-2" y="2" width="4" height="6" fill="#0f172a" rx="0.5" />
        </g>
      </g>
    </svg>
    <style>{`
      .target-pin {
        position: relative;
        width: 36px;
        height: 45px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        pointer-events: none;
      }
      .target-pin__svg {
        position: relative;
        z-index: 2;
        animation: target-pin-drop 380ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
        pointer-events: auto;
        transform-origin: 50% 100%;
      }
      .target-pin__svg:hover {
        filter: brightness(1.08);
      }
      .target-pin__pulse {
        position: absolute;
        left: 50%;
        bottom: 8px;
        width: 28px;
        height: 28px;
        margin-left: -14px;
        border-radius: 9999px;
        border: 1.5px solid rgba(96, 165, 250, 0.6);
        background: rgba(96, 165, 250, 0.18);
        transform: scale(0.45);
        opacity: 0;
        z-index: 1;
        animation: target-pin-pulse 1.9s ease-out infinite;
      }
      .target-pin__pulse--2 {
        animation-delay: 0.95s;
      }
      @keyframes target-pin-pulse {
        0%   { transform: scale(0.45); opacity: 0.85; }
        80%  { transform: scale(1.9);  opacity: 0; }
        100% { transform: scale(1.9);  opacity: 0; }
      }
      @keyframes target-pin-drop {
        0%   { transform: translateY(-18px) scale(0.6); opacity: 0; }
        60%  { transform: translateY(2px)  scale(1.05); opacity: 1; }
        100% { transform: translateY(0)    scale(1);    opacity: 1; }
      }
    `}</style>
  </div>
);

export default SelectedPropertyMarker;
