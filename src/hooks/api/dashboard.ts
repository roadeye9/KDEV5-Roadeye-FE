// hooks/useDashboard.tsx
import { useQuery } from '@tanstack/react-query';

import { getCarIgnitionCount, getDrivingLogMonthlyCount } from '@/api/dashboard';
import { CarIgnitionStatus, EntityLifecycleStatus } from '@/api/vehicle';

// constants/dashboard-query-key.ts
export const DASHBOARD_QUERY_KEY = {
  all: ['dashboard'] as const,
  ignitionCount: (status: 'ON' | 'OFF', lifecycleStatus: 'ACTIVE' | 'DISABLED') =>
    [...DASHBOARD_QUERY_KEY.all, 'ignition-count', status, lifecycleStatus] as const,
  monthlyLogCount: ['dashboard', 'monthlyLogCount'] as const
};

export const useCarIgnitionCount = (
  status: CarIgnitionStatus,
  lifecycleStatus: EntityLifecycleStatus
) => {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY.ignitionCount(status, lifecycleStatus),
    queryFn: () => getCarIgnitionCount(status, lifecycleStatus)
  });
};

export const useDrivingLogMonthlyCount = () => {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY.monthlyLogCount,
    queryFn: getDrivingLogMonthlyCount
  });
};
