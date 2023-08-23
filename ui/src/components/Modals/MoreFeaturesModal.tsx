import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';
import { Grid } from '@mui/material';
import modal from './Modal.module.scss';

export default function MoreFeaturesModal() {
  return (
    <div>
      <DialogTitle className={modal.modalHeader}>
        Some additional details about the property
      </DialogTitle>
      <Grid className={`${modal.modalSection}`}>
        <DialogContent sx={{ width: '100%' }}>
          <Grid>
            <DialogTitle
              sx={{ pl: 0, pb: 1 }}
              className={modal.modalSubHeaders}
            >
              Interior features
            </DialogTitle>
            <hr />
            <DialogContent
              sx={{
                display: 'grid',
                gridAutoColumns: '1fr',
                gap: 2
              }}
            >
              <Grid
                sx={{ gridRow: '1', gridColumn: '1 / 2', display: 'list-item' }}
              >
                <Typography noWrap>Open Floor Plan</Typography>{' '}
              </Grid>
              <Grid
                sx={{ gridRow: '1', gridColumn: '4 / 5', display: 'list-item' }}
              >
                <Typography noWrap>Walk-in Closets</Typography>{' '}
              </Grid>
              <Grid sx={{ gridRow: '2', gridColumn: 'span 2' }}>Flooring</Grid>
              <Grid sx={{ gridRow: '2', gridColumn: '4 / 5' }}>Wood</Grid>
              <Grid sx={{ gridRow: '3', gridColumn: 'span 2' }}>
                Main Level
              </Grid>
              <Grid
                sx={{ gridRow: '3', gridColumn: '4 / 5' }}
              >{`Bedroom(s), Living Room, Dining Room, Master Bedroom, Full Bath(s), Garage, Kitchen`}</Grid>
            </DialogContent>
          </Grid>
          <Grid>
            <DialogTitle className={modal.epigraphs}>
              Laundry Information
            </DialogTitle>
            <hr />
            <DialogContent
              sx={{
                display: 'grid',
                gridAutoColumns: '1fr',
                gap: 1
              }}
            >
              <Grid sx={{ gridRow: '1', gridColumn: 'span 2' }}>Laundry</Grid>
              <Grid sx={{ gridRow: '1', gridColumn: '4 / 5' }}>
                Inside Room
              </Grid>
            </DialogContent>
          </Grid>
          <Grid>
            <DialogTitle className={modal.epigraphs}>
              Fireplace Information
            </DialogTitle>
            <hr />
            <DialogContent
              sx={{
                display: 'grid',
                gridAutoColumns: '1fr',
                gap: 2
              }}
            >
              <Grid sx={{ gridRow: '1', gridColumn: 'span 2' }}>
                # of Fireplaces
              </Grid>
              <Grid sx={{ gridRow: '1', gridColumn: '4 / 5' }}>1</Grid>
              <Grid sx={{ gridRow: '2', gridColumn: 'span 2' }}>
                Fireplace Features
              </Grid>
              <Grid sx={{ gridRow: '2', gridColumn: '4 / 5' }}>Gas Log</Grid>
            </DialogContent>
          </Grid>
        </DialogContent>
      </Grid>
      <Grid className={`${modal.modalSection}`}>
        <DialogContent sx={{ width: '100%' }}>
          <Grid>
            <DialogTitle className={modal.modalSubHeaders}>
              Exterior Features
            </DialogTitle>
            <hr />
            <DialogContent
              sx={{
                display: 'grid',
                gridAutoColumns: '1fr',
                gap: 2
              }}
            >
              <DialogTitle sx={{ pl: 0, pb: 1 }}>
                <Typography className={modal.epigraphs} noWrap>
                  Building Information
                </Typography>
              </DialogTitle>
              <Grid sx={{ gridRow: '2', gridColumn: 'span 2' }}>
                Construction Materials
              </Grid>
              <Grid sx={{ gridRow: '2', gridColumn: '4 / 5' }}>
                Concrete, Stucco, Frame, Wood
              </Grid>
              <Grid sx={{ gridRow: '3', gridColumn: 'span 2' }}>Remodeled</Grid>
              <Grid sx={{ gridRow: '3', gridColumn: '4 / 5' }}>Unknown</Grid>
              <Grid sx={{ gridRow: '4', gridColumn: 'span 2' }}>Model</Grid>
              <Grid sx={{ gridRow: '4', gridColumn: '4 / 5' }}>Pine Hill</Grid>
              <Grid sx={{ gridRow: '5', gridColumn: 'span 2' }}>Roof</Grid>
              <Grid sx={{ gridRow: '5', gridColumn: '4 / 5' }}>Tile</Grid>
              <Grid sx={{ gridRow: '6', gridColumn: 'span 2' }}>
                Foundation
              </Grid>
              <Grid sx={{ gridRow: '6', gridColumn: '4 / 5' }}>
                Concrete, Slab
              </Grid>
              <Grid sx={{ gridRow: '7', gridColumn: 'span 2' }}>Builder</Grid>
              <Grid sx={{ gridRow: '7', gridColumn: '4 / 5' }}>Del Webb</Grid>
            </DialogContent>
          </Grid>
          <Grid>
            <DialogTitle sx={{ pl: 0, pb: 1 }}>
              <Typography className={modal.epigraphs}>
                Security Features
              </Typography>
            </DialogTitle>
            <DialogContent
              sx={{
                display: 'grid',
                gridAutoColumns: '1fr',
                gap: 2
              }}
            >
              <Grid sx={{ gridRow: '1', display: 'list-item' }}>
                <Typography noWrap>Carbon Mon Detector</Typography>
              </Grid>
              <Grid sx={{ gridRow: '2', display: 'list-item' }}>
                <Typography noWrap>Double Strapped Water Heater</Typography>
              </Grid>
              <Grid sx={{ gridRow: '3', display: 'list-item' }}>
                <Typography noWrap></Typography>Smoke Detector
              </Grid>
            </DialogContent>
          </Grid>
          <Grid>
            <DialogTitle sx={{ pl: 0, pb: 1 }}>
              <Typography className={modal.epigraphs}>
                Pool Information
              </Typography>
            </DialogTitle>
            <DialogContent
              sx={{
                display: 'grid',
                gridAutoColumns: '1fr',
                gap: 2
              }}
            >
              <Grid sx={{ gridRow: '1', gridColumn: 'span 2' }}>
                Pool Available
              </Grid>
              <Grid sx={{ gridRow: '1', gridColumn: '4 / 5' }}>No</Grid>
            </DialogContent>
          </Grid>
          <Grid>
            <DialogTitle sx={{ pl: 0, pb: 1 }}>
              <Typography className={modal.epigraphs}>Utilities</Typography>
            </DialogTitle>
            <DialogContent
              sx={{
                display: 'grid',
                gridAutoColumns: '1fr',
                gap: 2
              }}
            >
              <Grid
                sx={{ gridRow: '1', gridColumn: '1 / 2', display: 'list-item' }}
              >
                <Typography noWrap>Public</Typography>
              </Grid>
              <Grid
                sx={{ gridRow: '1', gridColumn: '4 / 5', display: 'list-item' }}
              >
                <Typography noWrap>Solar</Typography>
              </Grid>
              <Grid sx={{ gridRow: '2', gridColumn: 'span 2' }}>
                Pets Allowed
              </Grid>
              <Grid sx={{ gridRow: '2', gridColumn: '4 / 5' }}>2</Grid>
              <Grid sx={{ gridRow: '3', gridColumn: 'span 2' }}>
                Senior Community
              </Grid>
              <Grid sx={{ gridRow: '3', gridColumn: '4 / 5' }}>Yes</Grid>
              <Grid sx={{ gridRow: '4', gridColumn: 'span 2' }}>
                Electricity
              </Grid>
              <Grid sx={{ gridRow: '4', gridColumn: '4 / 5' }}> 220 Volts</Grid>
              <Grid sx={{ gridRow: '5', gridColumn: 'span 2' }}>
                Association Amenities
              </Grid>
              <Grid sx={{ gridRow: '5', gridColumn: '4 / 5' }}>
                Barb in eque, Pool, Clubhouse, Exercise Court, Recreation
                Facilities, Exercise Room, Game Court Exterior, Spa/Hot Tub,
                Tennis Courts, Trails, Gym, Park
              </Grid>
              <Grid sx={{ gridRow: '6', gridColumn: 'span 2' }}>
                Water Source
              </Grid>
              <Grid sx={{ gridRow: '6', gridColumn: '4 / 5' }}>Public</Grid>
              <Grid sx={{ gridRow: '7', gridColumn: 'span 2' }}>
                Horse Property
              </Grid>
              <Grid sx={{ gridRow: '7', gridColumn: '4 / 5' }}>No</Grid>
              <Grid sx={{ gridRow: '8', gridColumn: 'span 2' }}>
                Irrigation Source
              </Grid>
              <Grid sx={{ gridRow: '8', gridColumn: '4 / 5' }}>None</Grid>
              <Grid sx={{ gridRow: '9', gridColumn: 'span 2' }}>Sewer</Grid>
              <Grid sx={{ gridRow: '9', gridColumn: '4 / 5' }}>
                In & Connected
              </Grid>
            </DialogContent>
          </Grid>
          <Grid>
            <DialogTitle sx={{ pl: 0, pb: 1 }}>
              <Typography className={modal.epigraphs}>
                Green Building Features
              </Typography>
            </DialogTitle>
            <DialogContent
              sx={{
                display: 'grid',
                gridAutoColumns: '1fr',
                gap: 2
              }}
            >
              <Grid sx={{ gridRow: '1', gridColumn: 'span 2' }}>
                Green Verification Year
              </Grid>
              <Grid sx={{ gridRow: '1', gridColumn: '4 / 5' }}>0</Grid>
            </DialogContent>
          </Grid>
        </DialogContent>
      </Grid>
    </div>
  );
}
