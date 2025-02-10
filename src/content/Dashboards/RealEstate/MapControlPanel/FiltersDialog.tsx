import {
  AppBar,
  Button,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import MainControls from "../MapControls/MainControls";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type FiltersDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};
const FiltersDialog = ({ open, setOpen }: FiltersDialogProps) => {
  return (
    <Dialog
      keepMounted
      fullScreen
      open={open}
      onClose={() => setOpen(false)}
      TransitionComponent={Transition}
      className="block md:hidden"
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setOpen(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography
            sx={{ ml: 2, flex: 1 }}
            className="font-poppins font-semibold text-white"
          >
            Filters
          </Typography>
          <Button
            autoFocus
            color="inherit"
            onClick={() => setOpen(false)}
          >
            Confirm
          </Button>
        </Toolbar>
      </AppBar>
      <div className="mt-12 px-4">
        <MainControls />
      </div>
    </Dialog>
  );
};

export default FiltersDialog;
