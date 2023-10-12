import Tab from "@/content/Management/Users/profile/Tab";
import SidebarLayout from "@/layouts/SidebarLayout";
import { SvgIcon, Typography } from "@mui/material";
import styles from "./Settings.module.scss";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import Subscriptions from "@/content/Management/Users/profile/Subscriptions";
import Invoice from "@/content/Management/Users/profile/Invoice";
import UserManagement from "@/content/Management/Users/profile/UserManagement";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import profileAnimation from "@/static/animations/illustrations/profileAnimation.json";

const InvoiceIcon = () => {
  return (
    <SvgIcon>
      <svg
        viewBox="0 0 16 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 8V14M8 14L5 11M8 14L11 11M13 19H3C2.46957 19 1.96086 18.7893 1.58579 18.4142C1.21071 18.0391 1 17.5304 1 17V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H8.586C8.8512 1.00006 9.10551 1.10545 9.293 1.293L14.707 6.707C14.8946 6.89449 14.9999 7.1488 15 7.414V17C15 17.5304 14.7893 18.0391 14.4142 18.4142C14.0391 18.7893 13.5304 19 13 19Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
};

const SubscriptionIcon = () => {
  return (
    <SvgIcon>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17 9C17.5304 9 18.0391 9.21071 18.4142 9.58579C18.7893 9.96086 19 10.4696 19 11V17C19 17.5304 18.7893 18.0391 18.4142 18.4142C18.0391 18.7893 17.5304 19 17 19H3C2.46957 19 1.96086 18.7893 1.58579 18.4142C1.21071 18.0391 1 17.5304 1 17V11C1 10.4696 1.21071 9.96086 1.58579 9.58579C1.96086 9.21071 2.46957 9 3 9V7C3 6.46957 3.21071 5.96086 3.58579 5.58579C3.96086 5.21071 4.46957 5 5 5V3C5 2.46957 5.21071 1.96086 5.58579 1.58579C5.96086 1.21071 6.46957 1 7 1H13C13.5304 1 14.0391 1.21071 14.4142 1.58579C14.7893 1.96086 15 2.46957 15 3V5C15.5304 5 16.0391 5.21071 16.4142 5.58579C16.7893 5.96086 17 6.46957 17 7V9Z" />
        <path
          d="M17 9H3M17 9C17.5304 9 18.0391 9.21071 18.4142 9.58579C18.7893 9.96086 19 10.4696 19 11V17C19 17.5304 18.7893 18.0391 18.4142 18.4142C18.0391 18.7893 17.5304 19 17 19H3C2.46957 19 1.96086 18.7893 1.58579 18.4142C1.21071 18.0391 1 17.5304 1 17V11C1 10.4696 1.21071 9.96086 1.58579 9.58579C1.96086 9.21071 2.46957 9 3 9M17 9V7C17 6.46957 16.7893 5.96086 16.4142 5.58579C16.0391 5.21071 15.5304 5 15 5M3 9V7C3 6.46957 3.21071 5.96086 3.58579 5.58579C3.96086 5.21071 4.46957 5 5 5M15 5V3C15 2.46957 14.7893 1.96086 14.4142 1.58579C14.0391 1.21071 13.5304 1 13 1H7C6.46957 1 5.96086 1.21071 5.58579 1.58579C5.21071 1.96086 5 2.46957 5 3V5M15 5H5"
          stroke="#AAB2C8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
};

const ManagementUserProfile = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="grid grid-cols-2 grid-rows-[auto_1fr] w-full bg-white p-12 gap-x-8 gap-y-4">
      <div className="col-span-2 p-4">
        <Typography className={styles.header}>Settings</Typography>
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <Tab
            icon={<SubscriptionIcon />}
            title="Subscriptions"
            selected={selectedIndex === 0}
            setSelected={() => setSelectedIndex(0)}
          />
          <Tab
            icon={<InvoiceIcon />}
            title="Invoice"
            selected={selectedIndex === 1}
            setSelected={() => setSelectedIndex(1)}
          />
          <Tab
            icon={<PersonIcon />}
            title="User Management"
            selected={selectedIndex === 2}
            setSelected={() => setSelectedIndex(2)}
          />
        </div>
        <div className="flex justify-center grow">
          <Lottie
            animationData={profileAnimation}
            className="w-80"
          />
        </div>
      </div>
      <div className="bg-[#F5F6FA] rounded-lg">
        <motion.div
          key={selectedIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedIndex === 0 && <Subscriptions />}
          {selectedIndex === 1 && <Invoice />}
          {selectedIndex === 2 && <UserManagement />}
        </motion.div>
      </div>
    </div>
  );
};

ManagementUserProfile.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ManagementUserProfile;
