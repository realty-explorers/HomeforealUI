import useProperty from "@/hooks/useProperty";
import PropertyPreview from "@/models/propertyPreview";
import { selectFilter } from "@/store/slices/filterSlice";
import { Global } from "@emotion/react";
import {
  Box,
  Skeleton,
  styled,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { memo, useState } from "react";
import { useSelector } from "react-redux";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import PropertyCard from "./PropertyCard";
import { useDrag } from "@use-gesture/react";
import { a, config, useSpring } from "@react-spring/web";
import styles from "./MobilePanel.module.scss";

// const drawerBleeding = 56;
const drawerBleeding = 112;
const drawerHeight = 56;
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: "white",
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: "#9B51E0",
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

type MobilePanelProps = {
  sortedProperties: PropertyPreview[];
};
const MobilePanel = ({ sortedProperties }: MobilePanelProps) => {
  // const [open, setOpen] = useState(false);

  const { selectProperty, deselectProperty } = useProperty();

  const handleSelectProperty = (property?: PropertyPreview) => {
    selectProperty(property);
    // setOpen(false);
  };
  //
  const handleDeselectProperty = () => {
    deselectProperty();
  };
  //
  const toggleDrawer = (newOpen: boolean) => () => {
    // setOpen(newOpen);
  };

  const mapContainer = document.getElementById("main");
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;

  const { filteredProperties, strategyMode } = useSelector(selectFilter);

  const Row = ({ index, style }) => {
    return (
      <div style={{ ...style }} className="px-2 py-2">
        <div className="w-full h-full rounded-xl bg-white">
          <PropertyCard
            key={index}
            property={sortedProperties[index]}
            selected={false}
            selectProperty={(property) => handleSelectProperty(property)}
            deselectProperty={() => handleDeselectProperty()}
            setOpenMoreDetails={() => {}}
          />
        </div>
      </div>
    );
  };

  // const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
  //
  // // Set the drag hook and define component movement based on gesture data
  // const bind = useDrag(({ down, movement: [mx, my] }) => {
  //   api.start({ x: down ? mx : 0, y: down ? my : 0, immediate: down });
  // });
  const [scrollTop, setScrollTop] = useState(false);
  const [scrollBottom, setScrollBottom] = useState(false);
  const height = 300;
  const [{ y }, api] = useSpring(() => ({ y: height - 100 }));

  const open = ({ canceled }) => {
    // when cancel is true, it means that the user passed the upwards threshold
    // so we change the spring config to create a nice wobbly effect
    api.start({
      y: 0,
      immediate: false,
      config: canceled ? config.wobbly : config.stiff,
    });
  };
  const close = (velocity = 0) => {
    api.start({
      y: height - 100,
      immediate: false,
      config: { ...config.stiff, velocity },
    });
  };

  const bind = useDrag(
    (
      {
        last,
        velocity: [, vy],
        direction: [, dy],
        offset: [, oy],
        cancel,
        canceled,
      },
    ) => {
      // if the user drags up passed a threshold, then we cancel
      // the drag so that the sheet resets to its open position
      if (scrollTop && dy < 0) cancel();
      if (scrollBottom && dy > 0) cancel();
      if (oy < -70) cancel();

      // when the user releases the sheet, we check whether it passed
      // the threshold for it to close, or if we reset it to its open positino
      if (last) {
        oy > height * 0.5 || (vy > 0.5 && dy > 0)
          ? close(vy)
          : open({ canceled });
      } // when the user keeps dragging, we just move the sheet according to
      // the cursor position
      else api.start({ y: oy, immediate: true });
    },
    {
      from: () => [0, y.get()],
      filterTaps: true,
      bounds: { top: 0 },
      rubberband: true,
      axis: "y",
      enabled: false,
    },
  );

  const display = y.to((py) => (py < height ? "block" : "none"));
  const bgStyle = {
    transform: y.to([0, height], [
      "translateY(-8%) scale(1.16)",
      "translateY(0px) scale(1.05)",
    ]),
    opacity: y.to([0, height], [0.4, 1], "clamp"),
  };

  const handleScroll = (e) => {
    const atTop = e.target.scrollTop === 0;
    const atBottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (atTop) {
      setScrollTop(true);
      console.log("at top");
    } else {
      setScrollTop(false);
    }
    if (atBottom) {
      setScrollBottom(true);
      console.log("at bottom");
    } else {
      setScrollBottom(false);
    }
  };

  return (
    <div className="flex" style={{ overflow: "hidden" }}>
      <a.div className={styles.bg} onClick={() => close()} style={bgStyle}>
      </a.div>
      <div className={styles.actionBtn} onClick={open} />
      <a.div
        className={styles.sheet}
        {...bind()}
        style={{
          display,
          bottom: `calc(-100vh + ${height - 100}px)`,
          y,
          // touchAction: "pan-y",
          overflowY: "auto",
        }}
        onScroll={handleScroll}
      >
        <div className="w-full h-[100rem] bg-red-500">
        </div>
      </a.div>
    </div>
  );

  // Bind it to a component

  // This is used only for the example
  return (
    windowWidth < 768 && filteredProperties?.length > 0 && (
      <div className="flex md:hidden">
        <Global
          styles={{
            ".MuiDrawer-root": {
              // position: "absolute !important",
            },
            ".MuiDrawer-root > .MuiPaper-root": {
              height: `calc(75% - ${drawerHeight}px)`,
              overflow: "visible",
              // marginBottom: drawerHeight,
              // zIndex: 0,
              position: "absolute",
              // top: `100%`,
            },
            ".MuiDrawer-root > .MuiBackdrop-root": {
              // position: "absolute",
            },
            ".MuiDrawer-modal": {
              // position: "static !important",
            },
            ".MuiBackdrop-root": {
              display: "none",
            },
          }}
        />
        <SwipeableDrawer
          anchor="bottom"
          container={mapContainer}
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          disableSwipeToOpen={false}
          swipeAreaWidth={drawerHeight}
          ModalProps={{
            keepMounted: true,
            BackdropProps: {
              invisible: true,
            },
          }}
          sx={{
            zIndex: 2,
          }}
        >
          <StyledBox
            sx={{
              position: "absolute",
              // marginTop: -drawerHeight * 2,
              top: -drawerHeight,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              visibility: "visible",
              right: 0,
              left: 0,
              // borderTop: "30px solid #E5E7EB",
              borderTop: "5px solid #E5E7EB",
            }}
          >
            <Puller />
            {filteredProperties?.length > 0 && (
              <Typography
                sx={{ p: 2 }}
                className="font-poppins text-gray-500 text-center mt-1"
              >
                {sortedProperties?.length} Home Results
                {mapContainer ? "in" : "out"}
              </Typography>
            )}
          </StyledBox>
          <div className="h-full w-full bg-white">
            <AutoSizer>
              {({ height, width }) => (
                <FixedSizeList
                  // ref={listRef}
                  className="List"
                  height={height}
                  itemCount={filteredProperties?.length ?? 0}
                  itemSize={350}
                  layout="vertical"
                  width={width}
                >
                  {Row}
                </FixedSizeList>
              )}
            </AutoSizer>
            {/* <div className="w-full flex flex-col items-center gap-y-6"> */}
            {/*   {filteredProperties?.map((property, index) => ( */}
            {/*     <div className="w-full px-1 xs:px-4" key={index}> */}
            {/*       <PropertyCard */}
            {/*         property={property} */}
            {/*         selected={false} */}
            {/*         selectProperty={(property) => */}
            {/*           handleSelectProperty(property)} */}
            {/*         deselectProperty={() => */}
            {/*           handleDeselectProperty()} */}
            {/*         setOpenMoreDetails={() => {}} */}
            {/*       /> */}
            {/*     </div> */}
            {/*   ))} */}
            {/* </div> */}
          </div>
        </SwipeableDrawer>
      </div>
    )
  );
};

export default memo(MobilePanel);
