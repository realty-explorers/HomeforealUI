import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  styled,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import ArrowCircleLeftSharpIcon from "@mui/icons-material/ArrowCircleLeftSharp";
import ArrowCircleRightSharpIcon from "@mui/icons-material/ArrowCircleRightSharp";
import AnalyzedProperty from "@/models/analyzedProperty";
import PropertyCard from "./PropertyCard";
// import { useDraggable } from "react-use-draggable-scroll";
import { grey } from "@mui/material/colors";
import { Global } from "@emotion/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import clsx from "clsx";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { ClockNumber } from "@mui/x-date-pickers/TimeClock/ClockNumber";

const Panel = styled(Stack)(({ theme }) => ({
  // pointerEvents: 'auto',
  position: "absolute",
  display: "flex",
  bottom: 0,
  width: "auto",
  maxWidth: "calc(100% - 10rem)",
  transform: "translateX(-50%)",
  left: "50%",
  padding: "3rem 1rem 0.1rem",
  overflowX: "scroll",
  "&::-webkit-scrollbar": {
    display: "none",
    // width: '0.4em'
  },
  "&::-webkit-scrollbar-thumb": {
    // backgroundColor: 'rgba(0,0,0,.5)',
    // borderRadius: '4px'
  },
  // overflowY: 'hidden'
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Wrapper = styled("div")(({ theme }) => ({
  display: "flex",
  margin: "0 auto",
}));

type CardsPanelProps = {
  properties: AnalyzedProperty[];
  selectedProperty: AnalyzedProperty;
  setSelectedProperty: (property: AnalyzedProperty) => void;
  setHoveredProperty: (property: AnalyzedProperty) => void;
};

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));
const drawerBleeding = 56;
const CardsPanel: React.FC<CardsPanelProps> = (props: CardsPanelProps) => {
  // const ref = useRef(); // We will use React useRef hook to reference the wrapping div:
  const [ref, setRef] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [cardsOpen, setCardsOpen] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [index, setIndex] = useState(0);

  // const toggleDrawer = (newOpen: boolean) => () => {
  //   setOpen(newOpen);
  // };
  // const container = window !== undefined
  //   ? () => window().document.body
  //   : undefined;
  // const { events } = useDraggable(ref);
  const scrollLeft = () => {
    const el: any = ref.current;
    el.scrollTo({
      left: el.scrollLeft - ref.current.offsetWidth,
      behavior: "smooth",
    });
  };
  //
  const scrollRight = () => {
    const el: any = ref.current;
    el.scrollTo({
      left: el.scrollLeft + ref.current.offsetWidth,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    const element = document.querySelector("#meow > div");
    setRef(element);
    if (props.selectedProperty) {
      const selectedPropertyIndex = props.properties?.findIndex(
        (property) => property.source_id === props.selectedProperty?.source_id,
      );
      setIndex(selectedPropertyIndex);
      const scrollObject = {
        left: 230 * selectedPropertyIndex,
      };
      if (Math.abs(selectedPropertyIndex - index) < 10) {
        scrollObject["behavior"] = "smooth";
      }
      element?.scrollTo(scrollObject);
    }

    // const el: any = ref.current;
    // if (props.setSelectedProperty) {
    //   const card = document.getElementById(props.selectedProperty.source_id);
    //   const el: any = ref.current;
    //   if (el) {
    //     el.scrollTo({
    //       left: index * card.scrollWidth,
    //       behavior: "smooth",
    //     });
    //   }
    // }
    // if (el) {
    //   const onWheel = (e) => {
    //     if (e.deltaY == 0) return;
    //     e.preventDefault();
    //     el.scrollTo({
    //       left: el.scrollLeft + e.deltaY,
    //       // left: e.deltaY < 0 ? -30 : 30,
    //       // behavior: 'smooth'
    //     });
    //   };
    //   el.addEventListener("wheel", onWheel);
    //   return () => el.removeEventListener("wheel", onWheel);
    // }
  }, [props.selectedProperty]);

  const handleSelectProperty = (property: AnalyzedProperty, index: number) => {
    props.setSelectedProperty(property);
    ref?.scrollTo({
      left: 230 * index,
      behavior: "smooth",
    });
    // const card = document.getElementById(property.source_id);
    // const el: any = ref.current;
    // if (el) {
    //   el.scrollTo({
    //     left: index * card.scrollWidth,
    //     behavior: "smooth",
    //   });
    // }
  };
  const Column = ({ index, style }) => (
    <div style={{ ...style }} className="px-2 py-2">
      <div className="w-full h-full rounded-xl bg-white">
        <PropertyCard
          key={index}
          property={props.properties?.[index]}
          selectedProperty={props.selectedProperty}
          setSelectedProperty={(property) =>
            handleSelectProperty(property, index)}
          setOpenMoreDetails={() => {}}
          setHoveredProperty={props.setHoveredProperty}
        />
      </div>
    </div>
  );

  const [scrolling, setScrolling] = useState(false);
  const [scrollX, setScrollX] = useState(0);
  const [clientX, setClientX] = useState(0);
  const onMouseDown = (e) => {
    console.log("mousedown");
    setScrolling(true);
    setClientX(e.clientX);
  };

  const onMouseUp = () => {
    console.log("mouseup ");
    setScrolling(false);
  };

  const onMouseMove = (e) => {
    if (scrolling) {
      // setClientX(0);
      const width = e.clientX - clientX + scrollX;
      // setClientX(e.clientX);
      // setScrollX(scrollX + e.clientX - clientX);
      console.log("moving ", width);
      console.log("clientx ", e.clientX);
      console.log("scrollX ", scrollX);
      ref.scrollLeft = -width > 0 ? -width : 0;
      // ref.scrollLeft = scrollX + e.clientX - clientX;
      setScrollX(width);
      // setClientX(e.clientX);
      // ref.scrollLeft = 500;
    }
  };

  // const handleMouseDown = (e) => {
  //   e.preventDefault();
  //   console.log("dragging");
  //   ref.scrollLeft = 0;
  //   console.log(ref);
  // };
  return (
    <div className={clsx(["absolute bottom-0 w-screen h-60 "])}>
      <div className="relative flex w-full h-full">
        <AutoSizer className="w-full">
          {({ height, width }) => (
            <div id="meow">
              <FixedSizeList
                className="List"
                height={height}
                itemCount={props.properties?.length ?? 0}
                itemSize={230}
                layout="horizontal"
                width={width}
              >
                {Column}
              </FixedSizeList>
            </div>
          )}
        </AutoSizer>
      </div>
    </div>
  );

  return (
    <>
      <div
        className={clsx([
          "absolute  hidden bottom-0 left-1/2 -translate-x-1/2 ",
          props.properties?.length > 0 ? "sm:flex" : "hidden",
        ])}
        style={{ maxWidth: "calc(100% - 10rem)" }}
      >
        <IconButton
          className="absolute top-0 left-1/2 -translate-y-full -translate-x-1/2 bg-white w-12 h-4 border border-black"
          style={{ border: "1px dashed black" }}
          onClick={() => setCardsOpen(!cardsOpen)}
        >
          <ExpandMoreIcon
            className={clsx(["transition-all", cardsOpen ? "" : "rotate-180"])}
          />
        </IconButton>
        <IconButton onClick={scrollLeft}>
          <ArrowCircleLeftSharpIcon />
        </IconButton>
        {/* <button onClick={scrollLeft}>hi</button> */}
        <div
          {...events}
          ref={ref}
          className={clsx([
            "flex max-w-[calc(100%-10rem)]] overflow-x-scroll p-2 transition-all duration-300",
            !cardsOpen && "-mb-[100%]",
          ])}
          // style={{ maxWidth: 'calc(100% - 10rem)' }}
        >
          <Wrapper>
            {props.properties?.map(
              (property: AnalyzedProperty, index: number) => {
                return (
                  <PropertyCard
                    key={index}
                    property={property}
                    selectedProperty={props.selectedProperty}
                    setSelectedProperty={(property) =>
                      handleSelectProperty(property, index)}
                    setOpenMoreDetails={() => {}}
                  />
                );
              },
            )}
          </Wrapper>
        </div>

        <IconButton onClick={scrollRight}>
          <ArrowCircleRightSharpIcon />
        </IconButton>
      </div>
      {/* <div className=""> */}
      {/*   <Global */}
      {/*     styles={{ */}
      {/*       ".MuiDrawer-root > .MuiPaper-root": { */}
      {/*         height: `calc(50% - ${drawerBleeding}px)`, */}
      {/*         overflow: "visible", */}
      {/*       }, */}
      {/*       ".MuiBackdrop-root": { */}
      {/*         backgroundColor: "transparent !important", */}
      {/*         // display: 'none !important' */}
      {/*       }, */}
      {/*     }} */}
      {/*   /> */}
      {/*   <SwipeableDrawer */}
      {/*     className="h-[calc(50%-56)] overflow-visible sm:hidden" */}
      {/*     container={container} */}
      {/*     anchor="bottom" */}
      {/*     open={open} */}
      {/*     onClose={toggleDrawer(false)} */}
      {/*     onOpen={toggleDrawer(true)} */}
      {/*     swipeAreaWidth={drawerBleeding} */}
      {/*     disableSwipeToOpen={false} */}
      {/*     ModalProps={{ */}
      {/*       keepMounted: true, */}
      {/*     }} */}
      {/*   > */}
      {/*     <StyledBox */}
      {/*       sx={{ */}
      {/*         position: "absolute", */}
      {/*         top: -drawerBleeding, */}
      {/*         borderTopLeftRadius: 8, */}
      {/*         borderTopRightRadius: 8, */}
      {/*         visibility: "visible", */}
      {/*         right: 0, */}
      {/*         left: 0, */}
      {/*       }} */}
      {/*     > */}
      {/*       <Puller /> */}
      {/*       <Typography sx={{ p: 2, color: "text.secondary" }}> */}
      {/*         {props.properties?.length ?? "No"} results */}
      {/*       </Typography> */}
      {/*     </StyledBox> */}
      {/*     <div className="border border-green-400 h-full w-full flex flex-wrap overflow-auto"> */}
      {/*       {props.properties?.map( */}
      {/*         (property: AnalyzedProperty, index: number) => { */}
      {/*           return ( */}
      {/*             <div */}
      {/*               className="w-full xs:w-1/2 flex justify-center p-4" */}
      {/*               key={index} */}
      {/*             > */}
      {/*               <PropertyCard */}
      {/*                 property={property} */}
      {/*                 selectedProperty={props.selectedProperty} */}
      {/*                 setSelectedProperty={props.setSelectedProperty} */}
      {/*                 setOpenMoreDetails={() => {}} */}
      {/*               /> */}
      {/*             </div> */}
      {/*           ); */}
      {/*         }, */}
      {/*       )} */}
      {/*     </div> */}
      {/*   </SwipeableDrawer> */}
      {/* </div> */}
    </>
  );
};

export default CardsPanel;
