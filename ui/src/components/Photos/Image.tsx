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
  const [loading, setLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);
  const [lock, setLock] = useState(true);

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
    setLock(false);
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
            {/* <Lottie */}
            {/*   animationData={mapLoadingAnimation} */}
            {/*   className="h-full aspect-square z-[3]" */}
            {/* /> */}
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
