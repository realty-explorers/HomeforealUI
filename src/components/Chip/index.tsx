type ChipProps = {
  label: string;
  background: string;
  color: string;
};
const Chip = ({
  label,
  background,
  color,
}: ChipProps) => {
  return (
    <span
      style={{ backgroundColor: background, color: color }}
      className="rounded-xl px-2 text-[0.7rem] mx-1"
    >
      {label}
    </span>
  );
};

export default Chip;
