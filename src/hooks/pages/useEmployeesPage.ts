import { useEmployeesPageQuery } from '../api/employees';

export const useEmployeesPage = ({
  page,
  pageSize,
  filter
}: {
  page: number,
  pageSize: number,
  filter: Partial<{
    status: 'ALL' | 'ACTIVE' | 'DISABLED'
  }>
}) => {
  const { data, ...others } = useEmployeesPageQuery({
    page,
    size: pageSize,
    status: filter.status || 'ALL'
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
    data: data.content,
    ...others,
    pagination: {
      current: page + 1,
      pageSize,
      totalPage: Math.ceil(data.page.totalElements / pageSize),
      totalElements: data.page.totalElements
    },
  };
};