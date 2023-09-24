import ThemedButton from "@/components/Buttons/ThemedButton";
import Property from "@/models/property";
import { Box, Grid } from "@mui/material";

const Image = (props: any) => {
  const defaultImage =
    "https://media.istockphoto.com/id/1145840259/vector/home-flat-icon-pixel-perfect-for-mobile-and-web.jpg?s=612x612&w=0&k=20&c=2DWK30S50TbctWwccYw5b-uR6EAksv1n4L_aoatjM9Q=";
  return (
    <Box
      {...props}
      width="100%"
      height="100%"
      borderRadius="0.5rem"
      component="img"
      alt="The house from the offer."
      src={props.src || defaultImage}
    />
  );
};

const ViewMore = () => {
  return (
    <div style={{ position: "relative", height: "100%", width: "100%   " }}>
      <Image sx={{ opacity: "0.5" }} />
      <ThemedButton
        text="See More"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
};

type PropertyPhotosProps = {
  photos: string[];
};
const PropertyPhotos = (props: PropertyPhotosProps) => {
  return (
    <>
      <div className="flex w-full h-80">
        <div className="flex w-full lg:w-3/5 m-4">
          <Image src={props.photos[0]} />
        </div>
        <div className="lg:flex flex-col hidden w-2/5 m-4">
          <div className="flex h-1/2 pb-2">
            <Image src={props.photos[1]} />
          </div>
          <div className="flex h-1/2 pt-2">
            <ViewMore />
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyPhotos;
