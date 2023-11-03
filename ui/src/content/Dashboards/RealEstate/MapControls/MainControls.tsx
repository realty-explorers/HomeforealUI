import React, { useEffect, useMemo, useState } from "react";
import {
  Grid,
  styled,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
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
  setStrategyMode,
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

const filterFieldNames = [
  "arv_price",
  "sales_comps_price",
  "sales_listing_price",
  "building_area",
  "bedrooms",
  "total_bathrooms",
];

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
  const [beds, setBeds] = useState([0, 9]);
  const [baths, setBaths] = useState([0, 9]);

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

  const strategyFilterFieldNames = [
    "arv_price",
    "sales_comps_price",
  ];

  const strategyFilterFieldsMap = {
    "sales_comps_price": "Comps",
    "arv_price": "ARV",
  };

  const filterByStrategy = (
    filterValue: number | number[],
    property: PropertyPreview,
    fieldName: string,
    strategy?: string,
  ) => {
    const propertyValue = property[fieldName];
    if (strategyFilterFieldsMap[fieldName] !== strategy) {
      return true;
    }
    if (strategyFilterFieldNames.includes(fieldName)) {
      if (typeof propertyValue !== "number") {
        return false;
      }
      const percentage = propertyValue > 0
        ? (propertyValue - property.sales_listing_price) / propertyValue * 100
        : 0;

      if (filterValue > percentage) {
        return false;
      }
    }
    return true;
  };

  const getFilterValue = (fieldName, updatedFieldName, updatedValue) => {
    if (fieldName === "arv_price") {
      return updatedFieldName === "arv_price" ? updatedValue : arv;
    }
    if (fieldName === "sales_comps_price") {
      return updatedFieldName === "sales_comps_price" ? updatedValue : comps;
    }
    if (fieldName === "sales_listing_price") {
      return updatedFieldName === "sales_listing_price" ? updatedValue : price;
    }
    if (fieldName === "building_area") {
      return updatedFieldName === "building_area" ? updatedValue : area;
    }
    if (fieldName === "bedrooms") {
      return updatedFieldName === "bedrooms" ? updatedValue : beds;
    }
    if (fieldName === "total_bathrooms") {
      return updatedFieldName === "total_bathrooms" ? updatedValue : baths;
    }
    return 0;
  };

  const filterPropertiesByValue = (
    value: number | number[],
    updatedFieldName: string,
    strategy?: string,
  ) => {
    const filteredProperties = propertiesState.data?.filter(
      (property: PropertyPreview) => {
        for (const fieldName of filterFieldNames) {
          const filterValue = getFilterValue(
            fieldName,
            updatedFieldName,
            value,
          );
          const propertyValue = property[fieldName];
          const validStrategyValue = filterByStrategy(
            filterValue,
            property,
            fieldName,
            strategy,
          );
          if (!validStrategyValue) {
            return false;
          }
          if (typeof filterValue === "number") {
            if (propertyValue < filterValue) {
              return false;
            }
          } else {
            const minValue = filterValue[0];
            const maxValue = filterValue[1];

            if (
              propertyValue < minValue ||
              propertyValue > maxValue
            ) {
              return false;
            }
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
      filterPropertiesByValue(value, fieldName, strategy);
      // filterProperties(price[0], price[1], comps, arv, area[0], area[1]);
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

  const [strategy, setStrategy] = useState("ARV");
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newStrategy: string,
  ) => {
    if (newStrategy !== null) {
      setStrategy(newStrategy);
      filterPropertiesByValue(0, "", newStrategy);
      dispatch(setStrategyMode(newStrategy));
    }
  };

  return (
    <div>
      <div className="absolute top-2 right-4 font-poppins font-bold">
        {filteredProperties?.length} found
      </div>
      <div className="flex w-full justify-center items-center mb-4">
        <ToggleButtonGroup
          color="primary"
          value={strategy}
          exclusive
          onChange={handleChange}
          className="text-center"
        >
          <ToggleButton
            value="ARV"
            className="flex items-center justify-center h-8"
          >
            <Tooltip title="Choose ARV as margin filtering" enterDelay={700}>
              <Typography className="font-poppins font-semibold">
                ARV
              </Typography>
            </Tooltip>
          </ToggleButton>

          <ToggleButton
            value="Comps"
            className="flex items-center justify-center h-8"
          >
            <Tooltip
              title="Choose Sales Comps as margin filtering"
              enterDelay={700}
            >
              <Typography className="font-poppins font-semibold">
                Comps
              </Typography>
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {strategy === "ARV"
        ? (
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
        )
        : (
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
        )}

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
