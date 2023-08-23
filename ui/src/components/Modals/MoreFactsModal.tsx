import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from '@mui/material';
import { Typography } from '@mui/material';
import modal from './Modal.module.scss';

export default function MoreFactsModal() {
  return (
    <div>
      <DialogTitle className={modal.modalHeader}>
        Additional Information
      </DialogTitle>
      <Grid className={`${modal.modalSection}`}>
        <DialogContent
          sx={{
            width: '100%'
          }}
        >
          <Grid>
            <DialogContent
              sx={{
                display: 'grid',
                gridAutoColumns: '1fr',
                gap: 2
              }}
            >
              <Grid sx={{ gridRow: '1', gridColumn: 'span 2' }}>
                Days on Market
              </Grid>
              <Grid sx={{ gridRow: '1', gridColumn: '4 / 5' }}>30</Grid>
              <Grid
                sx={{ gridRow: '2', gridColumn: 'span 2' }}
              >{`APN (Assessor's Parcel Number)`}</Grid>
              <Grid sx={{ gridRow: '2', gridColumn: '4 / 5' }}>
                123-456-789
              </Grid>
            </DialogContent>
          </Grid>
          <Grid>
            <DialogTitle sx={{ pl: 0, pb: 1 }}>
              <Typography className={modal.epigraphs} noWrap>
                HOA dues
              </Typography>
            </DialogTitle>
            <DialogContent
              sx={{
                display: 'grid',
                gridAutoColumns: '1fr',
                gap: 2
              }}
            >
              <Grid sx={{ gridRow: '1', gridColumn: 'span 2' }}>HOA Fee</Grid>
              <Grid sx={{ gridRow: '1', gridColumn: '4 / 5' }}>$250</Grid>
              <Grid sx={{ gridRow: '2', gridColumn: 'span 2' }}>
                HOA Fee Schedule
              </Grid>
              <Grid sx={{ gridRow: '2', gridColumn: '4 / 5' }}>Quarterly</Grid>
              <Grid sx={{ gridRow: '3', gridColumn: 'span 2' }}>
                Association
              </Grid>
              <Grid sx={{ gridRow: '3', gridColumn: '4 / 5' }}>
                MetroList Services, Inc.
              </Grid>
              <Grid sx={{ gridRow: '4', gridColumn: 'span 2' }}>
                Association Mandatory
              </Grid>
              <Grid sx={{ gridRow: '4', gridColumn: '4 / 5' }}>Yes</Grid>
              <Grid sx={{ gridRow: '5', gridColumn: 'span 2' }}>
                HOA Available
              </Grid>
              <Grid sx={{ gridRow: '5', gridColumn: '4 / 5' }}>Yes</Grid>
              <Grid sx={{ gridRow: '6', gridColumn: 'span 2' }}>
                Association Fee Includes
              </Grid>
              <Grid sx={{ gridRow: '6', gridColumn: '4 / 5' }}>
                Management, Common Areas, Pool, Maintenance
              </Grid>
              <Grid sx={{ gridRow: '7', gridColumn: 'span 2' }}>HOA Name</Grid>
              <Grid sx={{ gridRow: '7', gridColumn: '4 / 5' }}>
                Sun City Lincoln Hills Community Association
              </Grid>
            </DialogContent>
          </Grid>
        </DialogContent>
      </Grid>
    </div>
  );
}
