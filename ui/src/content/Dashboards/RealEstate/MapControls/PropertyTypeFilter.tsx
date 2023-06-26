import * as React from 'react';
import { Theme, styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import DoneIcon from '@mui/icons-material/Done';
import { Checkbox, Grid, ListItemText } from '@mui/material';
import Property, { PropertyType } from '@/models/property';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const propertyTypeToLabel = {
  [PropertyType.SINGLE_FAMILY]: 'Single Family',
  [PropertyType.MULTI_FAMILY]: 'Multi Family',
  [PropertyType.CONDO]: 'Condos',
  [PropertyType.TOWN_HOUSE]: 'Townhomes',
  [PropertyType.MOBILE_HOUSE]: 'Mobile Homes'
};

const labelToProperty: { [label: string]: PropertyType } = {
  'Single Family': PropertyType.SINGLE_FAMILY,
  'Multi Family': PropertyType.MULTI_FAMILY,
  Condos: PropertyType.CONDO,
  Townhomes: PropertyType.TOWN_HOUSE,
  'Mobile Homes': PropertyType.MOBILE_HOUSE
};

const names = [
  PropertyType.SINGLE_FAMILY,
  PropertyType.MULTI_FAMILY,
  PropertyType.CONDO,
  PropertyType.TOWN_HOUSE,
  PropertyType.MOBILE_HOUSE
];

type PropertyTypeFilterProps = {
  propertyTypes: PropertyType[];
  update: (name: string, value: any) => void;
};

export default function PropertyTypeFilter(props: PropertyTypeFilterProps) {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  function getStyles(name: PropertyType, theme: Theme) {
    return {
      fontWeight:
        props.propertyTypes.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium
    };
  }
  // const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<PropertyType>) => {
    const {
      target: { value }
    } = event;
    const properties =
      // On autofill we get a stringified value.
      typeof value === 'string'
        ? value.split(',').map((label) => labelToProperty[label])
        : value;
    props.update('propertyTypes', properties);
  };

  const handleClicked = (event: React.MouseEvent<HTMLElement>) => {
    const name = event.currentTarget.innerText;
    if (props.propertyTypes.includes(labelToProperty[name])) {
      props.update(
        'propertyTypes',
        props.propertyTypes.filter((type) => type !== labelToProperty[name])
      );
    } else {
      props.update('propertyTypes', [
        ...props.propertyTypes,
        labelToProperty[name]
      ]);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      rowGap={1}
      sx={{ margin: '1rem 0' }}
    >
      {names.map((name) => (
        <Chip
          sx={{ margin: '0 0.5rem' }}
          key={name}
          label={propertyTypeToLabel[name]}
          icon={props.propertyTypes.includes(name) ? <DoneIcon /> : <></>}
          clickable
          color={props.propertyTypes.includes(name) ? 'primary' : 'default'}
          onClick={handleClicked}
        />
      ))}
    </Grid>
    // <FormControl sx={{ m: 1, width: '100%' }}>
    //   <InputLabel id="demo-multiple-chip-label">Property Types</InputLabel>
    //   <Select
    //     labelId="demo-multiple-chip-label"
    //     id="demo-multiple-chip"
    //     multiple
    //     value={props.propertyTypes}
    //     defaultValue={props.propertyTypes}
    //     onChange={handleChange}
    //     input={
    //       <OutlinedInput id="select-multiple-chip" label="Property Types" />
    //     }
    //     renderValue={(selected: any) => (
    //       <Box
    //         sx={{
    //           display: 'flex',
    //           gap: 0.5,
    //           overflowX: 'scroll',
    //           '::-webkit-scrollbar': { display: 'none' }
    //         }}
    //       >
    //         {selected.map((value) => (
    //           <Chip key={value} label={propertyTypeToLabel[value]} />
    //         ))}
    //       </Box>
    //     )}
    //     MenuProps={MenuProps}
    //   >
    //     {names.map((name) => (
    //       <MenuItem key={name} value={name} style={getStyles(name, theme)}>
    //         {/* {name} */}
    //         <Checkbox checked={props.propertyTypes.indexOf(name) > -1} />
    //         <ListItemText primary={propertyTypeToLabel[name]} />
    //       </MenuItem>
    //     ))}
    //   </Select>
    // </FormControl>
  );
}
