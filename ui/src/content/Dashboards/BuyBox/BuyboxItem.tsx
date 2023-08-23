import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Image from '@/components/Photos/Image';
import { Button, Grid, Typography } from '@mui/material';
import styles from './BuyboxItem.module.scss';
import clsx from 'clsx';

const columns: GridColDef[] = [
  {
    field: 'image',
    headerName: '',
    flex: 2,
    minWidth: 150,
    renderCell: (cellValues) => {
      return (
        <div className="flex flex-1 h-full grow items-center p-2 rounded-md">
          <div className="w-full h-full  flex align-center justify-center">
            <img
              src={cellValues.value}
              alt=""
              className="max-h-full aspect-video"
            />
          </div>
        </div>
      );
    }
  },
  {
    field: 'address',
    headerName: '',
    flex: 1,
    minWidth: 100,
    renderCell: (cellValues) => {
      return (
        <Typography className="text-center">{cellValues.value}</Typography>
      );
    }
  },
  { field: 'opportunity', headerName: 'Opportunity', flex: 1 },

  {
    field: 'askingPrice',
    headerName: 'Asking Price',
    flex: 1,
    minWidth: 100,
    editable: true
  },
  {
    field: 'ARV',
    headerName: 'ARV',
    flex: 1,
    minWidth: 100,
    editable: true
  },

  {
    field: 'NOI',
    headerName: 'NOI',
    flex: 1,
    minWidth: 100,
    editable: true
  },

  {
    field: 'capRate',
    headerName: 'Cap Rate',
    flex: 1,
    minWidth: 100,
    editable: true
  },
  {
    field: 'zipCode',
    headerName: 'Zip Code',
    flex: 1,
    minWidth: 100,
    editable: true
  },
  {
    field: 'note',
    headerName: 'Note',
    flex: 1,
    minWidth: 100,
    editable: true
  },
  {
    field: 'action',
    headerName: '',
    flex: 1,
    minWidth: 120,
    renderCell: (cellValues) => {
      return (
        <Box
          // sx={{
          //   display: 'flex',
          //   justifyItems: 'center',
          //   alignItems: 'center',
          //   height: '100%',
          //   width: '100%',
          //   borderLeft: '1px solid rgba(224, 224, 224, 1)'
          // }}
          className="w-full h-full flex items-center justify-center m-2"
        >
          <Button
            variant="contained"
            className={clsx([
              'bg-secondary',
              'hover:bg-secondary hover:opacity-80'
            ])}
          >
            <Typography className={clsx([styles.buttonText])}>
              Analysis
            </Typography>
          </Button>
        </Box>
      );
    }
  }
];

const rows = [
  {
    id: '1',
    image:
      'https://photos.zillowstatic.com/fp/b312180f50220b7ae1c090b3c3126e81-cc_ft_768.webp',
    address: '123 Main St',
    opportunity: 'Fix & Flip',
    askingPrice: '100000',
    ARV: '200000',
    NOI: '10000',
    capRate: '10',
    zipCode: '12345',
    note: 'note'
  },
  {
    id: '2',
    image:
      'https://photos.zillowstatic.com/fp/b312180f50220b7ae1c090b3c3126e81-cc_ft_768.webp',
    address: '123 Main St',
    opportunity: 'Fix & Flip',
    askingPrice: '100000',
    ARV: '200000',
    NOI: '10000',
    capRate: '10',
    zipCode: '12345',
    note: 'note'
  }
];

const BuyboxItem = () => {
  return (
    <DataGrid
      sx={{
        '*': {
          '.MuiDataGrid-cell': {
            outline: 'none',
            '&:focus': {
              outline: 'none'
            },
            '&:focus-within': {
              outline: 'none'
            }
          }
        }
      }}
      rows={rows}
      columns={columns}
      rowHeight={100}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5
          }
        }
      }}
      pageSizeOptions={[5]}
      checkboxSelection
      disableRowSelectionOnClick
    />
  );
};

export default BuyboxItem;
