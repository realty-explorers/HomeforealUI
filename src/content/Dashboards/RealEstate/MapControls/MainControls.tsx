import React, { useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  styled,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography
} from '@mui/material';
import SliderRangeInput from '../FormFields/SliderRangeInput';
import SliderRangeInputV2 from '../FormFields/SliderRangeInputv2';
import SliderInput from '../FormFields/SliderInput';
import {
  priceFormatter,
  priceReverseScale,
  priceScale
} from '@/utils/converters';
import SliderField from './SliderField';
import {
  selectFilter,
  setArvMargin,
  setBuybox,
  setFilteredProperties,
  setMaxBaths,
  setMaxBeds,
  setMaxPrice,
  setMinArea,
  setMaxArea,
  setMinBaths,
  setMinBeds,
  setMinPrice,
  setPropertyTypes,
  setStrategyMode,
  setArv25Margin
} from '@/store/slices/filterSlice';
import debounce from 'lodash.debounce';
import { useDispatch, useSelector } from 'react-redux';
import PropertyTypes from './PropertyTypes';
import PropertyTypeFilter from './PropertyTypeFilter';
import AnalyzedProperty from '@/models/analyzedProperty';
import { locationApiEndpoints } from '@/store/services/locationApiService';
import { selectLocation } from '@/store/slices/locationSlice';
import {
  propertiesApiEndpoints,
  useGetPropertiesPreviewsQuery
} from '@/store/services/propertiesApiService';
import PropertyPreview from '@/models/propertyPreview';
import {
  buyBoxApiEndpoints,
  useGetBuyBoxesQuery,
  useLazyGetBuyBoxesQuery
} from '@/store/services/buyboxApiService';
import { useSnackbar } from 'notistack';
import { skipToken } from '@reduxjs/toolkit/query';
import { redirect, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

const filterFieldNames = [
  'arvPrice',
  'arv25Price',
  'price',
  'area',
  'beds',
  'baths'
];

type MainControlsProps = {};
const MainControls: React.FC<MainControlsProps> = (
  props: MainControlsProps
) => {
  const { enqueueSnackbar } = useSnackbar();

  const {
    arvMargin,
    arv25Margin,
    maxBaths,
    minBaths,
    maxBeds,
    minBeds,
    maxPrice,
    minPrice,
    minArea,
    maxArea,
    propertyTypes,
    filteredProperties,
    buybox
  } = useSelector(selectFilter);

  const { data, status } = useSession();
  const dispatch = useDispatch();
  const { suggestion } = useSelector(selectLocation);

  // const selectBuyBoxesResult = buyBoxApiEndpoints.getBuyBoxes.select('');
  const buyBoxesState = buyBoxApiEndpoints.getBuyBoxes.useQueryState('');

  // const [getBuyBoxes, buyBoxesState] = useLazyGetBuyBoxesQuery();

  // const propertiesState = propertiesApiEndpoints.getPropertiesPreviews
  //   .useQueryState(
  //     suggestion && buybox ? { suggestion, buybox_id: buybox.id } : skipToken,
  //   );
  const propertiesQuery = useGetPropertiesPreviewsQuery(
    suggestion && buybox && data?.user
      ? {
          suggestion,
          buybox_id: buybox.id,
          masked: !data?.user?.verified
        }
      : skipToken
  );
  locationApiEndpoints.getLocationData.useQuerySubscription(
    suggestion || skipToken
  );
  // propertiesApiEndpoints.getPropertiesPreviews.useQuerySubscription(
  //   suggestion && buybox ? { suggestion, buybox_id: buybox.id } : skipToken,
  // );

  const [arv, setArv] = useState(0);
  const [price, setPrice] = useState([0, 1000000]);
  const [comps, setComps] = useState(0);
  const [area, setArea] = useState([0, 10000]);
  const [beds, setBeds] = useState([0, 9]);
  const [baths, setBaths] = useState([0, 9]);

  const searchParams = useSearchParams();

  const router = useRouter();
  const selectedBuyBoxId = router.query.buybox_id as string;
  // const selectedBuyBoxId = searchParams.get('buybox_id');

  useEffect(() => {
    filterPropertiesByValue(0, '', strategy);
    // dispatch(setFilteredProperties(propertiesState.data));
  }, [propertiesQuery.data]);

  useEffect(() => {
    if (propertiesQuery.error) {
      enqueueSnackbar(' Error fetching properties, please try again later', {
        variant: 'error'
      });
    }
  }, [propertiesQuery.error]);

  const updateArv = (value: number) => {
    setArv(value);

    debounceUpdate(() => {
      dispatch(setArvMargin(value));
    });
    // debounceUpdateArv(value);
  };

  const strategyFilterFieldNames = ['arv25Price', 'arvPrice'];

  const strategyFilterFieldsMap = {
    arvPrice: 'Comps',
    arv25Price: 'ARV'
  };

  const filterByStrategy = (
    filterValue: number | number[],
    property: PropertyPreview,
    fieldName: string,
    strategy?: string
  ) => {
    const propertyValue = property[fieldName];
    if (strategyFilterFieldsMap[fieldName] !== strategy) {
      return true;
    }
    if (strategyFilterFieldNames.includes(fieldName)) {
      if (typeof propertyValue !== 'number') {
        return false;
      }
      const propertyPrice = property.price || property.priceGroup.min;
      const percentage =
        propertyValue > 0
          ? ((propertyValue - propertyPrice) / propertyValue) * 100
          : 0;

      if (filterValue > percentage) {
        return false;
      }
    }
    return true;
  };

  const getFilterValue = (fieldName, updatedFieldName, updatedValue) => {
    if (fieldName === 'arv25Price') {
      return updatedFieldName === 'arv25Price' ? updatedValue : arv;
    }
    if (fieldName === 'arvPrice') {
      return updatedFieldName === 'arvPrice' ? updatedValue : comps;
    }
    if (fieldName === 'price') {
      return updatedFieldName === 'price' ? updatedValue : price;
    }
    if (fieldName === 'area') {
      return updatedFieldName === 'area' ? updatedValue : area;
    }
    if (fieldName === 'beds') {
      return updatedFieldName === 'beds' ? updatedValue : beds;
    }
    if (fieldName === 'baths') {
      return updatedFieldName === 'baths' ? updatedValue : baths;
    }
    return 0;
  };

  const filterPropertiesByValue = (
    value: number | number[],
    updatedFieldName: string,
    strategy?: string
  ) => {
    const filteredProperties = propertiesQuery.data?.filter(
      (property: PropertyPreview) => {
        for (const fieldName of filterFieldNames) {
          const filterValue = getFilterValue(
            fieldName,
            updatedFieldName,
            value
          );
          let propertyValue = property[fieldName];
          if (fieldName === 'price' && !property.price) {
            propertyValue = property.priceGroup.min;
          }
          const validStrategyValue = filterByStrategy(
            filterValue,
            property,
            fieldName,
            strategy
          );
          if (!validStrategyValue) {
            return false;
          }
          if (typeof filterValue === 'number') {
            if (propertyValue < filterValue) {
              return false;
            }
          } else {
            const minValue = filterValue[0];
            const maxValue = filterValue[1];

            if (propertyValue < minValue || propertyValue > maxValue) {
              return false;
            }
          }
        }
        return true;
      }
    );
    dispatch(setFilteredProperties(filteredProperties));
    // dispatch(setFilteredProperties(propertiesQuery.data));
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
    []
  );

  const debounceUpdateArv = useMemo(
    () =>
      debounce((value: number) => {
        console.log('meow');
        dispatch(setArvMargin(value));
      }, 200),
    []
  );

  const [strategy, setStrategy] = useState('ARV');
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newStrategy: string
  ) => {
    if (newStrategy !== null) {
      setStrategy(newStrategy);
      filterPropertiesByValue(0, '', newStrategy);
      dispatch(setStrategyMode(newStrategy));
    }
  };
  const handleBuyBoxChange = (e) => {
    const value = e.target.value;
    dispatch(setBuybox(value));
    router.push({
      pathname: router.pathname,
      query: {
        buybox_id: value.id
      }
    });
  };

  return (
    <div className="w-full">
      <div className="absolute top-2 right-4 font-poppins font-bold">
        {filteredProperties?.length} found
      </div>
      {buyBoxesState.isFetching ? (
        <div>loading...</div>
      ) : (
        buyBoxesState.data && (
          <FormControl
            fullWidth
            size="small"
            className="mb-2"
            id="buyboxCombobox"
          >
            <InputLabel>BuyBox</InputLabel>
            <Select
              value={buybox || ''}
              label="BuyBox"
              onChange={handleBuyBoxChange}
            >
              {buyBoxesState.data?.map((buybox) => (
                <MenuItem key={buybox.id} value={buybox}>
                  {buybox.parameters.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      )}

      <div className="flex w-full justify-center items-center mb-4">
        <ToggleButtonGroup
          color="primary"
          id="strategyToggle"
          value={strategy}
          exclusive
          onChange={handleChange}
          className="text-center"
        >
          <ToggleButton
            value="ARV"
            className="flex items-center justify-center h-8"
            sx={{
              '&.Mui-selected': {
                backgroundColor: '#22c55e'
              }
            }}
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
      <div
        id="filters"
        className=" pr-4 pl-2 mb-4 w-full overflow-y-auto overflow-x-hidden"
      >
        {strategy === 'ARV' ? (
          <SliderField
            fieldName="Min ARV Margin %"
            tooltip="Percentage under estimated market ARV"
          >
            <SliderInput
              inputProps={{
                title: 'ARV Margin',
                name: 'arvMargin',
                min: 0,
                max: 100,
                step: 1
              }}
              value={arv}
              // update={(value) => updateArv(value)}
              update={(value) =>
                setValue(
                  () => setArv(value),
                  () => dispatch(setArv25Margin(value)),
                  value,
                  'arv25Margin'
                )
              }
            />
          </SliderField>
        ) : (
          <SliderField
            fieldName="Min Sales Comps Margin %"
            tooltip="Percentage under market sales comps"
          >
            <SliderInput
              inputProps={{
                title: 'Comps Margin',
                name: 'underComps',
                min: 0,
                max: 100,
                step: 1
              }}
              value={comps}
              update={(value) =>
                setValue(
                  () => setComps(value),
                  () => dispatch(setArvMargin(value)),
                  value,
                  'arvMargin'
                )
              }
            />
          </SliderField>
        )}

        <SliderField fieldName="Listing Price">
          <SliderRangeInputV2
            inputProps={{
              title: 'Listing Price',
              name: 'listingPrice',
              min: 0,
              max: 60,
              step: 1
            }}
            value={price}
            format={priceFormatter}
            updateValue={(value) =>
              setValue(
                () => setPrice(value),
                () => {
                  dispatch(setMinPrice(value[0]));
                  dispatch(setMaxPrice(value[1]));
                },
                value,
                'price'
              )
            }
            scale={{ scale: priceScale, reverseScale: priceReverseScale }}
          />
        </SliderField>

        <SliderField fieldName="Baths">
          <SliderRangeInputV2
            inputProps={{
              title: 'Bathrooms',
              name: 'baths',
              min: 1,
              max: 9,
              step: 1
            }}
            value={baths}
            updateValue={(value) =>
              setValue(
                () => setBaths(value),
                () => {
                  dispatch(setMinBaths(value[0]));
                  dispatch(setMaxBaths(value[1]));
                },
                value,
                'baths'
              )
            }
          />
        </SliderField>
        <SliderField fieldName="Beds">
          <SliderRangeInputV2
            inputProps={{
              title: 'Bedrooms',
              name: 'beds',
              min: 1,
              max: 9,
              step: 1
            }}
            value={beds}
            updateValue={(value) =>
              setValue(
                () => setBeds(value),
                () => {
                  dispatch(setMinBeds(value[0]));
                  dispatch(setMaxBeds(value[1]));
                },
                value,
                'beds'
              )
            }
            // updateMinValue={(value) => dispatch(setMinBeds(value))}
            // updateMaxValue={(value) => dispatch(setMaxBeds(value))}
          />
        </SliderField>
        <SliderField fieldName="Building Sqft">
          <SliderRangeInputV2
            inputProps={{
              title: 'Building Sqft',
              name: 'sqft',
              min: 0,
              max: 10000,
              step: 50
            }}
            // minValue={minArea}
            // maxValue={maxArea}
            value={area}
            updateValue={(value) =>
              setValue(
                () => setArea(value),
                () => {
                  dispatch(setMinArea(value[0]));
                  dispatch(setMaxArea(value[1]));
                },
                value,
                'area'
              )
            }
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
    </div>
  );
};

export default MainControls;
