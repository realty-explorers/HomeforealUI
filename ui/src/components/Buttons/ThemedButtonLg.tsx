import { Button, Typography } from '@mui/material';
import styles from './ButtonStyles.module.scss';

type ThemedButtonLgProps = {
    text: string;
} & React.ComponentProps<typeof Button>;
const ThemedButtonLg = (props: ThemedButtonLgProps) => {
    return (
        <Button {...props} className={styles.buttonLg}>
            <Typography className={styles.buttonTextLg}>{props.text}</Typography>
        </Button>
    );
};

export default ThemedButtonLg;