import { Button, Typography } from '@mui/material';
import styles from './ButtonStyles.module.scss';

type ThemedButtonProps = {
  text: string;
} & React.ComponentProps<typeof Button>;
const ThemedButton = (props: ThemedButtonProps) => {
  return (
    <Button {...props} className={styles.button}>
      <Typography className={styles.buttonText}>{props.text}</Typography>
    </Button>
  );
};

export default ThemedButton;
