import React, { useState, useRef, useEffect } from 'react';
import Property from '@/models/property';
import { priceFormatter } from '@/utils/converters';
import { Grid, List } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import IconListItem from './IconListItem';

type DetailsPanelProps = {
  property: Property;
};

const DetailsPanel: React.FC<DetailsPanelProps> = (
  props: DetailsPanelProps
) => {
  return (
    <Grid xs={12} sm={12} item display="flex" alignItems="center">
      {/* <h4>{props.deal.property.address}</h4> */}
      <List
        disablePadding
        sx={{
          width: '100%'
        }}
      >
        <IconListItem
          icon={<LocalOfferIcon color="warning" />}
          title="Price"
          value={priceFormatter(props.property.price)}
        />

        <IconListItem
          icon={<LocalOfferIcon color="warning" />}
          title="Price"
          value={priceFormatter(props.property.price)}
        />

        <IconListItem
          icon={<LocalOfferIcon color="warning" />}
          title="Price"
          value={priceFormatter(props.property.price)}
        />

        <IconListItem
          icon={<LocalOfferIcon color="warning" />}
          title="Price"
          value={priceFormatter(props.property.price)}
        />

        <IconListItem
          icon={<LocalOfferIcon color="warning" />}
          title="Price"
          value={priceFormatter(props.property.price)}
        />

        <IconListItem
          icon={<LocalOfferIcon color="warning" />}
          title="Price"
          value={priceFormatter(props.property.price)}
        />
      </List>
    </Grid>
  );
};

export default DetailsPanel;
