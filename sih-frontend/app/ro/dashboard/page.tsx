import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import RegionalOfficeDashboard from '../../../pages/RegionalOfficeDashboard';

function dashboard() {
  return (
    <DashboardLayout>
      <RegionalOfficeDashboard />
    </DashboardLayout>
  );
}

export default dashboard;