import { Typography } from '@mui/material';
import { useState } from 'react';
import clsx from 'clsx';
import AccordionSection from './AccordionSection';
import { useUser } from '@auth0/nextjs-auth0/client';

import styles from './Settings.module.scss';
import UserKyc from './UserKYC';

const UserManagement = () => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  return (
    <div className="flex flex-col p-8">
      <Typography className={styles.section_header}>User Management</Typography>
      <div className="mt-4">
        <UserKyc />
      </div>
    </div>
  );
};

export default UserManagement;
