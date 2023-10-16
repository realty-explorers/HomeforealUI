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
import clsx from "clsx";
import { useSelector } from "react-redux";
import { selectProperties } from "@/store/slices/propertiesSlice";
import { calculateProvidedBy } from "@reduxjs/toolkit/dist/query/endpointDefinitions";

const calcDays = (date: string) => {
  const date1 = new Date(date);
  const date2 = new Date();
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: "none",
}));

type SaleComparableProps = {
  property: AnalyzedProperty;
};
const SaleComparable = (props: SaleComparableProps) => {
  const { selectedComps } = useSelector(selectProperties);
  const area = props.property.building_area;
  const priceToSqft = area && area > 0
    ? props.property.listing_price / area
    : 0;
  const compsPriceToSqft = selectedComps
    ? selectedComps.reduce((acc, comp) => {
      const compArea = comp.building_area;
      const compPriceToSqft = compArea && compArea > 0
        ? numberStringUtil(comp.sales_closing_price) / compArea
        : 0;
      return acc + compPriceToSqft;
    }, 0) / selectedComps.length
    : null;

  const compsAverageDOM = selectedComps
    ? selectedComps?.reduce((acc, comp) => {
      return acc + calcDays(comp.sales_date);
    }, 0) / selectedComps?.length
    : null;

  return (props.property?.sales_comps?.data?.length > 0 &&
    (
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
                    <Typography className={styles.columnTitle}>
                      Comps
                    </Typography>
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
                      {priceToSqft
                        ? priceFormatter(priceToSqft.toFixed())
                        : "-"}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Typography className={styles.cellText}>
                      {compsPriceToSqft
                        ? priceFormatter(compsPriceToSqft.toFixed())
                        : "-"}
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
                      {props.property.sales_date}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Typography className={styles.cellText}>
                      {compsAverageDOM?.toFixed() || "-"}
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
                      {props.property.sales_comps.data?.length || 0}
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
    ));
};

export default SaleComparable;
