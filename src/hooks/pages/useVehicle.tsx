import { useVehicleQuery } from '../api/vehicle';

export const useVehicle = ({
  page,
  pageSize,
  filter
}: {
  page: number,
  pageSize: number,
  filter: Partial<{
    status: 'ON' | 'OFF' | 'ALL'
  }>
}) => {
  const { data, ...others } = useVehicleQuery({
    page,
    size: pageSize,
    status: filter.status === 'ALL' ? undefined : filter.status
  });

  if (!data) return {
    data: [],
    ...others,
    pagination: {
      current: page + 1,
      pageSize,
      totalPage: 0,
      totalElements: 0
    },
  };

  return {
    data: data.data,
    ...others,
    pagination: {
      current: page + 1,
      pageSize,
      totalPage: Math.ceil(data.pageInfo.total / pageSize),
      totalElements: data.pageInfo.total
    },
  };
};
