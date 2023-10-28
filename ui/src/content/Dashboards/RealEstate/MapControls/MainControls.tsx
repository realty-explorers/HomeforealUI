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
  setFilteredProperties,
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
import PropertyPreview from "@/models/propertyPreview";
import { PropertyType } from "@/models/property";
import {
  selectProperties,
  setSelectedComps,
} from "@/store/slices/propertiesSlice";

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
    filteredProperties,
  } = useSelector(selectFilter);

  const [arv, setArv] = useState(0);
  const [price, setPrice] = useState([0, 1000000]);
  const [comps, setComps] = useState(0);
  const [area, setArea] = useState([0, 10000]);

  useEffect(() => {
    dispatch(setFilteredProperties(propertiesState.data));
  }, [propertiesState.data]);

  const updateArv = (value: number) => {
    setArv(value);

    debounceUpdate(() => {
      dispatch(setArvMargin(value));
    });
    // debounceUpdateArv(value);
  };

  const filterPropertiesByValue = (
    value: number | number[],
    fieldName: string,
  ) => {
    const filteredProperties = propertiesState.data?.filter(
      (property: PropertyPreview) => {
        const propertyValue = property[fieldName];
        if (typeof fieldName === "string") {
          if (fieldName === "arv_price") {
            const arvPercentage = typeof property?.arv_price === "number"
              ? (property.arv_price - property.sales_listing_price) /
                property.arv_price * 100
              : 0;
            if (value > 0 && value > arvPercentage) {
              return false;
            }
          }
          if (fieldName === "sales_comps_price") {
            const compsSalePercentage =
              typeof property?.sales_comps_price === "number"
                ? (property.sales_comps_price - property.sales_listing_price) /
                  property.sales_comps_price * 100
                : 0;

            if (value > 0 && value > compsSalePercentage) {
              return false;
            }
          }
          if (
            value > 0 && value > propertyValue
          ) {
            console.log("meow");
            return false;
          } else {
            console.log(`value: ${value}, property: ${propertyValue}`);
          }
        } else {
          const minValue = value[0];
          const maxValue = value[1];

          if (
            propertyValue < minValue ||
            propertyValue > maxValue
          ) {
            return false;
          }
        }
        return true;
      },
    );
    dispatch(setFilteredProperties(filteredProperties));
  };

  const setValue = (setFunction, updateFunction, value, fieldName) => {
    setFunction();
    debounceUpdate(() => {
      updateFunction();
      filterPropertiesByValue(value, fieldName);
      // filterProperties(price[0], price[1], comps, arv, area[0], area[1]);
    });
  };

  const filterProperties = (
    minPrice: number,
    maxPrice: number,
    compsSale: number,
    arv: number,
    minArea: number,
    maxArea: number,
  ) => {
    console.log("comps: " + compsMargin);
    const filteredProperties = propertiesState.data?.filter(
      (property: PropertyPreview) => {
        const arvPercentage = typeof property?.arv_price === "number"
          ? (property.arv_price - property.sales_listing_price) /
            property.arv_price * 100
          : 0;

        const compsSalePercentage =
          typeof property?.sales_comps_price === "number"
            ? (property.sales_comps_price - property.sales_listing_price) /
              property.sales_comps_price * 100
            : 0;

        if (
          property.sales_listing_price < minPrice ||
          property.sales_listing_price > maxPrice
        ) {
          return false;
        }
        if (arvMargin > 0 && arvPercentage < arv) {
          return false;
        }
        if (compsSale > 0 && compsSalePercentage < compsSale) {
          console.log(compsSale);
          return false;
        } else {
          console.log();
        }
        // if (property.sal < compsMargin) {
        //   return false;
        // }
        if (
          property.building_area < minArea ||
          property.building_area > maxArea
        ) {
          return false;
        }
        if (
          !propertyTypes.includes(property.property_type as PropertyType)
        ) {
          return false;
        }
        return true;
      },
    );
    dispatch(setFilteredProperties(filteredProperties));
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
        {filteredProperties?.length} found
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
              value,
              "sales_listing_price",
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
          value={comps}
          update={(value) =>
            setValue(
              () => setComps(value),
              () => dispatch(setCompsMargin(value)),
              value,
              "sales_comps_price",
            )}
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
            setValue(
              () => setArv(value),
              () => dispatch(setArvMargin(value)),
              value,
              "arv_price",
            )}
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
              value,
              "building_area",
            )}
          // updateMinValue={(value) => dispatch(setMinSqft(value))}
          // updateMaxValue={(value) => dispatch(setMaxSqft(value))}
          // scale={{ scale: priceScale, reverseScale: sqftScale }}
        />
      </SliderField>
      {/* <PropertyTypeFilter */}
      {/*   propertyTypes={propertyTypes} */}
      {/*   updateTypes={(value) => dispatch(setPropertyTypes(value))} */}
      {/* /> */}
    </div>
  );
};

export default MainControls;
