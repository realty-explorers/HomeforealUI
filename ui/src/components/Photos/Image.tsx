import { Box } from '@mui/material';

const Image = (props: any) => {
  return (
    <Box
      {...props}
      width="100%"
      height="100%"
      borderRadius="0.5rem"
      component="img"
      alt="The house from the offer."
      src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
    />
  );
};

export default Image;
