import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardStats } from './DashboardStats';
import { QuickActions } from './QuickActions';
import { RecentActivity } from './RecentActivity';

export const Dashboard: React.FC = () => {
  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 mb-8">Tableau de bord</h2>
      <DashboardStats />
      <QuickActions />
      <RecentActivity />
    </>
  );
};