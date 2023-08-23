import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Skeleton,
  Slider,
  Stack,
  SwipeableDrawer,
  Typography,
  styled
} from '@mui/material';
import ArrowCircleLeftSharpIcon from '@mui/icons-material/ArrowCircleLeftSharp';
import ArrowCircleRightSharpIcon from '@mui/icons-material/ArrowCircleRightSharp';
import Deal from '@/models/deal';
import PropertyCard from './PropertyCard';
import { useDraggable } from 'react-use-draggable-scroll';
import { grey } from '@mui/material/colors';
import { Global } from '@emotion/react';

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
  window?: () => Window;
};

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor:
    theme.palette.mode === 'light'
      ? grey[100]
      : theme.palette.background.default
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800]
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)'
}));
const drawerBleeding = 56;
const CardsPanel: React.FC<CardsPanelProps> = (props: CardsPanelProps) => {
  const ref = useRef(); // We will use React useRef hook to reference the wrapping div:
  const { window } = props;
  const [open, setOpen] = React.useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const container =
    window !== undefined ? () => window().document.body : undefined;
  const { events } = useDraggable(ref);
  const scrollLeft = () => {
    const el: any = ref.current;
    el.scrollTo({
      left: el.scrollLeft - ref.current.offsetWidth,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    const el: any = ref.current;
    el.scrollTo({
      left: el.scrollLeft + ref.current.offsetWidth,
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    const el: any = ref.current;
    if (el) {
      const onWheel = (e) => {
        if (e.deltaY == 0) return;
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY
          // left: e.deltaY < 0 ? -30 : 30,
          // behavior: 'smooth'
        });
      };
      el.addEventListener('wheel', onWheel);
      return () => el.removeEventListener('wheel', onWheel);
    }
  }, []);
  return (
    <>
      <div
        className="absolute sm:flex hidden bottom-0 left-1/2 -translate-x-1/2 "
        style={{ maxWidth: 'calc(100% - 10rem)' }}
      >
        <IconButton onClick={scrollLeft}>
          <ArrowCircleLeftSharpIcon />
        </IconButton>
        {/* <button onClick={scrollLeft}>hi</button> */}
        <div
          {...events}
          ref={ref}
          className="flex max-w-[calc(100%-10rem)]] overflow-x-scroll p-2"
          // style={{ maxWidth: 'calc(100% - 10rem)' }}
        >
          <Wrapper>
            {props.deals?.map((deal: Deal, index: number) => {
              return (
                <PropertyCard
                  key={index}
                  deal={deal}
                  selectedDeal={props.selectedDeal}
                  setSelectedDeal={props.setSelectedDeal}
                  setOpenMoreDetails={() => {}}
                />
              );
            })}
          </Wrapper>
        </div>

        <IconButton onClick={scrollRight}>
          <ArrowCircleRightSharpIcon />
        </IconButton>
      </div>
      <div className="">
        <Global
          styles={{
            '.MuiDrawer-root > .MuiPaper-root': {
              height: `calc(50% - ${drawerBleeding}px)`,
              overflow: 'visible'
            },
            '.MuiBackdrop-root': {
              backgroundColor: 'transparent !important'
              // display: 'none !important'
            }
          }}
        />
        <SwipeableDrawer
          className="h-[calc(50%-56)] overflow-visible sm:hidden"
          container={container}
          anchor="bottom"
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true
          }}
        >
          <StyledBox
            sx={{
              position: 'absolute',
              top: -drawerBleeding,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              visibility: 'visible',
              right: 0,
              left: 0
            }}
          >
            <Puller />
            <Typography sx={{ p: 2, color: 'text.secondary' }}>
              {props.deals?.length ?? 'No'} results
            </Typography>
          </StyledBox>
          <div className="border border-green-400 h-full w-full flex flex-wrap overflow-auto">
            {props.deals?.map((deal: Deal, index: number) => {
              return (
                <div
                  className="w-full xs:w-1/2 flex justify-center p-4"
                  key={index}
                >
                  <PropertyCard
                    deal={deal}
                    selectedDeal={props.selectedDeal}
                    setSelectedDeal={props.setSelectedDeal}
                    setOpenMoreDetails={() => {}}
                  />
                </div>
              );
            })}
          </div>
        </SwipeableDrawer>
      </div>
    </>
  );
};

export default CardsPanel;
