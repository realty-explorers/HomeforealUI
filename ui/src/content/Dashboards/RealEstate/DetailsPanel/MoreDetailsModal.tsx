import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Deal from '@/models/deal';
import { Grid } from '@mui/material';
import PhotoCarousel from './PhotoCarousel';
import PropertiesTable from './PropertiesTable';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  // '& .MuiDialogContent-root': {
  //   padding: theme.spacing(2)
  // },
  // '& .MuiDialogActions-root': {
  //   padding: theme.spacing(1)
  // }
}));

export interface DialogTitleProps {
  deal: Deal;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function MoreDetailsModal(props: DialogTitleProps) {
  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={props.open}
      fullWidth={true}
      maxWidth="lg"
    >
      <DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={6}>
            <PhotoCarousel images={props.deal?.property.images || []} />
          </Grid>
          <Grid item xs={6}>
            <PropertiesTable
              properties={props.deal?.relevantSoldHouses || []}
            />
          </Grid>

          <Grid item xs={6}></Grid>

          <Grid item xs={6}></Grid>
        </Grid>
      </DialogContent>
    </BootstrapDialog>
  );
}
