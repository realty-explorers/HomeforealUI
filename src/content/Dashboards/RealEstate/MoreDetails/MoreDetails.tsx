import { useDispatch } from 'react-redux';
import RentComps from '../../Analytics/CompsSection/RentComps';
import SalesComps from '../../Analytics/CompsSection/SalesComps';
import ExpensesCalculator from '../../Analytics/Expenses/ExpensesCalculator';
import PropertyFacts from '../../Analytics/PropertyFacts';
import PropertyHeader from '../../Analytics/PropertyHeader';
import RentComparable from '../../Analytics/RentComparable';
import SaleComparable from '../../Analytics/SaleComparable';
import SaleComparableIndicators from '../../Analytics/SaleComparableIndicators';
import OperationalExpenses from '@/content/Dashboards/Analytics/Expenses/OperationalExpenses';
import MarginInfo from '../../Analytics/PropertyHeader/MarginInfo';
import { usePropertyOffers } from '@/utils/offerUtils';
import { useEffect } from 'react';
import { Tooltip, Box } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { ClipboardCheck } from 'lucide-react';

//test
type MoreDetailsProps = {
  selectedProperty: any;
  selectedComps: any;
  selectedRentalComps: any;
  setSelectedRentalComps: any;
};
const MoreDetails = ({
  selectedProperty,
  selectedComps,
  selectedRentalComps,
  setSelectedRentalComps
}: MoreDetailsProps) => {
  const { hasOffer } = usePropertyOffers();
  // The hook will automatically fetch offers when needed

  const propertyHasOffer = selectedProperty?.propertyId
    ? hasOffer(selectedProperty.propertyId)
    : false;
  return selectedProperty ? (
    <>
      <div className="relative">
        <PropertyHeader property={selectedProperty} />
        {propertyHasOffer && (
          <Tooltip title="You have an offer for this property">
            <Box
              className="bg-orange-400"
              sx={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                borderRadius: '50%',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0px 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              <ClipboardCheck className="text-white" />
            </Box>
          </Tooltip>
        )}
      </div>
      {/* <PropertyFeatures property={selectedProperty} /> */}
      {/* <EnvironmentalIndicators property={selectedProperty} /> */}
      {/* <OwnershipInfo property={selectedProperty} /> */}
      <div className="mt-4 relative">
        <MarginInfo />
        {/* <PropertyDetails */}
        {/*   property={props.property || ({} as AnalyzedProperty)} */}
        {/* /> */}
        <SaleComparableIndicators property={selectedProperty} />
        <PropertyFacts property={selectedProperty} />
        <SaleComparable property={selectedProperty} />
        <SalesComps />
      </div>
      <ExpensesCalculator property={selectedProperty} />
      <div className="mt-8">
        <RentComparable property={selectedProperty} />
        <RentComps />
      </div>
      <OperationalExpenses property={selectedProperty} />
    </>
  ) : (
    <></>
  );
};

export default MoreDetails;
