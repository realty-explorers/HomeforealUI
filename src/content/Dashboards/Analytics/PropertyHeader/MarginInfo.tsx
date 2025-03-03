import { selectProperties } from '@/store/slices/propertiesSlice';
import { priceFormatter } from '@/utils/converters';
import { Tooltip, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import styles from './PropertyHeaderStyles.module.scss';
import clsx from 'clsx';
import CountUp from 'react-countup';
import {
  calculateArvPercentage,
  calculateMarginPercentage
} from '@/utils/calculationUtils';
import { selectExpenses } from '@/store/slices/expensesSlice';

//bg-green-200
//bg-purple-200
//bg-green-500
//bg-purple-500
//bg-green-600
//bg-purple-600
const MarginInfoChips = ({ amount, percent, margin, color, name }) => {
  return (
    <div className="flex justify-center sm:ml-12 w-full sm:w-auto">
      <div
        className={clsx([
          'rounded-lg flex flex-col items-center py-2  pr-12 pl-4 grow xs:grow-0',
          `bg-${color}-200`
        ])}
      >
        <Typography className="font-poppins font-semibold flex md:hidden">
          {name}
        </Typography>
        <Typography
          className={clsx([
            ' font-poppins font-bold text-xl flex justify-center transition-all overflow-clip',
            styles.marginInfoIndicator
          ])}
        >
          {priceFormatter(amount.toFixed())}
        </Typography>
      </div>
      <div
        className={clsx([
          'px-2 text-white rounded-lg -ml-8 py-2 flex flex-col items-center w-16 justify-center grow xs:grow-0',
          `bg-${color}-600`
        ])}
      >
        <Typography className=" font-poppins font-bold ">
          <CountUp end={percent} duration={3} />%
        </Typography>

        <Typography className=" font-poppins font-bold text-[0.5rem]">
          Under
        </Typography>
      </div>
      <div
        className={clsx([
          ' px-2 text-white rounded-lg ml-4 py-2 flex flex-col items-center justify-center grow xs:grow-0',
          `bg-${color}-500`
        ])}
      >
        <Typography className=" font-poppins font-bold ">{margin}%</Typography>

        <Typography className=" font-poppins font-bold text-[0.5rem]">
          Net Margin
        </Typography>
      </div>
    </div>
  );
};

type MarginInfoProps = {};
const MarginInfo = (props: MarginInfoProps) => {
  const { saleCalculatedProperty } = useSelector(selectProperties);

  const { initialInvestment, financingCosts } = useSelector(selectExpenses);
  const totalExpenses = initialInvestment + financingCosts;
  const soldComps = saleCalculatedProperty.comps?.filter(
    (comp) => comp.status === 'sold'
  );
  if (!soldComps || soldComps?.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-col md:grid grid-cols-[auto_1fr] grid-rows-2 gap-y-4 mt-4 items-center md:sticky top-0 z-[2] bg-off-white pb-4 px-4">
      <Typography className="hidden md:flex font-poppins text-2xl">
        Sale Comparable
      </Typography>
      <MarginInfoChips
        amount={saleCalculatedProperty?.arvPrice}
        // percent={saleCalculatedProperty?.sales_comps_percentage.toFixed()}
        // margin={0}
        percent={calculateArvPercentage(
          saleCalculatedProperty?.arvPrice,
          saleCalculatedProperty?.price
        ).toFixed()}
        margin={calculateMarginPercentage(
          saleCalculatedProperty?.arvPrice,
          saleCalculatedProperty?.price,
          totalExpenses
        ).toFixed()}
        color="purple"
        name="Sale Comparable"
      />

      <Typography className="hidden md:flex font-poppins text-2xl">
        Top 25th ARV
      </Typography>

      <MarginInfoChips
        amount={saleCalculatedProperty?.arv25Price}
        // percent={saleCalculatedProperty?.arv_percentage.toFixed()}
        // margin={0}

        percent={calculateArvPercentage(
          saleCalculatedProperty?.arv25Price,
          saleCalculatedProperty?.price
        ).toFixed()}
        margin={calculateMarginPercentage(
          saleCalculatedProperty?.arv25Price,
          saleCalculatedProperty?.price,
          totalExpenses
        ).toFixed()}
        color="green"
        name="Top 25th ARV"
      />
    </div>
  );
};

export default MarginInfo;
