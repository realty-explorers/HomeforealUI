import { selectProperties } from "@/store/slices/propertiesSlice";
import { priceFormatter } from "@/utils/converters";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";
import styles from "./PropertyHeaderStyles.module.scss";

const MarginInfo = () => {
  const { selectedProperty, selectedComps } = useSelector(selectProperties);
  const compsValues = selectedComps?.map((comp) => comp.sales_listing_price)
    .sort();
  const top25arv =
    compsValues?.slice(0, Math.floor(compsValues.length * 0.25)) || [];
  const top25arvAverage = top25arv
    ? top25arv.reduce((acc, val) => acc + val, 0) /
      top25arv.length
    : 0;
  const top25arvMargin = top25arv
    ? (top25arvAverage - selectedProperty.expenses_total) /
      selectedProperty.listing_price
    : 0;

  // const avg =
  //   selectedComps.reduce((acc, comp) => acc + comp.sales_listing_price, 0) /
  //   selectedComps.length;
  return (
    <>
      <div className={styles.marginCard}>
        <Typography className={styles.marginCardHeader}>Comps Sale</Typography>
        <Typography className={styles.marginCardValue}>$ 289,000</Typography>
        <Typography className={styles.marginCardPercentage}>
          {/* {avg} Margin */}
          14% Margin
        </Typography>
      </div>
      <div className={styles.marginCard}>
        <Typography className={styles.marginCardHeader}>
          Top 25th ARV
        </Typography>
        <Typography className={styles.marginCardValue}>
          {priceFormatter(top25arvAverage)}
        </Typography>
        <Typography className={styles.marginCardPercentage}>
          {top25arvMargin.toFixed(2)}% Margin
        </Typography>
      </div>
    </>
  );
};

export default MarginInfo;
