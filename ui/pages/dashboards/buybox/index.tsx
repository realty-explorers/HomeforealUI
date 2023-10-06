import BuyboxList from "@/content/Dashboards/BuyBox/BuyboxList";
import BuyboxStatus from "@/content/Dashboards/BuyBox/BuyboxStatus";
import EditBuyBoxDialog from "@/content/Dashboards/BuyBox/EditBuyBox/EditBuyBoxDialog";
import SidebarLayout from "@/layouts/SidebarLayout";
import { Grid } from "@mui/material";
import { useState } from "react";

const Buybox = () => {
  const [showEditBuyBox, setShowEditBuyBox] = useState(false);
  const [selectedBuyBox, setSelectedBuyBox] = useState(null);

  const editBuyBox = (buybox) => {
    setSelectedBuyBox(buybox);
    setShowEditBuyBox(true);
  };

  return (
    <div className="flex flex-col w-full items-stretch">
      <div className="">
        <BuyboxStatus />
      </div>
      <div className="h-full overflow-y-auto">
        <BuyboxList editBuyBox={editBuyBox} />
      </div>
      <EditBuyBoxDialog
        buybox={selectedBuyBox}
        showEditBuybox={showEditBuyBox}
        setShowEditBuybox={setShowEditBuyBox}
      />
    </div>
  );
};

Buybox.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Buybox;
