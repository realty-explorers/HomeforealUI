import React, { useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  styled,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
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
  selectArv25Margin,
  selectArvMargin,
  selectBuybox,
  selectFilteredProperties,
  selectMaxArea,
  selectMaxBaths,
  selectMaxBeds,
  selectMaxPrice,
  selectMinArea,
  selectMinBaths,
  selectMinBeds,
  selectMinPrice,
  selectPropertyTypes,
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

const normalizeStrategyType = (value: unknown) =>
  `${value ?? ''}`
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_');

const isMultifamilyStrategyValue = (value: unknown) => {
  const normalizedValue = normalizeStrategyType(value);
  if (!normalizedValue) {
    return false;
  }

  return (
    normalizedValue === 'MULTIFAMILY' ||
    normalizedValue === 'MULTI_FAMILY' ||
    normalizedValue === 'MULTY_FAMILY' ||
    (normalizedValue.includes('MULTI') && normalizedValue.includes('FAMILY')) ||
    (normalizedValue.includes('MULTY') && normalizedValue.includes('FAMILY'))
  );
};

const getBuyboxParameters = (buyBoxItem?: { parameters?: Record<string, unknown> }) =>
  ((buyBoxItem?.parameters || {}) as Record<string, unknown>);

const getCanonicalBuybox = (parameters: Record<string, unknown>) => {
  return (
    (parameters.buybox_form as Record<string, unknown>) ||
    (parameters.buybox as Record<string, unknown>) ||
    {}
  );
};

const toFiniteNumber = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

const getBuyboxPriceRange = (
  buyBoxItem?: { parameters?: Record<string, unknown> }
): [number, number] | null => {
  if (!buyBoxItem) {
    return null;
  }

  const parameters = getBuyboxParameters(buyBoxItem);
  const canonical = getCanonicalBuybox(parameters);
  const discovery = (canonical.discovery || {}) as Record<string, unknown>;
  const discoveryPriceRange =
    (discovery.price_range as Record<string, unknown>) || {};
  const propertyCriteria =
    (parameters.propertyCriteria as Record<string, unknown>) || {};

  const minCandidates = [
    discoveryPriceRange.min_price,
    discoveryPriceRange.min,
    propertyCriteria.minPrice,
    0
  ];
  const maxCandidates = [
    discoveryPriceRange.max_price,
    discoveryPriceRange.max,
    propertyCriteria.maxPrice,
    1000000
  ];

  const min = minCandidates
    .map((candidate) => toFiniteNumber(candidate))
    .find((candidate) => typeof candidate === 'number');
  const max = maxCandidates
    .map((candidate) => toFiniteNumber(candidate))
    .find((candidate) => typeof candidate === 'number');

  if (typeof min !== 'number' || typeof max !== 'number' || max < min) {
    return null;
  }

  return [min, max];
};

const getBuyBoxStrategyType = (
  buyBoxItem?: { parameters?: Record<string, unknown> }
) => {
  const parameters = getBuyboxParameters(buyBoxItem);
  const canonical = getCanonicalBuybox(parameters);
  const canonicalStrategy = (canonical.strategy || {}) as Record<string, unknown>;
  const strategy = (parameters.strategy || {}) as Record<string, unknown>;

  const strategySources = [
    canonicalStrategy.strategyType,
    canonicalStrategy.strategy_type,
    canonicalStrategy.mode,
    canonicalStrategy.preset,
    canonicalStrategy.strategy,
    strategy.strategyType,
    strategy.strategy_type,
    parameters.strategyType,
    strategy.mode,
    strategy.preset,
    parameters.strategy
  ];

  return (
    strategySources.find((source) => `${source ?? ''}`.trim().length > 0) ||
    'FIX_AND_FLIP'
  );
};

const isMultifamilyBuyBoxValue = (
  buyBoxItem?: { parameters?: Record<string, unknown> }
) => {
  const parameters = getBuyboxParameters(buyBoxItem);
  const strategySources = [
    getBuyBoxStrategyType(buyBoxItem),
    (parameters.strategy as Record<string, unknown> | undefined)?.strategy,
    parameters.strategy
  ];

  return (
    strategySources.some(isMultifamilyStrategyValue) ||
    isMultifamilyStrategyValue(parameters.name)
  );
};

const getBuyboxDisplayName = (buyBoxItem?: {
  id?: string;
  parameters?: Record<string, unknown>;
}) => {
  const parameters = getBuyboxParameters(buyBoxItem);
  return `${parameters.name || buyBoxItem?.id || 'Untitled BuyBox'}`;
};

type MainControlsProps = {};
const MainControls: React.FC<MainControlsProps> = (
  props: MainControlsProps
) => {
  const { enqueueSnackbar } = useSnackbar();

  const arvMargin = useSelector(selectArvMargin);
  const arv25Margin = useSelector(selectArv25Margin);
  const maxBaths = useSelector(selectMaxBaths);
  const minBaths = useSelector(selectMinBaths);
  const maxBeds = useSelector(selectMaxBeds);
  const minBeds = useSelector(selectMinBeds);
  const maxPrice = useSelector(selectMaxPrice);
  const minPrice = useSelector(selectMinPrice);
  const minArea = useSelector(selectMinArea);
  const maxArea = useSelector(selectMaxArea);
  const propertyTypes = useSelector(selectPropertyTypes);
  const filteredProperties = useSelector(selectFilteredProperties);
  const buybox = useSelector(selectBuybox);

  const { data, status } = useSession();
  const dispatch = useDispatch();
  const { suggestion } = useSelector(selectLocation);
  const isVerifiedUser = Boolean(
    (data?.user as { verified?: boolean } | undefined)?.verified
  );

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
          masked: !isVerifiedUser
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
  const [strategy, setStrategy] = useState('ARV');

  const router = useRouter();
  const selectedBuyBoxId = Array.isArray(router.query.buybox_id)
    ? router.query.buybox_id[0]
    : router.query.buybox_id;

  const isMultifamilyBuyBox = isMultifamilyBuyBoxValue(buybox);

  useEffect(() => {
    if (!selectedBuyBoxId || !buyBoxesState.data?.length) {
      return;
    }

    const selectedBuyBox = buyBoxesState.data.find(
      (buyBoxItem) => buyBoxItem.id === selectedBuyBoxId
    );

    if (!selectedBuyBox || selectedBuyBox.id === buybox?.id) {
      return;
    }

    dispatch(setBuybox(selectedBuyBox));
  }, [buyBoxesState.data, buybox?.id, dispatch, selectedBuyBoxId]);

  useEffect(() => {
    const buyboxPriceRange = getBuyboxPriceRange(buybox);
    if (!buyboxPriceRange) {
      return;
    }

    setPrice(buyboxPriceRange);
    dispatch(setMinPrice(buyboxPriceRange[0]));
    dispatch(setMaxPrice(buyboxPriceRange[1]));
  }, [buybox?.id, dispatch]);

  const strategyFilterMode = isMultifamilyBuyBox ? undefined : strategy;

  useEffect(() => {
    filterPropertiesByValue(0, '', strategyFilterMode);
    // dispatch(setFilteredProperties(propertiesState.data));
  }, [propertiesQuery.data, strategyFilterMode]);

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
      if (typeof propertyValue !== 'number' || typeof filterValue !== 'number') {
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
      filterPropertiesByValue(value, fieldName, strategyFilterMode);
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
  const handleBuyBoxChange = (e: SelectChangeEvent<string>) => {
    const nextBuyBoxId = e.target.value;
    const selectedBuyBox = buyBoxesState.data?.find(
      (buyBoxItem) => buyBoxItem.id === nextBuyBoxId
    );

    if (!selectedBuyBox) {
      return;
    }

    dispatch(setBuybox(selectedBuyBox));
    const selectedStrategyFilterMode =
      isMultifamilyBuyBoxValue(selectedBuyBox) ? undefined : strategy;
    filterPropertiesByValue(0, '', selectedStrategyFilterMode);
    router.push({
      pathname: router.pathname,
      query: {
        buybox_id: selectedBuyBox.id
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
              value={buybox?.id || ''}
              label="BuyBox"
              onChange={handleBuyBoxChange}
            >
              {buyBoxesState.data?.map((buyBoxItem) => (
                <MenuItem key={buyBoxItem.id} value={buyBoxItem.id}>
                  {getBuyboxDisplayName(buyBoxItem)}
                  {isMultifamilyBuyBoxValue(buyBoxItem) ? ' • Multifamily' : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      )}

      {!isMultifamilyBuyBox && (
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
      )}
      <div
        id="filters"
        className=" pr-4 pl-2 mb-4 w-full overflow-y-auto overflow-x-hidden"
      >
        {isMultifamilyBuyBox ? (
          <Typography className="font-poppins text-sm text-gray-700 mb-3">
            Multifamily BuyBox selected. ARV/Comps margin filtering is disabled
            for this strategy.
          </Typography>
        ) : strategy === 'ARV' ? (
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
                  'arv25Price'
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
                  'arvPrice'
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
            format={(value) => `${value}`}
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
            format={(value) => `${value}`}
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
            format={(value) => `${value}`}
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
