import React, { useState } from 'react';
import { Paper, Slider, Stack, styled } from '@mui/material';
import Deal from '@/models/deal';
import PropertyCard from '../PropertyCard';

const Panel = styled(Stack)(({ theme }) => ({
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  bottom: 0,
  // left: '50%',
  // marginLeft: 'auto',
  // marginRight: 'auto',
  // width: 'auto',
  width: '100%',
  // height: '15rem',
  overflowX: 'scroll',
  overflowY: 'hidden'
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

type CardsPanelProps = {
  deals: Deal[];
  selectedDeal: Deal;
  setSelectedDeal: (deal: Deal) => void;
};

const CardsPanel: React.FC<CardsPanelProps> = (props: CardsPanelProps) => {
  return (
    <Panel direction="row" spacing={2}>
      {props.deals.map((deal: Deal, index: number) => {
        return (
          <PropertyCard
            key={index}
            deal={deal}
            selectedDeal={props.selectedDeal}
            setSelectedDeal={props.setSelectedDeal}
          />
        );
      })}
    </Panel>
  );
};

export default CardsPanel;
