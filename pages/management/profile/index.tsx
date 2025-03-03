import Tab from '@/content/Management/Users/profile/Tab';
import SidebarLayout from '@/layouts/SidebarLayout';
import { SvgIcon, Typography } from '@mui/material';
import styles from './Settings.module.scss';
import PersonIcon from '@mui/icons-material/Person';
import { useEffect, useState } from 'react';
import Invoice from '@/content/Management/Users/profile/Invoice';
import UserManagement from '@/content/Management/Users/profile/UserManagement';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import profileAnimation from '@/static/animations/illustrations/profileAnimation.json';
import UserKyc from '@/content/Management/Users/profile/UserKYC';
import { useLazyGetOffersQuery } from '@/store/services/offersApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import PremiumCard from './PremiumCard';

const ManagementUserProfile = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [getOffers, offersState] = useLazyGetOffersQuery();

  useEffect(() => {
    getOffers({});
  }, []);

  if (offersState.isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Your Offers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offersState.data?.offers.map((offer, index) => (
          <div className="group perspective" key={index}>
            <PremiumCard id={offer.analysisId} title="Offer Details" />
          </div>
        ))}
      </div>
    </div>
  );
};

ManagementUserProfile.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ManagementUserProfile;
