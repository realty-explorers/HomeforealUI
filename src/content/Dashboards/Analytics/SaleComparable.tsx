import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import styled from '@emotion/styled';
import styles from './SaleComparable.module.scss';
import AnalyzedProperty from '@/models/analyzedProperty';
import { numberStringUtil, priceFormatter } from '@/utils/converters';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { selectProperties } from '@/store/slices/propertiesSlice';
import { readableDateDiff } from '@/utils/dateUtils';

const calcDays = (date: string) => {
  const date1 = new Date(date);
  const date2 = new Date();
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 'none'
}));

type SaleComparableProps = {
  property: AnalyzedProperty;
};
const SaleComparable = (props: SaleComparableProps) => {
  const { selectedComps } = useSelector(selectProperties);
  const soldComps = props.property.comps.filter(
    (comp) => comp.status === 'sold'
  );
  if (soldComps.length === 0) {
    return null;
  }
  const area = props.property.area;
  const priceToSqft = area && area > 0 ? props.property.price / area : 0;
  const compsPriceToSqft = selectedComps
    ? selectedComps.reduce((acc, comp) => {
        const compArea = comp.area;
        const compPriceToSqft =
          compArea && compArea > 0
            ? numberStringUtil(comp.price) / compArea
            : 0;
        return acc + compPriceToSqft;
      }, 0) / selectedComps.length
    : null;

  const avgCompsDaysOnMarket:number = selectedComps
    ? selectedComps?.reduce((acc, comp) => {
        return acc + calcDays(comp.listDate);
      }, 0) / selectedComps?.length
		: null; 
	
  const propertyDOM = calcDays(props.property.listDate);
  const propertyDaysOnMarket:string = readableDateDiff(propertyDOM);
	
  const compsAverageDOM:string = readableDateDiff(avgCompsDaysOnMarket);

  return (
    <div className="hidden md:block p-4 w-full">
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
                    Price/Sqft
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <hr className="border-t-black border-dashed" />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography className={styles.cellText}>
                    {priceToSqft ? priceFormatter(priceToSqft.toFixed()) : '-'}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography className={styles.cellText}>
                    {compsPriceToSqft
                      ? priceFormatter(compsPriceToSqft.toFixed())
                      : '-'}
                  </Typography>
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell component="th" scope="row">
                  <Typography className={styles.cellText}>
                    Average DOM
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <hr className="border-t-black border-dashed" />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography className={styles.cellText}>
                    {propertyDaysOnMarket}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography className={styles.cellText}>
                    {compsAverageDOM}
                  </Typography>
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
                    {soldComps.length}
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

export default SaleComparable;
