import {
  AppBar,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  Slider,
  Switch,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buyboxSchema, buyboxSchemaType, getDefaults } from "./Schemas";
import styles from "./EditBuyBoxDialog.module.scss";
import InvestmentCriteria from "./InvestmentCriteria";
import PropertyCriteria from "./PropertyCriteria";
import ComparablePreferences from "./ComparablePreferences";
import SimilarityChart from "./SimilarityChart";

const data =
  '{"target_location": {"locations": [{"type": "zipcode", "name": "32218", "identifier": "properties_florida"}, {"type": "zipcode", "name": "32256", "identifier": "properties_florida"}, {"type": "zipcode", "name": "32244", "identifier": "properties_florida"}], "area": {"Flood": true}}, "property": {"Property Type": [true, "Single-Family"], "Bedrooms": [true, [0, 10]], "Bathrooms": [true, [0.5, 10]], "Building sqft": [true, [700, 6000]], "Lot sqft": [false, [0, 43560]], "Year Built": [false, [1980, 2023]], "Pool": [false, "With"], "Garages": [false, [1, 4]], "Listing Price": [true, [0, 1000000]]}, "opp": {"Limitations": [false, {"ARV": [false, [50000, 1000000]]}], "Fix & Flip": [true, {"Margin": [true, [0, 150000]], "Cents on $": [true, [0, 0.98]]}], "Buy & Hold": [true, {"Cap Rate": [true, [0, 15]]}]}, "similarity": {"red": {"Same Property Type": false, "Bedrooms": [false, [-3, 3]], "Bathrooms": [false, [-3, 3]], "Building sqft": [false, [-100, 100]], "Year Built": [false, [-50, 50]], "Lot sqft": [false, [-100, 100]], "Same Pool Status": false, "Garages": [false, [-2, 2]], "Distance": [false, 1.5], "Sale Date": [false, 0]}, "orange": {"Same Property Type": true, "Bedrooms": [true, [-2, 2]], "Bathrooms": [true, [-2.5, 2.5]], "Year Built": [false, [-30, 30]], "Building sqft": [true, [-20, 20]], "Lot sqft": [false, [-30, 30]], "Same Pool Status": false, "Garages": [false, [-2, 2]], "Distance": [true, 1], "Sale Date": [true, 9]}, "yellow": {"Same Property Type": true, "Bedrooms": [true, [-1, 1]], "Bathrooms": [true, [-1.5, 1.5]], "Year Built": [false, [-15, 15]], "Building sqft": [true, [-15, 15]], "Lot sqft": [false, [-20, 20]], "Same Pool Status": false, "Garages": [false, [-2, 2]], "Distance": [true, 0.5], "Sale Date": [true, 6]}, "green": {"Same Property Type": true, "Bedrooms": [true, [0, 0]], "Bathrooms": [true, [-0.5, 0.5]], "Year Built": [false, [-10, 10]], "Building sqft": [true, [-7.5, 7.5]], "Lot sqft": [false, [-15, 15]], "Same Pool Status": false, "Garages": [false, [-2, 2]], "Distance": [true, 0.25], "Sale Date": [true, 3]}}, "similarity_weights": {"red": 0.1, "orange": 0.3, "yellow": 0.8, "green": 1}, "buybox_id": "3dbf8068-bfda-4422-af27-7597045dac6e", "description": "", "buybox_name": "Florida Main"}';

type editBuyBoxDialogProps = {
  showEditBuybox: boolean;
  setShowEditBuybox: (show: boolean) => void;
};

const EditBuyBoxDialog = (props: editBuyBoxDialogProps) => {
  const handleClose = () => props.setShowEditBuybox(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    watch,
    control,
  } = useForm<buyboxSchemaType>({
    // defaultValues: { emailActive: true, email: "meow@meow.com", name: "" },
    resolver: zodResolver(buyboxSchema),
    defaultValues: getDefaults(buyboxSchema),
  });

  const onSubmit = async (data: any) => {
    alert(JSON.stringify(data));
  };

  useEffect(() => {
    // reset({ name: "meow" });
  }, []);

  return (
    <Dialog
      open={props.showEditBuybox}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle className="font-poppins text-2xl font-bold">
        Buybox Manager
      </DialogTitle>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full grid gap-2 grid-cols-[15rem_1.5fr] px-36 py-10"
      >
        <Typography className={styles.mainLabel}>Name:</Typography>

        <TextField
          label="Outlined"
          variant="outlined"
          {...register("name")}
        />
        <Typography className={styles.mainLabel}>Description:</Typography>
        <TextField
          label="Description"
          placeholder="Description"
          multiline
          rows={2}
          maxRows={4}
          {...register("description")}
        />

        <Typography className={styles.mainLabel}>Locations:</Typography>
        <TextField
          label="Locations"
          placeholder="Locations"
          variant="outlined"
          {...register("locations")}
        />

        <InvestmentCriteria
          register={register}
          control={control}
          watch={watch}
        />

        <PropertyCriteria
          register={register}
          control={control}
          watch={watch}
        />

        <ComparablePreferences
          register={register}
          control={control}
          watch={watch}
        />

        <SimilarityChart
          register={register}
          control={control}
          watch={watch}
        />

        {/* {<p>{watch("bedrooms.active") ? "active" : "disabled"}</p>} */}
        {/* {<p>{watch("bedrooms.values")}</p>} */}

        <Button type="submit" variant="outlined" className="mt-12">
          Submit
        </Button>
      </form>
    </Dialog>
  );
  // return (

  // );
};

export default EditBuyBoxDialog;
