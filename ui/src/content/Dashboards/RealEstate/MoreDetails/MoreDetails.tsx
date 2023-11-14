import { useDispatch } from "react-redux";
import RentComps from "../../Analytics/CompsSection/RentComps";
import SalesComps from "../../Analytics/CompsSection/SalesComps";
import ExpensesCalculator from "../../Analytics/Expenses/ExpensesCalculator";
import PropertyFacts from "../../Analytics/PropertyFacts";
import PropertyHeader from "../../Analytics/PropertyHeader";
import RentComparable from "../../Analytics/RentComparable";
import SaleComparable from "../../Analytics/SaleComparable";
import SaleComparableIndicators from "../../Analytics/SaleComparableIndicators";
import OperationalExpenses from "@/content/Dashboards/Analytics/Expenses/OperationalExpenses";

type MoreDetailsProps = {
  selectedProperty: any;
  selectedComps: any;
  selectedRentalComps: any;
  setSelectedRentalComps: any;
};
const MoreDetails = (
  {
    selectedProperty,
    selectedComps,
    selectedRentalComps,
    setSelectedRentalComps,
  }: MoreDetailsProps,
) => {
  return selectedProperty
    ? (
      <>
        <PropertyHeader property={selectedProperty} />
        {/* <PropertyFeatures property={selectedProperty} /> */}
        {/* <EnvironmentalIndicators property={selectedProperty} /> */}
        {/* <OwnershipInfo property={selectedProperty} /> */}
        <div className="mt-4 relative">
          {/* <SaleComparableIndicators property={selectedProperty} /> */}
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
    )
    : <></>;
};

export default MoreDetails;
