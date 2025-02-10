import {
  distanceFormatter,
  percentFormatter,
  priceFormatter
} from '@/utils/converters';
import { Typography } from '@mui/material';
import { useState } from 'react';
import { CompData } from '@/models/analyzedProperty';
import Image from '@/components/Photos/Image';
import WcIcon from '@mui/icons-material/Wc';
import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import StraightenIcon from '@mui/icons-material/Straighten';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import TodayIcon from '@mui/icons-material/Today';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import clsx from 'clsx';
import { readableDateDiff } from '@/utils/dateUtils';

const defaultImage =
  'https://media.istockphoto.com/id/1145840259/vector/home-flat-icon-pixel-perfect-for-mobile-and-web.jpg?s=612x612&w=0&k=20&c=2DWK30S50TbctWwccYw5b-uR6EAksv1n4L_aoatjM9Q=';

type CompsMapCardProps = {
  property: CompData;
};
const CompsMapCard: React.FC<CompsMapCardProps> = (
  props: CompsMapCardProps
) => {
  const [cardImage, setCardImage] = useState(props.property.primary_image);

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
      case 'red':
        return 'text-red-500';
      case 'orange':
        return 'text-orange-500';
      case 'yellow':
        return 'text-yellow-500';
      case 'green':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const stats = `${props.property?.beds} Beds ● ${props.property?.baths} Baths ● ${props.property?.area} Sqft`;

  const locationStats = `${props.property.distance.toFixed(
    2
  )} Miles ● ${readableDateDiff(props.property.list_date)}`;

  return (
    <div className="flex rounded-xl bg-white w-80 h-40">
      <div className="w-1/3 h-full relative">
        {/* <Image */}
        {/*   src={cardImage} */}
        {/*   alt={props.property.address} */}
        {/*   onError={() => */}
        {/*     setCardImage( */}
        {/*       "https://media.istockphoto.com/id/1145840259/vector/home-flat-icon-pixel-perfect-for-mobile-and-web.jpg?s=612x612&w=0&k=20&c=2DWK30S50TbctWwccYw5b-uR6EAksv1n4L_aoatjM9Q=", */}
        {/*     )} */}
        {/*   fill */}
        {/*   className="object-cover object-center w-full h-full rounded-l-xl" */}
        {/* /> */}
        <Image
          src={cardImage}
          defaultSrc={defaultImage}
          alt={props.property?.location.address}
          className="object-cover object-center w-full h-full rounded-l-xl"
        />

        {/* <img */}
        {/*   src={cardImage} */}
        {/*   className="w-full h-full rounded-l-xl object-cover object-center" */}
        {/* /> */}
      </div>
      <div className="flex flex-col  w-2/3 px-4 gap-y-0">
        {/* import HotelIcon from '@mui/icons-material/Hotel'; */}
        {/* import BathtubIcon from '@mui/icons-material/Bathtub'; */}
        {/* import SquareFootIcon from '@mui/icons-material/SquareFoot'; */}
        <div className="flex w-full items-center justify-between mt-2">
          <Typography className="font-poppins font-semibold text-xs">
            {stats}
          </Typography>
        </div>
        <div className="flex items-center mt-2 w-full ">
          <PinDropOutlinedIcon fontSize="small" />
          <div className="flex flex-col w-full truncate">
            <Typography className="text-xs ml-2 font-poppins ">
              {props.property?.location.address}
            </Typography>
            <Typography className="text-xs ml-2 font-poppins"></Typography>
          </div>
        </div>

        <div className="flex items-center mt-2 w-full gap-x-2 ">
          <div className="flex items-center">
            {/* <StraightenIcon fontSize="small" /> */}
            <SettingsEthernetIcon fontSize="small" />
            <Typography className="text-xs ml-1 font-poppins text-center">
              {locationStats}
            </Typography>
          </div>

          {/* <div className="flex items-center"> */}
          {/*   <TodayIcon fontSize="small" /> */}
          {/*   <Typography className="text-xs ml-1 font-poppins text-center"> */}
          {/*     3 Days Old */}
          {/*   </Typography> */}
          {/* </div> */}
        </div>

        <div className="flex items-center mt-2 w-full">
          <LocalOfferOutlinedIcon fontSize="small" />
          <Typography className="text-xs ml-2 font-poppins text-center">
            {priceFormatter(props.property?.price)}
          </Typography>
        </div>

        <div className="flex items-center mt-2 w-full">
          <AssessmentOutlinedIcon fontSize="small" />

          <Typography
            className={clsx([
              'font-poppins ml-2 font-bold',
              getColorClass(props.property.similarity_color)
            ])}
          >
            {Math.round(props.property.similarity_score * 100)}% Similarity
          </Typography>
        </div>
        {props.property.is_arv_25th && (
          <div className="absolute bottom-1 right-1 bg-arv text-white font-poppins text-[0.7rem] px-2 rounded-lg font-semibold">
            25th ARV
          </div>
        )}
      </div>
    </div>
  );
};

export default CompsMapCard;
