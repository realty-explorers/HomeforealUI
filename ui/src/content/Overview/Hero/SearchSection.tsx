/* eslint-disable react/jsx-no-undef */
import { Button, TextField, Typography } from "@mui/material";
import clsx from "clsx";
import styles from "./LandingPage.module.scss";
import SearchIcon from "@mui/icons-material/Search";

const SearchSection = () => {
  return (
    <div className={clsx([styles.searchSection, "mt-20 w-full"])}>
      <Typography className={styles.searchSectionTitle}>
        defining the future of real estate acquisition
      </Typography>
      <div className="flex h-40 bg-white mx-80 mt-12 rounded-2xl justify-around">
        <div className="flex w-[20%]  justify-center items-center">
          <TextField
            id="standard-basic"
            label="Location"
            variant="standard"
            color="secondary"
          />
        </div>
        <div className="flex w-[20%]  justify-center items-center">
          <TextField
            id="standard-basic"
            label="Investment Type"
            variant="standard"
            color="secondary"
          />
        </div>
        <div className="flex w-[20%]  justify-center items-center">
          <TextField
            id="standard-basic"
            label="Max Price"
            variant="standard"
            color="secondary"
          />
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
