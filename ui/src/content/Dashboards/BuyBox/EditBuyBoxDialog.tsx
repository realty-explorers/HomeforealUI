import { AppBar, Dialog, IconButton, Toolbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

const EditBuyBoxDialog = () => {
  const [open, setOpen] = useState(true);
  const handleClose = () => setOpen(false);

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

      <div className="w-full border-4 border-red-400 grid gap-2 grid-cols-2">
        <div className="border-2 border-green-400 ">hello</div>
        <div className="border-2 border-green-400">hello</div>
        <div className="border-2 border-green-400 ">hello</div>
        <div className="border-2 border-green-400">hello</div>
      </div>
    </Dialog>
  );
  // return (

  // );
};

export default EditBuyBoxDialog;
