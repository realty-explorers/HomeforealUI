import BuyboxList from '@/content/Dashboards/BuyBox/BuyboxList';
import BuyboxStatus from '@/content/Dashboards/BuyBox/BuyboxStatus';
import EditBuyBoxDialog from '@/content/Dashboards/BuyBox/EditBuyBoxDialog';
import SidebarLayout from '@/layouts/SidebarLayout';
import { Grid } from '@mui/material';

const Buybox = () => {
  return (
    <div className="flex flex-col w-full items-stretch">
      <div className="border border-green-500">
        <BuyboxStatus />
      </div>
      <div className="border-8 border-red-600 h-full overflow-y-auto">
        <BuyboxList />
      </div>
        <EditBuyBoxDialog />
    </div>
  );
};

Buybox.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Buybox;
