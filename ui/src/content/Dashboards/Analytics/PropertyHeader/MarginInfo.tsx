import AnalyzedProperty from "@/models/analyzedProperty";
import { selectProperties } from "@/store/slices/propertiesSlice";
import { priceFormatter } from "@/utils/converters";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";
import styles from "./PropertyHeaderStyles.module.scss";

type MarginInfoProps = {
  property: AnalyzedProperty;
};
const MarginInfo = (props: MarginInfoProps) => {
  const { selectedProperty, selectedComps } = useSelector(selectProperties);
  // const profitMargin = props.property?.listing_price > 0
  //   ? (props.property?.arv_price -
  //     props.property?.listing_price - 0) / props.property?.listing_price * 100
  //   : null;
  const compsMargin = props.property?.listing_price > 0
    ? (props.property?.sales_comps_price -
      props.property?.listing_price - 0) / props.property?.listing_price * 100
    : null;

  const profitMargin = props.property?.margin_percentage;
  return (props.property?.sales_comps?.data &&
    (
      <>
        <div className={styles.marginCard}>
          <Typography className={styles.marginCardHeader}>
            Comps Sale
          </Typography>
          <Typography className={styles.marginCardValue}>
            {priceFormatter(props.property?.sales_comps_price)}
          </Typography>
          <Typography className={styles.marginCardPercentage}>
            {/* {avg} Margin */}
            {compsMargin.toFixed(2)}% Margin
          </Typography>
        </div>
        <div className={styles.marginCard}>
          <Typography className={styles.marginCardHeader}>
            Top 25th ARV
          </Typography>
          <Typography className={styles.marginCardValue}>
            {priceFormatter(props.property?.arv_price)}
          </Typography>
          <Typography className={styles.marginCardPercentage}>
            {profitMargin.toFixed(2)}% Margin
          </Typography>
        </div>
      </>
    ));
};

export default MarginInfo;
