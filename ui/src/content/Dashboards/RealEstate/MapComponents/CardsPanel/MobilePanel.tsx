import { selectFilter } from "@/store/slices/filterSlice";
import { Global } from "@emotion/react";
import {
  Box,
  Skeleton,
  styled,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import PropertyCard from "./PropertyCard";

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

type MobilePanelProps = {};
const MobilePanel = ({}: MobilePanelProps) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const mapContainer = document.getElementById("map");
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;

  const { filteredProperties, strategyMode } = useSelector(selectFilter);

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
            ".MuiBackdrop-root": {},
          }}
        />
        <SwipeableDrawer
          anchor="bottom"
          container={mapContainer}
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          swipeAreaWidth={drawerHeight * 2}
          disableSwipeToOpen={false}
          allowSwipeInChildren={true}
          ModalProps={{
            keepMounted: true,
            BackdropProps: {
              invisible: true,
            },
          }}
          sx={{
            zIndex: 0,
          }}
        >
          <StyledBox
            sx={{
              position: "absolute",
              top: -drawerHeight * 2,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              visibility: "visible",
              right: 0,
              left: 0,
            }}
          >
            <Puller />
            {filteredProperties?.length > 0 && (
              <Typography
                sx={{ p: 2 }}
                className="font-poppins text-gray-500 text-center mt-1"
              >
                {filteredProperties?.length} Home Results
              </Typography>
            )}
          </StyledBox>
          <div className="mt-[-56px] h-full overflow-y-scroll  bg-white">
            <div className="w-full flex flex-col items-center gap-y-6">
              {filteredProperties?.map((property, index) => (
                <div className="w-full px-1 xs:px-4" key={index}>
                  <PropertyCard
                    property={property}
                    selected={false}
                    selectProperty={(property) => {}}
                    deselectProperty={() => {}}
                    setOpenMoreDetails={() => {}}
                  />
                </div>
              ))}
            </div>
          </div>
        </SwipeableDrawer>
      </div>
    )
  );
};

export default MobilePanel;
