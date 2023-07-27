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
import styles from './RentComparable.module.scss';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 'none'
}));

type RentComparableProps = {
  property: Property;
};
const RentComparable = (props: RentComparableProps) => {
  return (
    <Grid
      container
      className={`${analyticsStyles.sectionContainer}`}
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={6}>
        <h1 className={analyticsStyles.sectionHeader}>Rent Comparable</h1>
      </Grid>
      <Grid item xs={6} sx={{ marginBottom: '1rem' }}>
        <ValueCard title="Estimated Rent" value="$2,000" />
      </Grid>
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
                  <Typography className={styles.cellText}>
                    Price/Sqft
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  ------------------------------------------------
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography className={styles.cellText}>$11</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography className={styles.cellText}>0</Typography>
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell component="th" scope="row">
                  <Typography className={styles.cellText}>
                    Average DOM
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  ------------------------------------------------
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography className={styles.cellText}>-</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography className={styles.cellText}>15</Typography>
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell component="th" scope="row">
                  <Typography className={styles.cellText}>
                    Total Comps
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  ------------------------------------------------
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography className={styles.cellText}>4.5%</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography className={styles.cellText}>3.5%</Typography>
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container justifyContent="flex-end">
          <Button className={analyticsStyles.button}>
            <Typography className={analyticsStyles.buttonText}>
              Market Facts
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RentComparable;
