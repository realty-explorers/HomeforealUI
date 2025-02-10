import {
  memo,
  ReactEventHandler,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
// import Lottie from "lottie-react";
import mapLoadingAnimation from "@/static/animations/loading/mapLoadingAnimation.json";
import clsx from "clsx";
import Lottie from "lottie-react";
import { Skeleton } from "@mui/material";

type ImageProps = {
  src: string;
  alt: string;
  defaultSrc?: string;
  className?: string;
  overrideStyles?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>;
const Image = (
  { src, alt, defaultSrc, className, overrideStyles, ...imgProps }: ImageProps,
) => {
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const handleError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    setImgSrc(defaultSrc || "");
    setLoading(false);
  };

  const handleStartLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    setLoading(true);
  };

  const handleEndLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    setLoading(false);
  };

  return (
    <div className="relative w-full h-full">
      {loading &&
        (
          <div
            className={clsx([
              "w-full h-full  justify-center items-center",
              !loading ? "hidden" : "flex",
            ])}
          >
            <Skeleton variant="rectangular" width="100%" height="100%" />
          </div>
        )}

      <img
        {...imgProps}
        src={imgSrc}
        alt={alt}
        className={clsx(
          "w-full h-full  object-cover object-center transition-opacity duration-1000 delay-100",
          className,
          loading ? "opacity-0 hidden" : "opacity-100",
        )}
        onLoadedData={handleEndLoad}
        onLoadStart={handleStartLoad}
        onError={handleError}
        onLoad={handleEndLoad}
      />
    </div>
  );
};

export default Image;
