import React, { memo, useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import ArrowCircleLeftSharpIcon from "@mui/icons-material/ArrowCircleLeftSharp";
import ArrowCircleRightSharpIcon from "@mui/icons-material/ArrowCircleRightSharp";
import PropertyPreview from "@/models/propertyPreview";
import PropertyCard from "./PropertyCard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import clsx from "clsx";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useDispatch, useSelector } from "react-redux";
import { selectFilter } from "@/store/slices/filterSlice";
import {
  selectProperties,
  setRentalCalculatedProperty,
  setSaleCalculatedProperty,
  setSelectedProperty,
  setSelectedPropertyPreview,
  setSelecting,
} from "@/store/slices/propertiesSlice";
import { useLazyGetPropertyQuery } from "@/store/services/propertiesApiService";

type CardsPanelProps = {
  open: boolean;
};

const CardsPanel: React.FC<CardsPanelProps> = ({ open }: CardsPanelProps) => {
  const [ref, setRef] = useState<Element | undefined>();
  const [cardsOpen, setCardsOpen] = useState(true);
  const { filteredProperties } = useSelector(selectFilter);
  const { selectedProperty, selectedPropertyPreview } = useSelector(
    selectProperties,
  );
  const [selectedPropertyIndex, setSelectedIndex] = useState(-1);
  const [getProperty, propertyState] = useLazyGetPropertyQuery();
  const dispatch = useDispatch();

  const scrollLeft = () => {
    ref?.scrollTo({
      left: ref.scrollLeft - ref.offsetWidth,
      behavior: "smooth",
    });
  };
  //
  const scrollRight = () => {
    ref?.scrollTo({
      left: ref.scrollLeft + ref.offsetWidth,
      behavior: "smooth",
    });
  };

  const validValue = (value: string | number | undefined) => {
    if (typeof value === "number") {
      return value;
    }
    return 0;
  };

  const sortedProperties = filteredProperties &&
    [...filteredProperties].sort((a, b) => {
      if (!validValue(a.arv_price) && validValue(b.arv_price)) return 1;
      if (validValue(a.arv_price) && !validValue(b.arv_price)) return -1;
      // if (a.arv_price && b.arv_price) {
      const arvPercentageA = (a.arv_price - a.sales_listing_price) /
        a.arv_price;
      const arvPercentageB = (b.arv_price - b.sales_listing_price) /
        b.arv_price;
      return arvPercentageB - arvPercentageA;
      // }
      return 0;
    });

  const handleSelectProperty = (property?: PropertyPreview) => {
    dispatch(setSelectedPropertyPreview(property));
    if (property) {
      fetchPropertyData(property);
    } else {
      dispatch(setSelectedProperty(null));
    }
  };

  const fetchPropertyData = async (property: PropertyPreview) => {
    //TODO: Watch out here for race conditions when internet not stable
    const propertyData = await getProperty(property?.source_id).unwrap();
    dispatch(setSelectedProperty(propertyData));
    dispatch(setSaleCalculatedProperty(propertyData));
    dispatch(setRentalCalculatedProperty(propertyData));
  };

  const [notSelected, setNotSelected] = useState(true);

  useEffect(() => {
    console.log("rerender cards panel2");
    if (selectedPropertyPreview) {
      const selectedPropertyIndex = filteredProperties?.findIndex((property) =>
        property.source_id === selectedPropertyPreview.source_id
      );
      setSelectedIndex(selectedPropertyIndex);
      if (notSelected) {
        setCardsOpen(false);
      }
      setNotSelected(false);
    } else {
      setNotSelected(true);
      setCardsOpen(true);
    }
  }, [filteredProperties, selectedPropertyPreview]);

  useEffect(() => {
    const element = document.querySelector("#list-container > div > div");
    console.log("element", element);
    if (element) {
      console.log("meow");
      const onwheel = (e) => {
        if (e.deltaY == 0) return;
        element.scrollTo({
          left: element.scrollLeft + e.deltaY,
        });
      };
      element.addEventListener("wheel", onwheel);
      return () => element.removeEventListener("wheel", onwheel);
    }

    setRef(element);
  }, [open]);

  let cardsCache = {};

  const Column = ({ index, style }) => {
    return (
      <div style={{ ...style }} className="px-2 py-2">
        <div className="w-full h-full rounded-xl bg-white">
          <PropertyCard
            key={index}
            property={sortedProperties[index]}
            selected={selectedPropertyPreview?.source_id ===
              sortedProperties[index].source_id}
            setSelectedProperty={(property) => handleSelectProperty(property)}
            setOpenMoreDetails={() => {}}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      className={clsx([
        "absolute bottom-0 w-full h-60 transition-[margin] duration-300",
        !cardsOpen && "-mb-48",
      ])}
    >
      <div
        className={clsx([
          "relative flex w-full h-full",
        ])}
      >
        {filteredProperties?.length > 0 && (
          <IconButton
            className="absolute top-0 left-1/2 -translate-y-full -translate-x-1/2 bg-white w-12 h-4 border border-black"
            style={{ border: "1px dashed black" }}
            onClick={() => setCardsOpen(!cardsOpen)}
          >
            <ExpandMoreIcon
              className={clsx([
                "transition-all",
                cardsOpen ? "" : "rotate-180",
              ])}
            />
          </IconButton>
        )}

        <IconButton onClick={scrollLeft}>
          <ArrowCircleLeftSharpIcon />
        </IconButton>
        <div className="w-full h-full" id="list-container" ref={ref}>
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                className="List"
                height={height}
                itemCount={filteredProperties?.length ?? 0}
                itemSize={230}
                layout="horizontal"
                width={width}
              >
                {Column}
              </FixedSizeList>
            )}
          </AutoSizer>
        </div>

        <IconButton onClick={scrollRight}>
          <ArrowCircleRightSharpIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default memo(CardsPanel);
