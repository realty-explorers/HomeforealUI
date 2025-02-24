import { useEffect, useState } from 'react';
import AccordionSection from './AccordionSection';
import styles from './Settings.module.scss';
import { useCreateKYCSessionMutation } from '@/store/services/userApi';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const UserKyc = () => {
  const { data, status, update } = useSession();
  const pathname = usePathname();
  const [createKYCSession, kycSessionState] = useCreateKYCSessionMutation();

  useEffect(() => {
    if (status === 'authenticated') {
      update();
    }
  }, []);

  const startKyc = async () => {
    try {
      const userId = data?.user?.id;
      const response = await createKYCSession({
        userId: userId,
        callback: window.location.href
      }).unwrap();
      const kycUrl = response.url;
      window.location.href = kycUrl;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      onClick={startKyc}
      className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
      disabled={kycSessionState.isLoading}
    >
      {kycSessionState.isLoading && <Loader2 className="animate-spin" />}
      Start Verification
    </Button>
  );
};

export default UserKyc;
