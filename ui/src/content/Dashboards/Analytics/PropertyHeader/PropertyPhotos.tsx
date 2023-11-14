import ThemedButton from "@/components/Buttons/ThemedButton";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import clsx from "clsx";
import { validateValue } from "@/utils/converters";
import Image from "@/components/Photos/Image";

const defaultImage =
  "https://media.istockphoto.com/id/1145840259/vector/home-flat-icon-pixel-perfect-for-mobile-and-web.jpg?s=612x612&w=0&k=20&c=2DWK30S50TbctWwccYw5b-uR6EAksv1n4L_aoatjM9Q=";

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
          "grid grid-cols-[2fr_1fr] grid-rows-2 w-full h-[30vh] gap-1 p-2 mt-4",
          props.photos.length == 0 ? "hidden" : "",
        ])}
      >
        <div
          className={clsx([
            "row-span-2 flex items-center justify-center cursor-pointer overflow-hidden rounded-lg",
            props.photos.length == 1 ? "col-span-2" : "col-span-1",
          ])}
        >
          <Image
            src={validateValue(props.photos[0], "string", "")}
            alt=""
            className="rounded-lg zoom-effect"
            onClick={() => setOpen(!open)}
            defaultSrc={defaultImage}
          />
          {/* <img */}
          {/*   src={props.photos[0] || ""} */}
          {/*   className="w-full h-full rounded object-cover" */}
          {/*   onClick={() => setOpen(!open)} */}
          {/* /> */}
          {/* <Image src={props.photos[0]} /> */}
        </div>
        <div
          className={clsx([
            "h-full justify-center items-center cursor-pointer overflow-hidden rounded-lg",
            props.photos.length < 2 ? "hidden" : "xl:flex",
            props.photos.length == 2
              ? "row-span-2"
              : "row-span-2 xl:row-span-1",
          ])}
        >
          {/* <img */}
          {/*   src={props.photos[1] || ""} */}
          {/*   className="w-full h-full rounded object-cover" */}
          {/*   onClick={() => setOpen(!open)} */}
          {/* /> */}

          <Image
            src={validateValue(props.photos[1], "string", "")}
            className="rounded-lg zoom-effect"
            alt=""
            onClick={() => setOpen(!open)}
            defaultSrc={defaultImage}
          />
          {/* <Image src={props.photos[1]} /> */}
        </div>
        <div
          className={clsx([
            "h-full justify-center items-center cursor-pointer relative overflow-hidden rounded-lg",
            props.photos.length < 3 ? "hidden" : "hidden xl:flex",
          ])}
        >
          <Image
            src={validateValue(props.photos[2], "string", "")}
            className="rounded-lg zoom-effect"
            alt=""
            onClick={() => setOpen(!open)}
            defaultSrc={defaultImage}
          />
          {props.photos.length > 3 && (
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
          )}
        </div>
      </div>

      <Lightbox
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, .8)" } }}
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        plugins={[Fullscreen, Slideshow, Thumbnails]}
      />
    </>
  );
};

export default PropertyPhotos;
