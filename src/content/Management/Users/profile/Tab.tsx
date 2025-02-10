import { Typography } from "@mui/material";
import clsx from "clsx";
import { ReactNode } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type TabProps = {
  icon: ReactNode;
  title: string;
  selected: boolean;
  setSelected: () => void;
};
const Tab = ({ title, icon, selected, setSelected }: TabProps) => {
  return (
    <button
      className={clsx([
        "flex w-full p-4 my-2 gap-x-4 rounded-lg text-left",
        selected && "text-[#9747FF] bg-[#F5F6FA]",
      ])}
      onClick={setSelected}
    >
      {icon}
      <Typography
        className={clsx(["grow font-poppins text-lg capitalize font-semibold"])}
      >
        {title}
      </Typography>
      <ArrowForwardIosIcon />
    </button>
  );
};

export default Tab;
