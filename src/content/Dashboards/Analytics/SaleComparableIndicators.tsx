import {
  Button,
  Grid,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import GridField from '@/components/Grid/GridField';
import ValueCard from '@/components/Cards/ValueCard';
import styled from '@emotion/styled';
import analyticsStyles from './Analytics.module.scss';
import styles from './SaleComparable.module.scss';
import ThemedButton from '@/components/Buttons/ThemedButton';
import AnalyzedProperty from '@/models/analyzedProperty';
import { numberStringUtil, priceFormatter } from '@/utils/converters';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { selectProperties } from '@/store/slices/propertiesSlice';
import { selectExpenses } from '@/store/slices/expensesSlice';
import {
  calculateArvPercentage,
  calculateMarginPercentage
} from '@/utils/calculationUtils';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 'none'
}));

type SaleComparableIndicatorsProps = {
  property: AnalyzedProperty;
};
const SaleComparableIndicators = (props: SaleComparableIndicatorsProps) => {
  const { saleCalculatedProperty } = useSelector(selectProperties);
  const { initialInvestment, financingCosts } = useSelector(selectExpenses);
  const totalExpenses = initialInvestment + financingCosts;

  const underCompsPercentage = calculateArvPercentage(
    saleCalculatedProperty?.arvPrice,
    saleCalculatedProperty?.price,
    totalExpenses
  );
  const underARVPercentage = calculateArvPercentage(
    saleCalculatedProperty?.arv25Price,
    saleCalculatedProperty?.price,
    totalExpenses
  );
  const compsMarginPercentage = calculateMarginPercentage(
    saleCalculatedProperty?.arvPrice,
    saleCalculatedProperty?.price,
    totalExpenses
  );
  const arvMarginPercentage = calculateMarginPercentage(
    saleCalculatedProperty?.arv25Price,
    saleCalculatedProperty?.price,
    totalExpenses
  );

  return (
    saleCalculatedProperty?.comps.filter((comp) => comp.type === 'sold')
      ?.length > 0 && (
      <div className="flex w-full gap-x-4 px-4 py-2 justify-center items-center sticky top-0 shadow z-[2] bg-off-white ">
        <div className="flex flex-col w-full">
          <div className="flex ">
            <Typography className="font-poppins font-bold">
              Sales Comps
            </Typography>

            <Typography className="font-poppins font-bold ml-4">
              {priceFormatter(saleCalculatedProperty?.arvPrice.toFixed())}
            </Typography>

            <div className="px-2">●</div>

            <Typography className="font-poppins font-bold">
              Margin: {compsMarginPercentage.toFixed()} %
            </Typography>
          </div>

          <div className="flex items-center">
            <LinearProgress
              variant="determinate"
              value={underCompsPercentage > 100 ? 100 : underCompsPercentage}
              className="grow"
            />

            <Typography className="font-poppins font-bold ml-2">
              <ArrowCircleDownIcon fontSize="small" />
              {underCompsPercentage.toFixed()} %
            </Typography>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex ">
            <Typography className="font-poppins font-bold">25th ARV</Typography>

            <Typography className="font-poppins font-bold ml-4">
              {priceFormatter(saleCalculatedProperty?.arv25Price.toFixed())}
            </Typography>

            <div className="px-2">●</div>

            <Typography className="font-poppins font-bold ">
              Margin: {arvMarginPercentage.toFixed()} %
            </Typography>
          </div>

          <div className="flex items-center">
            <LinearProgress
              variant="determinate"
              value={underARVPercentage > 100 ? 100 : underARVPercentage}
              className="grow"
              color="success"
            />

            <Typography className="font-poppins font-bold ml-2">
              <ArrowCircleDownIcon fontSize="small" />
              {underARVPercentage.toFixed()} %
            </Typography>
          </div>
        </div>
      </div>
    )
  );
};

export default SaleComparableIndicators;
