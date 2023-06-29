import { FC, ChangeEvent, useState } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader
} from '@mui/material';

import Label from '@/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import Property from '@/models/property';
import BulkActions from './BulkActions';
import CompsProperty from '@/models/comps_property';
import { distanceFormatter, priceFormatter } from '@/utils/converters';
import { openGoogleSearch } from '@/utils/windowFunctions';

interface PropertiesTableProps {
  properties: CompsProperty[];
}

const applyFilters = (
  properties: CompsProperty[],
  price: number
): Property[] => {
  return properties.filter((property) => {
    let matches = true;

    if (property.price < price) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (
  properties: CompsProperty[],
  page: number,
  limit: number
): CompsProperty[] => {
  return properties.slice(page * limit, page * limit + limit);
};

const PropertiesTable: FC<PropertiesTableProps> = ({ properties }) => {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const selectedBulkActions = selectedProperties.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<number>(0);

  const handleSelectAllProperties = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedProperties(
      event.target.checked ? properties.map((property) => property.id) : []
    );
  };

  const handleSelectOneProperty = (
    _event: ChangeEvent<HTMLInputElement>,
    propertyId: string
  ): void => {
    if (!selectedProperties.includes(propertyId)) {
      setSelectedProperties((prevSelected) => [...prevSelected, propertyId]);
    } else {
      setSelectedProperties((prevSelected) =>
        prevSelected.filter((id) => id !== propertyId)
      );
    }
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredProperties = applyFilters(properties, filters);
  const paginatedProperties = applyPagination(filteredProperties, page, limit);
  const selectedSomeProperties =
    selectedProperties.length > 0 &&
    selectedProperties.length < properties.length;
  const selectedAllProperties = selectedProperties.length === properties.length;
  const theme = useTheme();

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions />
        </Box>
      )}
      {/* {!selectedBulkActions && (
        <CardHeader
          action={
            <Box width={150}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || 'all'}
                  onChange={handleStatusChange}
                  label="Status"
                  autoWidth
                >
                  {statusOptions.map((statusOption) => (
                    <MenuItem key={statusOption.id} value={statusOption.id}>
                      {statusOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }
          title="Recent Orders"
        />
      )} */}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllProperties}
                  indeterminate={selectedSomeProperties}
                  onChange={handleSelectAllProperties}
                />
              </TableCell> */}
              <TableCell>Address</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Sold Price</TableCell>
              <TableCell>SQFT</TableCell>
              <TableCell>Price to SQFT</TableCell>
              <TableCell>Close Date</TableCell>
              <TableCell>Beds/Baths</TableCell>
              <TableCell>DOM</TableCell>
              <TableCell>Distance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProperties.map((property) => {
              const isCryptoOrderSelected = selectedProperties.includes(
                property.id
              );
              return (
                <TableRow
                  hover
                  key={property.id}
                  selected={isCryptoOrderSelected}
                >
                  {/* <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isCryptoOrderSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneProperty(event, property.id)
                      }
                      value={isCryptoOrderSelected}
                    />
                  </TableCell> */}
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                      onClick={() => {
                        openGoogleSearch(property.address);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {property.address}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {priceFormatter(property.price)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {priceFormatter(property.soldPrice)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {property.area}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {(property.soldPrice / property.area).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {property.soldDate}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {property.beds}/{property.baths}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {/* {property.daysOnMarket} */}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {distanceFormatter(property.distance)}
                    </Typography>
                  </TableCell>
                  {/* <TableCell align="right">
                    <Tooltip title="Edit Order" arrow>
                      <IconButton
                        sx={{
                          '&:hover': {
                            background: theme.colors.primary.lighter
                          },
                          color: theme.palette.primary.main
                        }}
                        color="inherit"
                        size="small"
                      >
                        <EditTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Order" arrow>
                      <IconButton
                        sx={{
                          '&:hover': { background: theme.colors.error.lighter },
                          color: theme.palette.error.main
                        }}
                        color="inherit"
                        size="small"
                      >
                        <DeleteTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={filteredProperties.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

PropertiesTable.propTypes = {
  properties: PropTypes.array.isRequired
};

PropertiesTable.defaultProps = {
  properties: []
};

export default PropertiesTable;
