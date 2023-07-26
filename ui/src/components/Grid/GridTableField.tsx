import { Grid, Typography } from '@mui/material';

type GridTableFieldProps = {
  size?: number;
  fields: {
    className?: string;
    label: string;
  }[];
};
const GridTableField = (props: GridTableFieldProps) => {
  return (
    <Grid item xs={props.size ?? 6}>
      <Grid container columns={props.fields.length}>
        {props.fields.map((field, index) => (
          <Grid item xs={1} key={index}>
            <Typography className={field.className}>{field.label}</Typography>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default GridTableField;
