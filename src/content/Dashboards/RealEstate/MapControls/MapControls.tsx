import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Collapse,
  Grid,
  IconButton,
  IconButtonProps,
  styled,
  Tooltip,
} from "@mui/material";
import MainControls from "./MainControls";
import AdvancedControls from "./AdvancedControls";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import PropertyForm from "./PropertyForm";
import { useSelector } from "react-redux";
import Property from "@/models/property";

const ParametersCard = styled(Card)(({}) => ({
  margin: "0",
  backgroundColor: "rgba(255,255,255,0.8)",
  width: "15rem",
  position: "absolute",
  top: 0,
  right: 0,
  // height: '35%'
}));

const AdjustingCard = styled(Card)(({}) => ({
  margin: "0",
  backgroundColor: "rgba(255,255,255,0.8)",
  width: "20rem",
  position: "absolute",
  top: 0,
  right: "31rem",
  // height: '35%'
}));

const ExpandButton = styled(Button)(({}) => ({
  position: "absolute",
  top: "50%",
  left: 0,
  margin: "0.5em",
  transform: "translate(-50%, -50%)",
  zIndex: 1000,
}));

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand
    // ? 'translate(-50%, -50%) rotate(90deg)'
    // : 'translate(-50%, -50%) rotate(270deg)',
    ? "translate(-50%, 50%) rotate(0deg)"
    : "translate(-50%, 50%) rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  position: "absolute",
  bottom: "0",
  left: "50%",
  zIndex: 1000,
  color: "rgb(85 105 255)",
  backgroundColor: "white",
  border: "1px solid #C2C2C2",
  height: "1rem",
  width: "3rem",
  "&:hover, &:focus": {
    backgroundColor: "white",
  },
}));

const ControlsCollapse = styled(Collapse)(({}) => ({
  width: "100%",
  ".MuiCollapse-wrapperInner": {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
  },
}));

type MapControlsProps = {};
const MapControls: React.FC<MapControlsProps> = (props: MapControlsProps) => {
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      {
        /* <AdjustingCard>
        <PropertyForm
          searching={searching}
          property={searchAnalyzedProperty}
          searchDeals={searchNewDeals}
        />
      </AdjustingCard> */
      }
      <ParametersCard sx={{ overflow: "visible" }}>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
          {/* <ReadMoreIcon /> */}
        </ExpandMore>
        <CardContent sx={{ height: "100%" }}>
          <Grid
            container
            rowSpacing={2}
            columnSpacing={3}
            justifyContent="center"
            sx={{ width: "auto", height: "100%", margin: 0, padding: "0 1em" }}
          >
            <h3 style={{ margin: "0.5rem 0", padding: "0 0.5rem" }}>
              Filters
            </h3>

            <ControlsCollapse
              in={expanded}
              timeout="auto"
              unmountOnExit
              orientation="vertical"
              component={Grid}
            >
              <MainControls />
              {
                /* <AdvancedControls
                searchData={props.searchData}
                update={props.update}
              /> */
              }
            </ControlsCollapse>
          </Grid>

          {
            /* <Grid
          container
          rowSpacing={2}
          columnSpacing={3}
          justifyContent="center"
          sx={{
            width: 'auto',
            height: 200,
            margin: '2em 0 0 0',
            padding: '0 1em'
          }}
        >
          <AdvancedControls
            update={props.update}
            searchData={props.searchData}
          />
        </Grid> */
          }
        </CardContent>
      </ParametersCard>
    </>
  );
};

export default MapControls;
