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
  Typography,
} from "@mui/material";
import GridField from "@/components/Grid/GridField";
import ValueCard from "@/components/Cards/ValueCard";
import styled from "@emotion/styled";
import analyticsStyles from "./Analytics.module.scss";
import styles from "./SaleComparable.module.scss";
import ThemedButton from "@/components/Buttons/ThemedButton";
import AnalyzedProperty, { Property } from "@/models/analyzedProperty";
import { numberStringUtil, priceFormatter } from "@/utils/converters";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: "none",
}));

type SaleComparableProps = {
  property: AnalyzedProperty;
};
const SaleComparable = (props: SaleComparableProps) => {
  const area = props.property.property.building_area;
  const priceToSqft = area && area > 0
    ? props.property.listing_price / area
    : 0;
  const compsPriceToSqft = 0;

  return (
    <Grid
      container
      className={`${analyticsStyles.sectionContainer}`}
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={6}>
        <h1 className={analyticsStyles.sectionHeader}>Sale Comparable</h1>
      </Grid>
      <Grid item xs={6} sx={{ marginBottom: "1rem" }}>
        <ValueCard
          title="Estimated ARV"
          value={priceFormatter(numberStringUtil(props.property.arv).toFixed())}
        />
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
                  <Typography className={styles.cellText}>
                    {priceFormatter(priceToSqft?.toFixed())}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography className={styles.cellText}>
                    {compsPriceToSqft}
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
                  ------------------------------------------------
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography className={styles.cellText}>{0}</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography className={styles.cellText}>{0}</Typography>
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
                  <Typography className={styles.cellText}>-</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography className={styles.cellText}>
                    {props.property.CompsData?.length}
                  </Typography>
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container justifyContent="flex-end">
          <ThemedButton text="Market Facts" />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SaleComparable;
