import AnalyzedProperty, { FilteredComp } from "@/models/analyzedProperty";
import PropertyPreview from "@/models/propertyPreview";
import {
  useLazyGetLocationDataQuery,
} from "@/store/services/locationApiService";
import { useLazyGetPropertyQuery } from "@/store/services/propertiesApiService";
import { selectFilter } from "@/store/slices/filterSlice";
import {
  setRentalCalculatedProperty,
  setSaleCalculatedProperty,
  setSelectedComps,
  setSelectedProperty,
  setSelectedPropertyLocation,
  setSelectedPropertyPreview,
  setSelectedRentalComps,
} from "@/store/slices/propertiesSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";

export const useProperty = () => {
  const { buybox } = useSelector(selectFilter);
  const [getLocationData, locationState] = useLazyGetLocationDataQuery();
  const [getProperty, propertyState] = useLazyGetPropertyQuery();
  const dispatch = useDispatch();
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const resetSelectedComps = async (property: AnalyzedProperty) => {
    const newSalesComps: FilteredComp[] = property.sales_comps?.data?.map(
      (comp, index) => {
        return { ...comp, index };
      },
    );

    const newRentalComps: FilteredComp[] = property.rents_comps?.data?.map(
      (comp, index) => {
        return { ...comp, index };
      },
    );
    dispatch(setSelectedComps(newSalesComps));
    dispatch(setSelectedRentalComps(newRentalComps));
  };

  const selectPropertyId = async (buybox_id: string, propertyId: string) => {
    try {
      const propertyData: AnalyzedProperty = await getProperty(
        { buybox_id, property_id: propertyId },
      )
        .unwrap();
      if (propertyData) {
        dispatch(
          setSelectedPropertyPreview(
            {
              ...propertyData,
              sales_listing_price: propertyData.listing_price,
            } as PropertyPreview,
          ),
        );
        const location = {
          type: "neighborhood",
          city: propertyData.city,
          state: propertyData.state,
          neighborhood: propertyData.neighborhood,
        };
        const locationData = await getLocationData(location).unwrap();
        dispatch(setSelectedPropertyLocation(locationData));
        dispatch(setSelectedProperty(propertyData));
        dispatch(setSaleCalculatedProperty(propertyData));
        dispatch(setRentalCalculatedProperty(propertyData));
        resetSelectedComps(propertyData);
      }
    } catch (e) {
      enqueueSnackbar("Property not found", { variant: "error" });
      console.log(e);
    }
  };

  const selectProperty = async (property: PropertyPreview) => {
    //TODO: animate before changing route and check auth
    try {
      dispatch(setSelectedPropertyPreview(property));
      const propertyData: AnalyzedProperty = await getProperty(
        buybox
          ? { buybox_id: buybox.id, property_id: property.source_id }
          : skipToken,
      )
        .unwrap();
      if (propertyData) {
        const location = {
          type: "neighborhood",
          city: propertyData.city,
          state: propertyData.state,
          neighborhood: propertyData.neighborhood,
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
            query: { buybox_id: buybox.id, property_id: property.source_id },
          },
          undefined,
          { shallow: true },
        );
      }
    } catch (e) {
      enqueueSnackbar("There was a problem finding this property", {
        variant: "error",
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
    selectPropertyId,
  };
};

export default useProperty;
