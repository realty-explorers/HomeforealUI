import AnalyzedProperty, { FilteredComp } from '@/models/analyzedProperty';
import PropertyPreview from '@/models/propertyPreview';
import { useLazyGetLocationDataQuery } from '@/store/services/locationApiService';
import { useLazyGetPropertyQuery } from '@/store/services/propertiesApiService';
import { selectFilter } from '@/store/slices/filterSlice';
import {
  setRentalCalculatedProperty,
  setSaleCalculatedProperty,
  setSelectedComps,
  setSelectedProperty,
  setSelectedPropertyLocation,
  setSelectedPropertyPreview,
  setSelectedRentalComps
} from '@/store/slices/propertiesSlice';
import { skipToken } from '@reduxjs/toolkit/query';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

export const useProperty = () => {
  const { buybox } = useSelector(selectFilter);
  const [getLocationData, locationState] = useLazyGetLocationDataQuery();
  const [getProperty, propertyState] = useLazyGetPropertyQuery();
  const dispatch = useDispatch();
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const resetSelectedComps = async (property: AnalyzedProperty) => {
    const newSalesComps: FilteredComp[] = property.comps
      .filter((comp) => comp.status === 'sold')
      .map((comp, index) => {
        return { ...comp, index };
      });

    const newRentalComps: FilteredComp[] = property.comps
      .filter((comp) => comp.status === 'for_rent')
      .map((comp, index) => {
        return { ...comp, index };
      });
    dispatch(setSelectedComps(newSalesComps));
    dispatch(setSelectedRentalComps(newRentalComps));
  };

  const selectPropertyId = async (buybox_id: string, propertyId: string) => {
    try {
      const propertyData: AnalyzedProperty = await getProperty({
        buybox_id,
        property_id: propertyId
      }).unwrap();
      if (propertyData) {
        dispatch(
          setSelectedPropertyPreview({
            id: propertyData.id,
            address: propertyData.location.address,
            coordinates: propertyData.location.geometry.coordinates,
            price: propertyData.price,
            arvPrice: propertyData.arvPrice,
            arv25Price: propertyData.arv25Price,
            cap_rate: propertyData.capRate,
            image: propertyData.photos.primary,
            status: propertyData.status,
            propertyType: propertyData.type,
            beds: propertyData.beds,
            baths: propertyData.baths
          } as PropertyPreview)
        );
        const location = {
          type: 'neighborhood',
          city: propertyData.location.city,
          state: propertyData.location.state,
          neighborhood: propertyData.location.neighborhood
        };
        const locationData = await getLocationData(location).unwrap();
        dispatch(setSelectedPropertyLocation(locationData));
        dispatch(setSelectedProperty(propertyData));
        dispatch(setSaleCalculatedProperty(propertyData));
        dispatch(setRentalCalculatedProperty(propertyData));
        resetSelectedComps(propertyData);
      }
    } catch (e) {
      enqueueSnackbar('Property not found', { variant: 'error' });
      console.log(e);
    }
  };

  const selectProperty = async (property: PropertyPreview) => {
    //TODO: animate before changing route and check auth
    try {
      dispatch(setSelectedPropertyPreview(property));
      const propertyData: AnalyzedProperty = await getProperty(
        buybox ? { buybox_id: buybox.id, property_id: property.id } : skipToken
      ).unwrap();
      if (propertyData) {
        const location = {
          type: 'neighborhood',
          city: propertyData.location.city,
          state: propertyData.location.state,
          neighborhood: propertyData.location.neighborhood
        };
        const locationData = await getLocationData(location).unwrap();
        dispatch(setSelectedPropertyLocation(locationData));
        dispatch(setSelectedProperty(propertyData));
        dispatch(setSaleCalculatedProperty(propertyData));
        dispatch(setRentalCalculatedProperty(propertyData));
        resetSelectedComps(propertyData);
        router.push(
          {
            pathname: router.pathname,
            query: { buybox_id: buybox.id, property_id: property.id }
          },
          undefined,
          { shallow: true }
        );
      }
    } catch (e) {
      enqueueSnackbar('There was a problem finding this property', {
        variant: 'error'
      });
      console.log(e);
    }
  };

  const deselectProperty = () => {
    dispatch(setSelectedProperty(null));
    dispatch(setSelectedPropertyPreview(null));
  };

  return {
    selectProperty,
    deselectProperty,
    selectPropertyId
  };
};

export default useProperty;
