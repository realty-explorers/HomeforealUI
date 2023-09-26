/* eslint-disable react/jsx-no-undef */
import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import clsx from "clsx";
import styles from "../LandingPage.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import SelectComponent from "./SelectComponent";


const SearchSection = () => {

  const [location, setLocation] = useState('');
  const [investmentType, setInvestmentType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');




  return (
    <div className={clsx([styles.searchSection, "mt-20 w-full"])}>
      <Typography className={styles.searchSectionTitle}>
        defining the future of real estate acquisition
      </Typography>
      <div className="flex h-40 bg-white mx-48 mt-12 rounded-2xl justify-around">
        <div className="flex w-[20%]  justify-center items-center">
          <SelectComponent selectLabel="Location" value={location} setLocation={setLocation} />
        </div>
        <div className="flex w-[20%] justify-center items-center">
          <SelectComponent selectLabel="Investment Type" value={investmentType} setInvestmentType={setInvestmentType} />
        </div>
        <div className="flex w-[20%]  justify-center items-center">
          <SelectComponent selectLabel="Max Price" value={maxPrice} setMaxPrice={setMaxPrice} />
        </div>
        <div className="flex w-[20%]  justify-center items-center">
          <Button className={styles.searchButton} startIcon={<SearchIcon />}>
            <Typography className={styles.searchButtonTitle}>
              Search
            </Typography>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
