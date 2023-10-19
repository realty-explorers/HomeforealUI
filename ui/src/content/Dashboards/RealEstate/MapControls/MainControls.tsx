import React, { useEffect, useMemo, useState } from "react";
import { Grid, styled } from "@mui/material";
import SliderRangeInput from "../FormFields/SliderRangeInput";
import SliderRangeInputV2 from "../FormFields/SliderRangeInputv2";
import SliderInput from "../FormFields/SliderInput";
import {
  priceFormatter,
  priceReverseScale,
  priceScale,
} from "@/utils/converters";
import SliderField from "./SliderField";
import {
  selectFilter,
  setArvMargin,
  setCompsMargin,
  setMaxBaths,
  setMaxBeds,
  setMaxListingPrice,
  setMaxSqft,
  setMinBaths,
  setMinBeds,
  setMinListingPrice,
  setMinSqft,
  setPropertyTypes,
} from "@/store/slices/filterSlice";
import debounce from "lodash.debounce";
import { useDispatch, useSelector } from "react-redux";
import PropertyTypes from "./PropertyTypes";
import PropertyTypeFilter from "./PropertyTypeFilter";
import AnalyzedProperty from "@/models/analyzedProperty";
import { locationApiEndpoints } from "@/store/services/locationApiService";
import { selectLocation } from "@/store/slices/locationSlice";
import { propertiesApiEndpoints } from "@/store/services/propertiesApiService";

const GridDiv = styled("div")(({}) => ({
  display: "flex",
  flexDirection: "row",
  width: "100%",
  height: "2rem",
  "> svg": {
    marginBottom: "0.5em",
  },
  margin: "0 0.2em",
}));

const LabelContainer = styled(Grid)(({ theme }) => ({
  display: "flex",
}));

type MainControlsProps = {};
const MainControls: React.FC<MainControlsProps> = (
  props: MainControlsProps,
) => {
  const dispatch = useDispatch();

  const { suggestion } = useSelector(selectLocation);
  const propertiesState = propertiesApiEndpoints.getPropertiesPreviews
    .useQueryState(
      suggestion,
    );
  locationApiEndpoints.getLocationData.useQuerySubscription(suggestion);
  propertiesApiEndpoints.getPropertiesPreviews.useQuerySubscription(suggestion);

  const {
    arvMargin,
    compsMargin,
    maxBaths,
    minBaths,
    maxBeds,
    minBeds,
    maxListingPrice,
    minListingPrice,
    minSqft,
    maxSqft,
    propertyTypes,
  } = useSelector(selectFilter);

  const [arv, setArv] = useState(0);
  const [price, setPrice] = useState([0, 1000000]);
  const [comps, setComps] = useState(0);
  const [area, setArea] = useState([0, 10000]);

  const updateArv = (value: number) => {
    setArv(value);

    debounceUpdate(() => {
      dispatch(setArvMargin(value));
    });
    // debounceUpdateArv(value);
  };

  const setValue = (setFunction, updateFunction) => {
    setFunction();
    debounceUpdate(() => {
      updateFunction();
    });
  };

  const debounceUpdate = useMemo(
    () =>
      debounce((updateFunction) => {
        updateFunction();
      }, 200),
    [],
  );

  const debounceUpdateArv = useMemo(
    () =>
      debounce((value: number) => {
        console.log("meow");
        dispatch(setArvMargin(value));
      }, 200),
    [],
  );

  return (
    <div>
      <div className="absolute top-2 right-4 font-poppins font-bold">
        {propertiesState.data ? `${propertiesState.data.length} found` : ""}
      </div>
      <SliderField fieldName="Listing Price">
        <SliderRangeInputV2
          inputProps={{
            title: "Listing Price",
            name: "listingPrice",
            min: 0,
            max: 60,
            step: 1,
            format: priceFormatter,
          }}
          value={price}
          updateValue={(value) =>
            setValue(
              () => setPrice(value),
              () => {
                dispatch(setMinListingPrice(value[0]));
                dispatch(setMaxListingPrice(value[1]));
              },
            )}
          scale={{ scale: priceScale, reverseScale: priceReverseScale }}
        />
      </SliderField>

      <SliderField
        fieldName="Sales Comps Margin"
        tooltip="Percentage under market sales comps"
      >
        <SliderInput
          inputProps={{
            title: "Comps Margin",
            name: "underComps",
            min: 0,
            max: 100,
            step: 1,
          }}
          value={compsMargin}
          update={(value) => dispatch(setCompsMargin(value))}
        />
      </SliderField>
      <SliderField
        fieldName="ARV Margin"
        tooltip="Percentage under estimated market ARV"
      >
        <SliderInput
          inputProps={{
            title: "ARV Margin",
            name: "arvMargin",
            min: 0,
            max: 100,
            step: 1,
          }}
          value={arv}
          // update={(value) => updateArv(value)}
          update={(value) =>
            setValue(() => setArv(value), () => dispatch(setArvMargin(value)))}
        />
      </SliderField>

      <SliderField fieldName="Baths">
        <SliderRangeInput
          inputProps={{
            title: "Baths",
            name: "baths",
            min: 1,
            max: 9,
            step: 1,
          }}
          minValue={minBaths}
          maxValue={maxBaths}
          updateMinValue={(value) => dispatch(setMinBaths(value))}
          updateMaxValue={(value) => dispatch(setMaxBaths(value))}
        />
      </SliderField>
      <SliderField fieldName="Beds">
        <SliderRangeInput
          inputProps={{
            title: "Beds",
            name: "beds",
            min: 1,
            max: 9,
            step: 1,
          }}
          minValue={minBeds}
          maxValue={maxBeds}
          updateMinValue={(value) => dispatch(setMinBeds(value))}
          updateMaxValue={(value) => dispatch(setMaxBeds(value))}
        />
      </SliderField>
      <SliderField fieldName="Building Sqft">
        <SliderRangeInputV2
          inputProps={{
            title: "Building Sqft",
            name: "sqft",
            min: 0,
            max: 10000,
            step: 50,
          }}
          // minValue={minArea}
          // maxValue={maxArea}
          value={area}
          updateValue={(value) =>
            setValue(
              () => setArea(value),
              () => {
                dispatch(setMinSqft(value[0]));
                dispatch(setMaxSqft(value[1]));
              },
            )}
          // updateMinValue={(value) => dispatch(setMinSqft(value))}
          // updateMaxValue={(value) => dispatch(setMaxSqft(value))}
          // scale={{ scale: priceScale, reverseScale: sqftScale }}
        />
      </SliderField>
      <PropertyTypeFilter
        propertyTypes={propertyTypes}
        updateTypes={(value) => dispatch(setPropertyTypes(value))}
      />
      {/* <PropertyTypes /> */}
    </div>
  );
};

export default MainControls;
