import {
  AppBar,
  Autocomplete,
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

import _ from "lodash";
import LoadingButton from "@mui/lab/LoadingButton";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./EditBuyBoxDialog.module.scss";
import InvestmentCriteria from "./InvestmentCriteria";
import PropertyCriteria from "./PropertyCriteria";
import ComparablePreferences from "./ComparablePreferences";
import SimilarityChart from "./SimilarityChart";
import {
  buyboxSchema,
  buyboxSchemaType,
  getDefaults,
} from "@/schemas/BuyBoxSchemas";
import BuyBox from "@/models/buybox";
import {
  useCreateBuyBoxMutation,
  useDeleteBuyBoxMutation,
  useUpdateBuyBoxMutation,
} from "@/store/services/buyboxApiService";
import { useSnackbar } from "notistack";
import {
  useGetLocationsQuery,
  useLazyGetLocationsQuery,
} from "@/store/services/dataApiService";

interface Location {
  "type": string;
  "name": string;
  "identifier": string;
}

type editBuyBoxDialogProps = {
  buybox?: BuyBox;
  showEditBuybox: boolean;
  setShowEditBuybox: (show: boolean) => void;
};

const EditBuyBoxDialog = (props: editBuyBoxDialogProps) => {
  const [createBuyBox, createResult] = useCreateBuyBoxMutation();
  const [updateBuyBox, updateResult] = useUpdateBuyBoxMutation();
  const [deleteBuyBox, deleteResult] = useDeleteBuyBoxMutation();
  const locationsQuery = useGetLocationsQuery(props.buybox?.id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    getValues,
    watch,
    control,
  } = useForm<buyboxSchemaType>({
    // defaultValues: { emailActive: true, email: "meow@meow.com", name: "" },
    resolver: zodResolver(buyboxSchema),
    defaultValues: getDefaults(buyboxSchema),
  });

  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => {
    const viewOnlyBuyBox = props.buybox?.permissions.length === 1 &&
      props.buybox?.permissions[0] === "view";
    if (viewOnlyBuyBox) {
      reset(props.buybox.data);
    }
    props.setShowEditBuybox(false);
  };

  const onSubmit = async (data: any) => {
    console.log("hi");
    console.log(JSON.stringify(data));
    try {
      if (props.buybox) {
        await updateBuyBox({ id: props.buybox.id, data }).unwrap();
        enqueueSnackbar(`BuyBox Saved`, {
          variant: "success",
        });
      } else {
        await createBuyBox(data).unwrap();
        enqueueSnackbar(`BuyBox Created`, {
          variant: "success",
        });
      }
    } catch (error) {
      if (error.status === "FETCH_ERROR") {
        enqueueSnackbar(`Connection error - please try again later`, {
          variant: "error",
        });
      } else {
        enqueueSnackbar(`Error: ${error.data?.message || error.error}`, {
          variant: "error",
        });
      }
    }
    handleClose();
  };

  const handleDelete = async () => {
    try {
      await deleteBuyBox(props.buybox.id).unwrap();
      enqueueSnackbar(`BuyBox Deleted`, {
        variant: "success",
      });
    } catch (error) {
      if (error.status === "FETCH_ERROR") {
        enqueueSnackbar(`Connection error - please try again later`, {
          variant: "error",
        });
      } else {
        enqueueSnackbar(`Error: ${error.data?.message || error.error}`, {
          variant: "error",
        });
      }
    }
    handleClose();
  };

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    handleResetBuyBox();
  }, [props.buybox]);

  const handleResetBuyBox = () => {
    if (props.buybox) {
      const buyboxData = Object.assign({}, props.buybox.data);
      const fullData = _.merge(getDefaults(buyboxSchema), buyboxData);
      fullData.similarity.red = props.buybox.data.similarity.red;
      fullData.similarity.yellow = props.buybox.data.similarity.yellow;
      fullData.similarity.orange = props.buybox.data.similarity.orange;
      fullData.similarity.green = props.buybox.data.similarity.green;
      reset(fullData);
    } else {
      reset(getDefaults(buyboxSchema));
    }
  };

  const handleLocationsChanged = (event: any, value: any) => {
    setValue("target_location.locations", value);
    console.log(getValues("target_location.locations"));
  };

  const getUniqueLocations = (locations: Location[]) => {
    const locationNames = new Set();
    const uniqueLocations = [];
    for (const location of locations) {
      if (!locationNames.has(location.name)) {
        locationNames.add(location.name);
        uniqueLocations.push(location);
      }
    }
    return uniqueLocations;
  };

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
          label="Name"
          variant="outlined"
          {...register("buybox_name")}
          className="mb-4"
        />
        <Typography className={styles.mainLabel}>Description:</Typography>
        <TextField
          label="Description"
          placeholder="Description"
          multiline
          rows={2}
          maxRows={4}
          {...register("description")}
          className="mb-4"
        />

        <Typography className={styles.mainLabel}>Locations:</Typography>
        <Autocomplete
          multiple
          id="tags-outlined"
          options={getUniqueLocations(locationsQuery.data || [])}
          loading={locationsQuery.isFetching}
          getOptionLabel={(option: Location) => String(option.name)}
          filterSelectedOptions
          defaultValue={props.buybox?.data?.target_location?.locations || []}
          // filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Locations"
              placeholder="Locations"
            />
          )}
          onChange={handleLocationsChanged}
        />

        <InvestmentCriteria
          register={register}
          control={control}
          watch={watch}
          setValue={setValue}
          getValues={getValues}
        />

        <PropertyCriteria
          register={register}
          control={control}
          watch={watch}
          setValue={setValue}
          getValues={getValues}
        />

        <ComparablePreferences
          register={register}
          control={control}
          watch={watch}
          setValue={setValue}
          getValues={getValues}
        />

        <SimilarityChart
          register={register}
          control={control}
          watch={watch}
        />

        {/* {<p>{watch("bedrooms.active") ? "active" : "disabled"}</p>} */}
        {/* {<p>{watch("bedrooms.values")}</p>} */}
        {Object.keys(errors).length > 0 && (
          <div className="col-span-2">
            <Typography className="text-red-500">
              {JSON.stringify(errors)}
            </Typography>
          </div>
        )}

        <div className=" col-span-2 flex flex-row-reverse justify-between">
          {(props.buybox && props.buybox.permissions.includes("edit")) ||
              !props.buybox
            ? (
              <div className="flex gap-x-4">
                <Button
                  variant="outlined"
                  className="mt-12 w-20 bg-purple-500 text-white hover:bg-purple-400"
                  style={{ border: "none" }}
                  onClick={handleResetBuyBox}
                >
                  Reset
                </Button>

                <LoadingButton
                  type="submit"
                  variant="outlined"
                  className="mt-12 w-20 bg-purple-500 text-white hover:bg-purple-400"
                  style={{ border: "none" }}
                  loading={isSubmitting}
                >
                  {props.buybox ? "Save" : "Create"}
                </LoadingButton>
              </div>
            )
            : <></>}

          {props.buybox?.permissions.includes("edit") && (
            <LoadingButton
              variant="contained"
              color="error"
              className="mt-12  w-20 bg-red-500"
              loading={deleteResult.isLoading}
              onClick={handleDelete}
            >
              Delete
            </LoadingButton>
          )}
        </div>
      </form>
    </Dialog>
  );
};

export default EditBuyBoxDialog;
