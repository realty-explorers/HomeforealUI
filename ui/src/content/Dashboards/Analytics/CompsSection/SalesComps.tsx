import { Box, Button, Card, Grid, Typography } from '@mui/material';
import GridTableField from '@/components/Grid/GridTableField';

import analyticsStyles from '../Analytics.module.scss';
import styles from './CompsSection.module.scss';
import PropertyCard from './PropertyCard';
import CompsCard from './CompsCard';
import CompsProperty from '@/models/comps_property';
import styled from '@emotion/styled';
import TuneIcon from '@mui/icons-material/Tune';
import { Height } from '@mui/icons-material';
import AnalyzedProperty, {
  CompData,
  FilteredComp
} from '@/models/analyzedProperty';
import { useEffect, useState } from 'react';
import CompsFilter from './CompsFilter';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectProperties,
  setSaleCalculatedProperty,
  setSelectedComps,
  setSelectedProperty
} from '@/store/slices/propertiesSlice';
import { useCalculateCompsMutation } from '@/store/services/analysisApi';
import CompsSection from './CompsSection';

type SalesCompsProps = {};
const SalesComps = (props: SalesCompsProps) => {
  const dispatch = useDispatch();
  const { selectedProperty, selectedComps } = useSelector(selectProperties);
  const [calculateComps, compsResult] = useCalculateCompsMutation();
  const soldComps = selectedProperty.comps.filter(
    (comp) => comp.status === 'sold'
  );

  //TODO: handle this
  // const recalculateComps = async (compsIds: string[]) => {
  //   const response = await calculateComps({
  //     "buybox_id": selectedProperty.buybox_id,
  //     "source_id": selectedProperty.source_id,
  //     "list_of_comps": compsIds,
  //     "analysis_comp_name": "flip",
  //   });
  //   if (response.data) {
  //     const newSelectedProperty = response.data as AnalyzedProperty;
  //     dispatch(setSaleCalculatedProperty(newSelectedProperty));
  //   }
  // };

  const setNewSelectedComps = (newSelectedComps: FilteredComp[]) => {
    dispatch(setSelectedComps(newSelectedComps));
    //TODO: handle this
    // recalculateComps(newSelectedComps.map((comp) => comp.source_id));
  };

  return (
    <CompsSection
      comps={soldComps}
      selectedComps={selectedComps}
      setSelectedComps={setNewSelectedComps}
      propertyCard={
        <PropertyCard
          property={selectedProperty}
          compsProperties={selectedComps}
        />
      }
      compCard={
        <CompsCard
          compsProperty={null}
          index={0}
          selected={false}
          toggle={() => {}}
          className={styles.compsCard}
        />
      }
    />
  );
};

export default SalesComps;
