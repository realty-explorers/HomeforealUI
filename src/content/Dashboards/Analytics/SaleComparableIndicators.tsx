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
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 'none'
}));

const calculatePercentage = (property: AnalyzedProperty, fieldName: string) => {
  const propertyValue = property.price;
  const arvValue = property[fieldName];
  if (!propertyValue || !arvValue) return 0;
  const percentage =
    propertyValue > 0 ? ((arvValue - propertyValue) / arvValue) * 100 : 0;
  return percentage;
};

type SaleComparableIndicatorsProps = {
  property: AnalyzedProperty;
};
const SaleComparableIndicators = (props: SaleComparableIndicatorsProps) => {
  const { saleCalculatedProperty } = useSelector(selectProperties);
  const underARVPercentage = calculatePercentage(
    saleCalculatedProperty,
    'arv25Price'
  );
  const underCompsPercentage = calculatePercentage(
    saleCalculatedProperty,
    'arvPrice'
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
              Margin: {saleCalculatedProperty.marginPercentage?.toFixed()} %
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
              {priceFormatter(saleCalculatedProperty?.arvPrice.toFixed())}
            </Typography>

            <div className="px-2">●</div>

            <Typography className="font-poppins font-bold ">
              Margin: {saleCalculatedProperty.arvPercentage?.toFixed()} %
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
