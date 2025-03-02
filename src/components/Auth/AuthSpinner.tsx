import { useEffect, useState } from 'react';

interface CustomSpinnerProps {
  size?: number;
  color?: string;
  thickness?: number;
}

const CustomSpinner = ({
  size = 48,
  color = 'currentColor',
  thickness = 3
}: CustomSpinnerProps) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      setRotation((prev) => (prev + deltaTime / 10) % 360);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      style={{ transform: `rotate(${rotation}deg)` }}
      className="transition-transform"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        className="spinner-circle"
        opacity="0.3"
      />
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeDasharray="60 40"
      />
    </svg>
  );
};

export default CustomSpinner;
