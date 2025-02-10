import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import MoreFactsModal from './MoreFactsModal';
import MoreFeaturesModal from './MoreFeaturesModal';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ModalProps {
  propertySection: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ModalComponent(props: ModalProps) {
  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <Dialog
      open={props.open}
      TransitionComponent={Transition}
      onClose={handleClose}
      aria-describedby="Additional property information"
    >
      {props.propertySection === 'facts' ? (
        <MoreFactsModal />
      ) : (
        props.propertySection === 'features' && <MoreFeaturesModal />
      )}
    </Dialog>
  );
}
