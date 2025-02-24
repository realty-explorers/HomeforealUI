import Tab from '@/content/Management/Users/profile/Tab';
import SidebarLayout from '@/layouts/SidebarLayout';
import { SvgIcon, Typography } from '@mui/material';
import styles from './Settings.module.scss';
import PersonIcon from '@mui/icons-material/Person';
import { useState } from 'react';
import Invoice from '@/content/Management/Users/profile/Invoice';
import UserManagement from '@/content/Management/Users/profile/UserManagement';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import profileAnimation from '@/static/animations/illustrations/profileAnimation.json';
import UserKyc from '@/content/Management/Users/profile/UserKYC';

const ManagementUserProfile = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="flex w-full">
      <div className="hidden md:grid grid-cols-2 grid-rows-[auto_1fr] w-full bg-white p-12 gap-x-8 gap-y-4">
        <div className="col-span-2 p-4">
          <Typography className={styles.header}>Settings</Typography>
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <Tab
              icon={<SubscriptionsIcon />}
              title="Subscriptions"
              selected={selectedIndex === 0}
              setSelected={() => setSelectedIndex(0)}
            />
            <Tab
              icon={<ReceiptLongIcon />}
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
            {/* <Lottie */}
            {/*   animationData={profileAnimation} */}
            {/*   className="w-80" */}
            {/* /> */}
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
            {selectedIndex === 0 && <UserKyc />}
            {/* {selectedIndex === 1 && <Invoice />} */}
            {selectedIndex === 2 && <UserManagement />}
          </motion.div>
        </div>
      </div>
      <div className="flex md:hidden">
        Please use a larger screen to view this page
      </div>
    </div>
  );
};

ManagementUserProfile.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ManagementUserProfile;
