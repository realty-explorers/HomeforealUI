import { InputProps } from "@/components/Form/formTypes";
import styled from "@emotion/styled";
import { Grid, Tooltip, Typography } from "@mui/material";
import {
  ageFormatter,
  ageReverseScale,
  ageScale,
  priceFormatter,
  priceReverseScale,
  priceScale,
} from "@/utils/converters";
import React, { Children } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Info } from "@mui/icons-material";

const GridDiv = styled(Grid)(({}) => ({
  display: "flex",
  flexDirection: "row",
  width: "100%",
  // height: '2rem',
  "> svg": {
    marginBottom: "0.5em",
  },
  margin: "0 0.2em",
}));

const LabelContainer = styled(Grid)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}));

type SliderFieldProps = {
  fieldName: string;
  tooltip?: string;
  children: React.ReactNode;
};

const SliderField: React.FC<SliderFieldProps> = (props: SliderFieldProps) => {
  return (
    <GridDiv container rowGap={1} marginBottom={2}>
      <div className="flex items-center">
        <Typography align="right" noWrap variant="h5">
          {props.fieldName}
        </Typography>
        {props.tooltip && (
          <Tooltip
            title={
              <Typography className="font-poppins text-[1rem]">
                {props.tooltip}
              </Typography>
            }
            arrow
          >
            <InfoOutlinedIcon className="w-4 flex items-center ml-1 mb-[0.1rem]" />
          </Tooltip>
        )}
      </div>
      <Grid item xs={12}>
        {props.children}
      </Grid>
    </GridDiv>
  );
};

export default SliderField;
