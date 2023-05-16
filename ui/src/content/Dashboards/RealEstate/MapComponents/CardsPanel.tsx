import React, { useState, useRef, useEffect } from 'react';
import { Paper, Slider, Stack, styled } from '@mui/material';
import Deal from '@/models/deal';
import PropertyCard from './PropertyCard';
import { useDraggable } from 'react-use-draggable-scroll';

const Panel = styled(Stack)(({ theme }) => ({
  // pointerEvents: 'auto',
  position: 'absolute',
  display: 'flex',
  bottom: 0,
  width: 'auto',
  maxWidth: 'calc(100% - 10rem)',
  transform: 'translateX(-50%)',
  left: '50%',
  padding: '3rem 1rem 0.1rem',
  overflowX: 'scroll',
  '&::-webkit-scrollbar': {
    display: 'none'
    // width: '0.4em'
  },
  '&::-webkit-scrollbar-thumb': {
    // backgroundColor: 'rgba(0,0,0,.5)',
    // borderRadius: '4px'
  }

  // overflowY: 'hidden'
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

const Wrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  margin: '0 auto'
}));

type CardsPanelProps = {
  deals: Deal[];
  selectedDeal: Deal;
  setSelectedDeal: (deal: Deal) => void;
};

const CardsPanel: React.FC<CardsPanelProps> = (props: CardsPanelProps) => {
  const ref = useRef(); // We will use React useRef hook to reference the wrapping div:
  const { events } = useDraggable(ref);
  useEffect(() => {
    const el: any = ref.current;
    if (el) {
      const onWheel = (e) => {
        if (e.deltaY == 0) return;
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY
          // left: e.deltaY < 0 ? -30 : 30,
          // behavior: ''
        });
      };
      el.addEventListener('wheel', onWheel);
      return () => el.removeEventListener('wheel', onWheel);
    }
  }, []);
  return (
    <Panel direction="row" spacing={2} {...events} ref={ref}>
      <Wrapper>
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
      </Wrapper>
    </Panel>
  );
};

export default CardsPanel;
