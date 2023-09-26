import ThemedButton from "@/components/Buttons/ThemedButton";
import Property from "@/models/property";
import { Box, Button, Dialog, Grid, Typography } from "@mui/material";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import clsx from "clsx";

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

const images = [
  {
    src:
      "https://timellenberger.com/static/blog-content/dark-mode/win10-dark-mode.jpg",
  },
  {
    src:
      "https://timellenberger.com/static/blog-content/dark-mode/macos-dark-mode.png",
  },
  {
    src:
      "https://timellenberger.com/static/blog-content/dark-mode/android-9-dark-mode.jpg",
  },
];

type PropertyPhotosProps = {
  photos: string[];
};
const PropertyPhotos = (props: PropertyPhotosProps) => {
  const [open, setOpen] = useState(false);
  const slides = props.photos?.map((image) => {
    return {
      src: image,
    };
  });

  return (
    <>
      <div
        className={clsx([
          "grid grid-cols-[1.5fr_1fr] grid-rows-2 w-full h-80 gap-4 p-4",
          props.photos.length == 0 ? "hidden" : "",
        ])}
      >
        <div
          className={clsx([
            "row-span-2 flex items-center justify-center",
            props.photos.length == 1 ? "col-span-2" : "",
          ])}
        >
          <img src={props.photos[0]} className="w-full h-full rounded" />
          {/* <Image src={props.photos[0]} /> */}
        </div>
        <div
          className={clsx([
            "flex h-full justify-center items-center ",
            props.photos.length < 2 ? "hidden" : "",
            props.photos.length == 2 ? "row-span-2" : "",
          ])}
        >
          <img src={props.photos[0]} className="w-full h-full rounded" />
          {/* <Image src={props.photos[1]} /> */}
        </div>
        <div
          className={clsx([
            "flex h-full justify-center items-center relative",
            props.photos.length < 3 ? "hidden" : "",
          ])}
        >
          <img src={props.photos[0]} className="w-full h-full rounded" />
          <ThemedButton
            onClick={() => setOpen(!open)}
            text="See More"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
      />
    </>
  );
};

export default PropertyPhotos;
