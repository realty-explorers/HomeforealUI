import { CircularProgress } from "@mui/material";

type LoadingSpinnerProps = {
  loading: boolean;
};
const LoadingSpinner = ({ loading }: LoadingSpinnerProps) => {
  return loading && <CircularProgress className="absolute top-2 right-2" />;
};

export default LoadingSpinner;
