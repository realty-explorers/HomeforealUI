import AnalyzedProperty from "@/models/analyzedProperty";
import { selectProperties } from "@/store/slices/propertiesSlice";
import { priceFormatter } from "@/utils/converters";
import { Tooltip, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import styles from "./PropertyHeaderStyles.module.scss";
import HelpIcon from "@mui/icons-material/Help";

type MarginInfoProps = {
  property: AnalyzedProperty;
};
const MarginInfo = (props: MarginInfoProps) => {
  const { selectedProperty, selectedComps, calculatedProperty } = useSelector(
    selectProperties,
  );
  // const profitMargin = props.property?.listing_price > 0
  //   ? (props.property?.arv_price -
  //     props.property?.listing_price - 0) / props.property?.listing_price * 100
  //   : null;
  // const compsMargin = props.property?.listing_price > 0
  //   ? (props.property?.sales_comps_price -
  //     props.property?.listing_price - 0) / props.property?.sales_comps_price * 100
  //   : null;
  //
  // const profitMargin = props.property?.margin_percentage;
  return (calculatedProperty?.sales_comps?.data?.length > 0 &&
    (
      <>
        <div className={styles.marginCard}>
          <Typography className={styles.marginCardHeader}>
            Comps Sale
          </Typography>
          <Typography className={styles.marginCardValue}>
            {priceFormatter(calculatedProperty?.sales_comps_price?.toFixed())}
          </Typography>
          <Typography className={styles.marginCardPercentage}>
            {calculatedProperty.margin_percentage?.toFixed()}% Margin
          </Typography>
          <Tooltip
            className="absolute bottom-1 right-1 w-4 h-4"
            title="Calculated comps average margin with estimated expanses"
          >
            <HelpIcon />
          </Tooltip>
        </div>
        <div className={styles.marginCard}>
          <Typography className={styles.marginCardHeader}>
            Top 25th ARV
          </Typography>
          <Typography className={styles.marginCardValue}>
            {priceFormatter(calculatedProperty?.arv_price?.toFixed())}
          </Typography>
          <Typography className={styles.marginCardPercentage}>
            {calculatedProperty.arv_percentage?.toFixed()}% Margin
          </Typography>
          <Tooltip
            className="absolute bottom-1 right-1 w-4 h-4"
            title="Calculated ARV average margin of top 25% most valuable comps with estimated expanses"
          >
            <HelpIcon />
          </Tooltip>
        </div>
      </>
    ));
};

export default MarginInfo;
