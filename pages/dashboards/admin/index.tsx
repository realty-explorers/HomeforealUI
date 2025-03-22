import SidebarLayout from '@/layouts/SidebarLayout';
import * as React from 'react';
import OffersTable from '@/content/Dashboards/Admin/Offers/OffersTable';
import { useSession } from 'next-auth/react';
import RealtorsTable from '@/content/Dashboards/Admin/Realtors/RealtorsTable';

export function AdminPanel() {
  const { data: session } = useSession();

  if (!session?.user?.roles?.includes('admin')) {
    return <div>Unauthorized</div>;
  }
  return (
    <div className="w-full flex flex-col px-4">
      <OffersTable />
      <RealtorsTable />
    </div>
  );
}

AdminPanel.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default AdminPanel;
