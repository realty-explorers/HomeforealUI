import React, { useEffect, useMemo, useState } from 'react';
import {
  numberFormatter,
  priceFormatter,
  priceReverseScale,
  priceScale
} from '@/utils/converters';
import {
  selectBuybox,
  selectFilteredProperties,
  setArvMargin,
  setBuybox,
  setFilteredProperties,
  setMaxArea,
  setMaxBaths,
  setMaxBeds,
  setMaxPrice,
  setMinArea,
  setMinBaths,
  setMinBeds,
  setMinPrice,
  setStrategyMode,
  setArv25Margin
} from '@/store/slices/filterSlice';
import debounce from 'lodash.debounce';
import { useDispatch, useSelector } from 'react-redux';
import { locationApiEndpoints } from '@/store/services/locationApiService';
import { selectLocation } from '@/store/slices/locationSlice';
import { useGetPropertiesPreviewsQuery } from '@/store/services/propertiesApiService';
import PropertyPreview from '@/models/propertyPreview';
import { buyBoxApiEndpoints } from '@/store/services/buyboxApiService';
import { useSnackbar } from 'notistack';
import { skipToken } from '@reduxjs/toolkit/query';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import {
  getBuyboxPriceRange,
  isMultifamilyBuyBoxValue
} from './utils/buybox';
import BuyBoxSelect from './sections/BuyBoxSelect';
import StrategyToggle, { StrategyMode } from './sections/StrategyToggle';
import MarginFilter from './sections/MarginFilter';
import RangeFilterRow from './sections/RangeFilterRow';

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
  const [strategy, setStrategy] = useState<StrategyMode>('ARV');

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

  const handleStrategyChange = (next: StrategyMode) => {
    setStrategy(next);
    filterPropertiesByValue(0, '', next);
    dispatch(setStrategyMode(next));
  };

  const handleBuyBoxChange = (nextBuyBoxId: string) => {
    const selectedBuyBox = buyBoxesState.data?.find(
      (buyBoxItem) => buyBoxItem.id === nextBuyBoxId
    );
    if (!selectedBuyBox) return;

    dispatch(setBuybox(selectedBuyBox));
    const selectedStrategyFilterMode = isMultifamilyBuyBoxValue(selectedBuyBox)
      ? undefined
      : strategy;
    filterPropertiesByValue(0, '', selectedStrategyFilterMode);
    router.push({
      pathname: router.pathname,
      query: { buybox_id: selectedBuyBox.id }
    });
  };

  return (
    <div className="w-full font-poppins">
      <div className="absolute top-2 right-4 font-bold">
        {filteredProperties?.length} found
      </div>

      <BuyBoxSelect
        buyboxes={buyBoxesState.data}
        loading={buyBoxesState.isFetching}
        selectedId={buybox?.id || ''}
        onChange={handleBuyBoxChange}
      />

      {!isMultifamilyBuyBox && (
        <StrategyToggle value={strategy} onChange={handleStrategyChange} />
      )}

      {/* No overflow on this inner container — the outer panel handles
          scroll so slider value tooltips (portaled by Radix anyway) and
          info popovers never run into clipping. */}
      <div id="filters" className="pr-4 pl-2 mb-4 w-full space-y-4">
        {isMultifamilyBuyBox ? (
          <p className="text-sm text-gray-700 mb-3">
            Multifamily BuyBox selected. ARV/Comps margin filtering is disabled
            for this strategy.
          </p>
        ) : (
          <MarginFilter
            mode={strategy}
            value={strategy === 'ARV' ? arv : comps}
            onChange={(value) =>
              strategy === 'ARV'
                ? setValue(
                    () => setArv(value),
                    () => dispatch(setArv25Margin(value)),
                    value,
                    'arv25Price'
                  )
                : setValue(
                    () => setComps(value),
                    () => dispatch(setArvMargin(value)),
                    value,
                    'arvPrice'
                  )
            }
          />
        )}

        <RangeFilterRow
          label="Listing Price"
          name="listingPrice"
          min={0}
          max={60}
          step={1}
          value={price}
          format={priceFormatter}
          scale={{ scale: priceScale, reverseScale: priceReverseScale }}
          onChange={(value) =>
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
        />

        <RangeFilterRow
          label="Baths"
          name="baths"
          min={1}
          max={9}
          step={1}
          value={baths}
          onChange={(value) =>
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

        <RangeFilterRow
          label="Beds"
          name="beds"
          min={1}
          max={9}
          step={1}
          value={beds}
          onChange={(value) =>
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
        />

        <RangeFilterRow
          label="Building Sqft"
          name="sqft"
          min={0}
          max={10000}
          step={50}
          value={area}
          format={(v) => `${numberFormatter(v)} sqft`}
          onChange={(value) =>
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
        />
      </div>
    </div>
  );
};

export default MainControls;
