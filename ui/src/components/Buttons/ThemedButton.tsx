import { Button, Typography } from "@mui/material";
import styles from "./ButtonStyles.module.scss";

type ThemedButtonProps = {
  text: string;
} & React.ComponentProps<typeof Button>;
const ThemedButton = (props: ThemedButtonProps) => {
  return (
    <Button
      {...props}
      className=" bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80  rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
    >
      <Typography className="text-white font-poppins">
        {props.text}
      </Typography>
    </Button>
  );
};

export default ThemedButton;
