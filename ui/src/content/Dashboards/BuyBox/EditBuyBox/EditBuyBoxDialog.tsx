import {
  AppBar,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Pagination,
  Slider,
  Switch,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import StepLabel from "@mui/material/StepLabel";

import _ from "lodash";
import { poppins } from "@/components/Fonts";
import LoadingButton from "@mui/lab/LoadingButton";
import CloseIcon from "@mui/icons-material/Close";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { useEffect, useState } from "react";
import { Controller, FieldName, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./EditBuyBoxDialog.module.scss";

import { motion } from "framer-motion";
import InvestmentCriteria from "./InvestmentCriteria";
import ComparablePreferences from "./ComparablePreferences";
import SimilarityChart from "./SimilarityChart";
import {
  buyboxSchema,
  buyboxSchemaType,
  getDefaultData,
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
import clsx from "clsx";
import GeneralSection from "./Sections/GeneralSection";
import InvestmentStrategy from "./Sections/InvestmentStrategy";
import LocationCoverage from "./Sections/LocationCoverage";
import AdjustComparable from "./Sections/AdjustComparable";
import PropertyCriteria from "./Sections/PropertyCriteria";
import {
  ArrowCircleLeftOutlined,
  ArrowCircleRightOutlined,
  ArrowForwardIos,
  ArrowOutwardOutlined,
} from "@mui/icons-material";

interface Location {
  "type": string;
  "name": string;
  "identifier": string;
}

const steps = [
  {
    title: "General",
    fields: ["buybox_name", "description"],
  },
  {
    title: "Investment Strategy",
    fields: ["opp.strategy", "opp.fix_and_flip", "opp.buy_and_hold"],
  },
  {
    title: "Location",
    fields: ["target_location.locations"],
  },
  {
    title: "Property Criteria",
    fields: [
      "property.Listing Price",
      "property.Beds",
      "property.Baths",
      "property.Sqft",
      "property.Lot Size",
      "property.Year Built",
    ],
  },
  {
    title: "Comparables",
    fields: ["opp.comparable_preferences"],
  },
];

type editBuyBoxDialogProps = {
  buybox?: BuyBox;
  showEditBuybox: boolean;
  setShowEditBuybox: (show: boolean) => void;
};

const EditBuyBoxDialog = (props: editBuyBoxDialogProps) => {
  const [activeStep, setActiveStep] = useState(0);
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
    trigger,
  } = useForm<buyboxSchemaType>({
    // defaultValues: { emailActive: true, email: "meow@meow.com", name: "" },
    resolver: zodResolver(buyboxSchema),
    defaultValues: getDefaultData(),
  });

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmitForm = async () => {
    const completeOutput = await trigger();
    if (!completeOutput) {
      enqueueSnackbar(`Some steps are not completed`, {
        variant: "error",
      });
      return;
    }
    await handleSubmit(onSubmit)();
  };

  const handleNextStep = async () => {
    const fields = steps[activeStep].fields;
    const output = await trigger(fields as FieldName[], { shouldFocus: true });
    if (!output) {
      enqueueSnackbar(`Please fill out all required fields`, {
        variant: "error",
      });
      return;
    }
    if (activeStep === steps.length - 1) {
      await handleSubmitForm();
      return;
    }

    if (activeStep < steps.length) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBackStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleClose = () => {
    const viewOnlyBuyBox = props.buybox?.permissions.length === 1 &&
      props.buybox?.permissions[0] === "view";
    if (viewOnlyBuyBox) {
      reset(props.buybox.data);
    }
    props.setShowEditBuybox(false);
  };

  const onSubmit = async (data: any) => {
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
    setActiveStep(0);
  }, [props.buybox]);

  const handleResetBuyBox = () => {
    if (props.buybox) {
      // const buyboxData = Object.assign(getDefaultData());
      const fullData = _.merge(
        {},
        getDefaultData(),
        props.buybox.data,
      );
      reset(fullData);
    } else {
      const defaultData = getDefaultData();
      console.log(defaultData);
      reset(getDefaultData());
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
      className={clsx[poppins.variable]}
    >
      <div className="w-full h-full grid grid-cols-[15rem_1fr]  gap-x-4 overflow-hidden">
        <div className="col-span-2 w-full flex justify-center items-center">
          <IconButton className="absolute top-0 right-0 w-8 h-8 rounded-3xl">
            {/* <CloseOutlinedIcon */}
            {/*   onClick={handleClose} */}
            {/* /> */}
            <HighlightOffOutlinedIcon
              onClick={handleClose}
            />
          </IconButton>
          <DialogTitle
            className={clsx([
              " text-2xl font-bold ",
              styles.font_poppins,
            ])}
          >
            BuyBox Config
          </DialogTitle>
          <Stepper
            nonLinear
            activeStep={activeStep}
            className="grow px-8 bg-transparent"
          >
            {steps.map((step, index) => (
              <Step key={index} className="">
                {/* <StepButton */}
                {/*   color="inherit" */}
                {/*   onClick={() => setActiveStep(index)} */}
                {/*   className={styles.font_poppins} */}
                {/* > */}
                {/*   {step.title} */}
                {/* </StepButton> */}
                <StepLabel
                  className={styles.font_poppins}
                >
                  {step.title}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          {/* <Pagination */}
          {/*   count={steps.length} */}
          {/*   page={activeStep + 1} */}
          {/*   color="primary" */}
          {/* /> */}
        </div>
        <div className="flex flex-col bg-[rgba(151,71,255,0.7)] pb-8">
          {steps.map((step, index) => (
            <Button
              key={index}
              onClick={() => setActiveStep(index)}
              className={clsx([
                " text-white text-xl font-bold  h-24 rounded-[0] px-8 py-4 hover:bg-[#9747FF]",
                styles.font_poppins,
                activeStep === index ? "bg-[#9747FF]" : "bg-transparent",
              ])}
            >
              {steps[index].title}
            </Button>
          ))}
        </div>
        <div className="h-full">
          <form
            className="h-full flex flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <motion.div
              key={activeStep}
              className="grow w-full flex"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeStep === 0 && (
                <GeneralSection
                  register={register}
                  control={control}
                  watch={watch}
                  setValue={setValue}
                  getValues={getValues}
                  errors={errors}
                />
              )}
              {activeStep === 1 &&
                (
                  <InvestmentStrategy
                    register={register}
                    control={control}
                    watch={watch}
                    setValue={setValue}
                    getValues={getValues}
                    errors={errors}
                  />
                )}
              {activeStep === 2 && (
                <LocationCoverage
                  register={register}
                  control={control}
                  watch={watch}
                  setValue={setValue}
                  getValues={getValues}
                />
              )}

              {activeStep === 3 && (
                <PropertyCriteria
                  register={register}
                  control={control}
                  watch={watch}
                  setValue={setValue}
                  getValues={getValues}
                />
              )}
              {activeStep === 4 && (
                <AdjustComparable
                  register={register}
                  control={control}
                  watch={watch}
                  setValue={setValue}
                  getValues={getValues}
                />
              )}
            </motion.div>
            <div className="w-full flex justify-between py-4 px-4">
              {/* {Object.keys(errors).length > 0 && ( */}
              {/*   <div className="col-span-2"> */}
              {/*     <Typography className="text-red-500"> */}
              {/*       {JSON.stringify(errors.buybox_name.message)} */}
              {/*     </Typography> */}
              {/*   </div> */}
              {/* )} */}
              <div className="flex gap-x-2">
                {activeStep === 0 ? <div></div> : (
                  <Button
                    onClick={handleBackStep}
                    className={styles.button}
                  >
                    <ArrowBackIosOutlinedIcon fontSize="small" />
                    Back
                  </Button>
                )}
              </div>

              <div className="flex gap-x-2">
                {(activeStep === steps.length - 1 || props.buybox) && (
                  <LoadingButton
                    onClick={handleSubmitForm}
                    className={styles.button}
                    loading={isSubmitting}
                  >
                    <Typography className={styles.button_text}>
                      {props.buybox ? "Save & Finish" : "Finish"}
                    </Typography>
                  </LoadingButton>
                )}

                {activeStep < steps.length - 1 && (
                  <Button
                    onClick={handleNextStep}
                    className={styles.button}
                  >
                    <Typography className={styles.button_text}>
                      Next
                    </Typography>
                    <ArrowForwardIos className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* <form */}
      {/*   onSubmit={handleSubmit(onSubmit)} */}
      {/*   className="" */}
      {/*   // className="w-full grid gap-2 grid-cols-[15rem_1.5fr] px-36 py-10" */}
      {/* > */}
      {/*   <Typography className={styles.mainLabel}>Name:</Typography> */}
      {/**/}
      {/*   <TextField */}
      {/*     label="Name" */}
      {/*     variant="outlined" */}
      {/*     {...register("buybox_name")} */}
      {/*     className="mb-4" */}
      {/*   /> */}
      {/*   <Typography className={styles.mainLabel}>Description:</Typography> */}
      {/*   <TextField */}
      {/*     label="Description" */}
      {/*     placeholder="Description" */}
      {/*     multiline */}
      {/*     rows={2} */}
      {/*     maxRows={4} */}
      {/*     {...register("description")} */}
      {/*     className="mb-4" */}
      {/*   /> */}
      {/**/}
      {/*   <Typography className={styles.mainLabel}>Locations:</Typography> */}
      {/*   <Autocomplete */}
      {/*     multiple */}
      {/*     id="tags-outlined" */}
      {/*     options={getUniqueLocations(locationsQuery.data || [])} */}
      {/*     loading={locationsQuery.isFetching} */}
      {/*     getOptionLabel={(option: Location) => String(option.name)} */}
      {/*     filterSelectedOptions */}
      {/*     defaultValue={props.buybox?.data?.target_location?.locations || []} */}
      {/*     // filterSelectedOptions */}
      {/*     renderInput={(params) => ( */}
      {/*       <TextField */}
      {/*         {...params} */}
      {/*         label="Locations" */}
      {/*         placeholder="Locations" */}
      {/*       /> */}
      {/*     )} */}
      {/*     onChange={handleLocationsChanged} */}
      {/*   /> */}
      {/**/}
      {/*   <InvestmentCriteria */}
      {/*     register={register} */}
      {/*     control={control} */}
      {/*     watch={watch} */}
      {/*     setValue={setValue} */}
      {/*     getValues={getValues} */}
      {/*   /> */}
      {/**/}
      {/*   <PropertyCriteria */}
      {/*     register={register} */}
      {/*     control={control} */}
      {/*     watch={watch} */}
      {/*     setValue={setValue} */}
      {/*     getValues={getValues} */}
      {/*   /> */}
      {/**/}
      {/*   <ComparablePreferences */}
      {/*     register={register} */}
      {/*     control={control} */}
      {/*     watch={watch} */}
      {/*     setValue={setValue} */}
      {/*     getValues={getValues} */}
      {/*   /> */}
      {/**/}
      {/*   <SimilarityChart */}
      {/*     register={register} */}
      {/*     control={control} */}
      {/*     watch={watch} */}
      {/*   /> */}
      {/**/}
      {/*   {Object.keys(errors).length > 0 && ( */}
      {/*     <div className="col-span-2"> */}
      {/*       <Typography className="text-red-500"> */}
      {/*         {JSON.stringify(errors)} */}
      {/*       </Typography> */}
      {/*     </div> */}
      {/*   )} */}
      {/**/}
      {/*   <div className=" col-span-2 flex flex-row-reverse justify-between"> */}
      {/*     {(props.buybox && props.buybox.permissions.includes("edit")) || */}
      {/*         !props.buybox */}
      {/*       ? ( */}
      {/*         <div className="flex gap-x-4"> */}
      {/*           <Button */}
      {/*             variant="outlined" */}
      {/*             className="mt-12 w-20 bg-purple-500 text-white hover:bg-purple-400" */}
      {/*             style={{ border: "none" }} */}
      {/*             onClick={handleResetBuyBox} */}
      {/*           > */}
      {/*             Reset */}
      {/*           </Button> */}
      {/**/}
      {/*           <LoadingButton */}
      {/*             type="submit" */}
      {/*             variant="outlined" */}
      {/*             className="mt-12 w-20 bg-purple-500 text-white hover:bg-purple-400" */}
      {/*             style={{ border: "none" }} */}
      {/*             loading={isSubmitting} */}
      {/*           > */}
      {/*             {props.buybox ? "Save" : "Create"} */}
      {/*           </LoadingButton> */}
      {/*         </div> */}
      {/*       ) */}
      {/*       : <></>} */}
      {/**/}
      {/*     {props.buybox?.permissions.includes("edit") && ( */}
      {/*       <LoadingButton */}
      {/*         variant="contained" */}
      {/*         color="error" */}
      {/*         className="mt-12  w-20 bg-red-500" */}
      {/*         loading={deleteResult.isLoading} */}
      {/*         onClick={handleDelete} */}
      {/*       > */}
      {/*         Delete */}
      {/*       </LoadingButton> */}
      {/*     )} */}
      {/*   </div> */}
      {/* </form> */}
    </Dialog>
  );
};

export default EditBuyBoxDialog;
