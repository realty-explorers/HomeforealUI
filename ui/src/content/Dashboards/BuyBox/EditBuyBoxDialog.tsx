import {
  AppBar,
  Dialog,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useForm } from "react-hook-form";

const EditBuyBoxDialog = () => {
  const [open, setOpen] = useState(true);
  const handleClose = () => setOpen(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    watch,
  } = useForm({
    defaultValues: { emailActive: true, email: "meow@meow.com", name: "" },
  });

  const onSubmit = async (data: any) => {
    alert(JSON.stringify(data));
  };

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full border-4 border-red-400 grid gap-2 grid-cols-[1fr_1.5fr]"
      >
        <Typography>Email</Typography>
        <input type="checkbox" {...register("emailActive")} />
        <input
          {...register("email", {
            disabled: !watch("emailActive"),
            required: "Email is required",
          })}
          type="email"
        />
        <TextField
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          {...register("name")}
        />
        <button type="submit">Submit</button>
        <div className="border-2 border-green-400 ">hello</div>
        <div className="border-2 border-green-400">hello</div>
        <div className="border-2 border-green-400 ">hello</div>
        <div className="border-2 border-green-400">hello</div>
      </form>
    </Dialog>
  );
  // return (

  // );
};

export default EditBuyBoxDialog;
