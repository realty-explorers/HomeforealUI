import {
  distanceFormatter,
  percentFormatter,
  priceFormatter,
} from "@/utils/converters";
import { Typography } from "@mui/material";
import { useState } from "react";
import { CompData } from "@/models/analyzedProperty";
import Image from "next/image";
import WcIcon from "@mui/icons-material/Wc";
import BedOutlinedIcon from "@mui/icons-material/BedOutlined";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import clsx from "clsx";

type CompsMapCardProps = {
  property: CompData;
};
const CompsMapCard: React.FC<CompsMapCardProps> = (
  props: CompsMapCardProps,
) => {
  const [cardImage, setCardImage] = useState(
    props.property.primary_image,
  );

  const showDistance = () => {
    try {
      // return distanceFormatter(props.property.distance);
      return distanceFormatter(1);
    } catch (e) {
      console.log(e);
      return 0;
    }
  };

  const getColorClass = (color?: string) => {
    switch (color) {
      case "red":
        return "text-red-500";
      case "orange":
        return "text-orange-500";
      case "yellow":
        return "text-yellow-500";
      case "green":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };
  return (
    <div className="flex rounded-xl bg-white w-80 h-40">
      <div className="w-1/3 h-full relative">
        <Image
          src={cardImage}
          alt={props.property.address}
          onError={() =>
            setCardImage(
              "https://media.istockphoto.com/id/1145840259/vector/home-flat-icon-pixel-perfect-for-mobile-and-web.jpg?s=612x612&w=0&k=20&c=2DWK30S50TbctWwccYw5b-uR6EAksv1n4L_aoatjM9Q=",
            )}
          fill
          className="object-cover object-center w-full h-full rounded-l-xl"
        />
      </div>
      <div className="flex flex-col justify-around w-2/3 px-4 gap-y-2">
        {/* import HotelIcon from '@mui/icons-material/Hotel'; */}
        {/* import BathtubIcon from '@mui/icons-material/Bathtub'; */}
        {/* import SquareFootIcon from '@mui/icons-material/SquareFoot'; */}
        <div className="flex w-full items-center justify-between mt-2">
          <div className="flex">
            <BedOutlinedIcon />
            <Typography>{props.property.bedrooms}</Typography>
          </div>
          <div className="flex">
            <WcIcon />
            <Typography>{props.property.full_bathrooms}</Typography>
          </div>
          <div className="flex">
            <SquareFootIcon />
            <Typography>{props.property.building_area}</Typography>
          </div>
        </div>
        <div className="flex items-center">
          <PinDropOutlinedIcon />
          <Typography className="text-[0.7rem] ml-2 font-poppins">
            {props.property.address.substring(
              0,
              props.property.address.indexOf(","),
            )}
            {props.property.neighborhood !== "N/A" &&
              props.property.neighborhood}, {props.property.zipcode}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <Typography className="font-poppins font-bold">
            {priceFormatter(props.property.sales_closing_price)} Sold Price
          </Typography>
        </div>

        <div className="flex items-center justify-between">
          <Typography
            className={clsx([
              "font-poppins font-bold",
              getColorClass(props.property.similarity_color),
            ])}
          >
            {props.property.similarity_score * 100}% Similarity
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default CompsMapCard;
