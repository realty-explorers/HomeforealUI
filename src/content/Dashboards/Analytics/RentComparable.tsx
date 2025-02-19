import Property from '@/models/property';
import {
  Button,
  Grid,
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
import AnalyzedProperty from '@/models/analyzedProperty';
import { useSelector } from 'react-redux';
import { selectProperties } from '@/store/slices/propertiesSlice';
import { numberStringUtil, priceFormatter } from '@/utils/converters';
import clsx from 'clsx';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 'none'
}));

const calcDays = (date: string) => {
  const date1 = new Date(date);
  const date2 = new Date();
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

type RentComparableProps = {
  property: AnalyzedProperty;
};
const RentComparable = (props: RentComparableProps) => {
  const { selectedRentalComps } = useSelector(selectProperties);
  const rentComps = props.property.comps.map(
    (comp) => comp.status === 'for_rent'
  );
  if (rentComps.length === 0) {
    return null;
  }
  const area = props.property.area;
  const rentListingPrice =
    typeof props.property.rentalCompsPrice === 'number'
      ? props.property.rentalCompsPrice
      : 0;
  const rentToSqft = area && area > 0 ? rentListingPrice / area : 0;
  const compsRentToSqft = selectedRentalComps
    ? selectedRentalComps.reduce((acc, comp) => {
        const compArea = comp.area;
        const compRentalPrice = typeof comp.price === 'number' ? comp.price : 0;
        const compPriceToSqft =
          compArea && compArea > 0
            ? numberStringUtil(compRentalPrice) / compArea
            : 0;
        return acc + compPriceToSqft;
      }, 0) / selectedRentalComps.length
    : null;

  return (
    <div className="p-4">
      <Grid className={styles.tableWrapper}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>
                  <Typography className={styles.columnTitle}>
                    Property
                  </Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography className={styles.columnTitle}>Comps</Typography>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <StyledTableCell component="th" scope="row">
                  <Typography
                    className={clsx([styles.cellText, styles.cellHeader])}
                  >
                    Rent/Sqft
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <hr className="border-t-black border-dashed" />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography className={styles.cellText}>
                    {rentToSqft ? priceFormatter(rentToSqft.toFixed()) : '-'}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography className={styles.cellText}>
                    {compsRentToSqft
                      ? priceFormatter(compsRentToSqft.toFixed())
                      : '-'}
                  </Typography>
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell component="th" scope="row">
                  <Typography className={styles.cellText}>Cap Rate</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <hr className="border-t-black border-dashed" />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography className={styles.cellText}>
                    {typeof props.property.capRate === 'number'
                      ? `${props.property.capRate.toFixed(2)}%`
                      : '-'}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography className={styles.cellText}>-</Typography>
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell component="th" scope="row">
                  <Typography className={styles.cellText}>
                    Total Comps
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center" className="w-full">
                  <hr className="border-t-black border-dashed w-full" />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography className={styles.cellText}>-</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography className={styles.cellText}>
                    {rentComps.length}
                  </Typography>
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* <Grid container justifyContent="flex-end"> */}
        {/*   <ThemedButton text="Market Facts" /> */}
        {/* </Grid> */}
      </Grid>
    </div>
  );
};

export default RentComparable;
