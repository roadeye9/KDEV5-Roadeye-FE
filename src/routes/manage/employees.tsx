import { Employee } from '@/api/auth';
import Pagination from '@/components/common/Pagination';
import { useEmployeesPage } from '@/hooks/pages/useEmployeesPage';
import {
  Button,
  Select,
  SelectItem
} from '@nextui-org/react';
import { User } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import z from 'zod';
import { useState } from 'react';

const statuses = [
  { label: '전체 상태', value: 'ALL' },
  { label: '활성', value: 'ACTIVE' },
  { label: '비활성', value: 'DISABLED' }
] as const;

const filterSchema = z.object({
  status: z.enum(['ALL', 'ACTIVE', 'DISABLED']).default('ALL')
});

const tableHeaders = [
  { label: '번호', key: 'id', width: 'w-16' },
  { label: '이름', key: 'name', width: 'w-24' },
  { label: '아이디', key: 'loginId', width: 'w-24' },
  { label: '직책', key: 'position', width: 'w-24' },
  { label: '상태', key: 'status', width: 'w-24' },
  { label: '생성일', key: 'createdAt', width: 'w-24' },
  { label: '관리', key: 'actions', width: 'w-24' },
] as const;

export const EmployeePage = () => {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [filter, setFilter] = useState<z.infer<typeof filterSchema>>(filterSchema.parse({
    status: 'ALL'
  }));

  return (
    <>
      <div className='h-full flex flex-col bg-gray-50'>
        <header className='border-b bg-white p-4 text-lg font-bold'>사용자 관리</header>

        <EmployeeListHeader
          page={page}
          pageSize={pageSize}
          status={filter.status}
          onStatusChange={(status) => setFilter({ ...filter, status })}
        />

        <div className='flex-1 overflow-y-auto bg-white px-8 py-6'>
          <table className='min-w-full rounded border bg-white shadow'>
            <thead className='bg-gray-100'>
              <tr className='text-sm text-gray-700'>
                {tableHeaders.map((header) => (
                  <th key={header.key} className={`px-4 py-3 text-left font-semibold ${header.width}`}>{header.label}</th>
                ))}
              </tr>
            </thead>
            <EmployeeTableBody
              page={page}
              pageSize={pageSize}
              filter={filter}
            />
          </table>
        </div>

        <EmployeeListPagination
          page={page}
          pageSize={pageSize}
          status={filter.status}
          onPageChange={setPage}
        />
      </div>

      <Outlet />
    </>
  );
};

function EmployeeListHeader({
  page,
  pageSize,
  status,
  onStatusChange
}: {
  page: number,
  pageSize: number,
  status: 'ALL' | 'ACTIVE' | 'DISABLED',
  onStatusChange: (status: 'ALL' | 'ACTIVE' | 'DISABLED') => void
}) {
  const navigate = useNavigate();

  const { pagination } = useEmployeesPage({ page, pageSize, filter: { status } })

  return (
    <section className='border-b bg-white px-8 py-4'>

      <div className='flex flex-wrap items-center justify-between gap-4'>
        <span className='text-lg font-semibold text-gray-800'>
          총 {pagination.totalElements}명
        </span>

        <div className='ml-auto flex items-center gap-3'>
          <Select
            className='w-40'
            selectedKeys={[status]}
            onChange={(e) => onStatusChange(e.target.value as z.infer<typeof filterSchema>['status'])}
            aria-label='상태 필터'
          >
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </Select>
          <Button
            color='primary'
            startContent={<User className='h-4 w-4' />}
            onPress={() => navigate('/manage/employees/register')}
          >
            사용자 등록
          </Button>
        </div>
      </div>
    </section>
  )
}

function EmployeeTableBody({
  page,
  pageSize,
  filter,
}: {
    page: number,
    pageSize: number,
    filter: Partial<{
      status: 'ALL' | 'ACTIVE' | 'DISABLED'
    }>
}) {
  const { data } = useEmployeesPage({ page, pageSize, filter })

  if (data.length === 0) {
    return <EmptyEmployeeRow colSpan={tableHeaders.length} />;
  }

  return (
    <tbody>
      {data.map((emp, index) => (
        <EmployeeTableRow
          key={emp.employeeId}
          employee={emp}
          index={index}
          page={page}
          pageSize={data.length}
        />
      ))}
    </tbody>
  );
}

function EmptyEmployeeRow({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className='py-8 text-center text-gray-400'>
        사용자가 없습니다.
      </td>
    </tr>
  );
}

function EmployeeTableRow({
  employee,
  index,
  page,
  pageSize,
}: {
  employee: Employee,
  index: number,
  page: number,
  pageSize: number,
}) {
  const navigate = useNavigate();

  const handleEditClick = (employee: Employee) => {
    navigate(`/manage/employees/${employee.employeeId}/edit`);
  };

  const trIdx = (page) * pageSize + index + 1;

  return (
    <tr
      className='cursor-pointer border-b last:border-b-0 hover:bg-gray-50'
      onClick={() => handleEditClick(employee)}
    >
      <td className='px-4 py-3 text-center text-gray-500'>
        {trIdx}
      </td>
      <td className='flex items-center gap-2 px-4 py-3'>
        <i className='fas fa-user-circle text-lg text-gray-500' />
        <span>{employee.name}</span>
      </td>
      <td className='px-4 py-3'>{employee.loginId}</td>
      <td className='px-4 py-3'>
        <PositionBadge position={employee.position} />
      </td>
      <td className='px-4 py-3'>
        <StatusBadge status={employee.status} />
      </td>
      <td className='px-4 py-3'>{employee.createdAt?.slice(0, 10)}</td>
      <td className='px-4 py-3'>
        <i
          className='fas fa-edit cursor-pointer'
          onClick={() => handleEditClick(employee)}
        />
      </td>
    </tr>
  );
}

function EmployeeListPagination({
  page,
  pageSize,
  status,
  onPageChange
}: {
  page: number,
  pageSize: number,
  status: 'ALL' | 'ACTIVE' | 'DISABLED',
  onPageChange: (page: number) => void
}) {
  const { pagination } = useEmployeesPage({ page, pageSize, filter: { status } })

  return (
    <Pagination
      currentPage={pagination.current}
      pageSize={pagination.pageSize}
      totalElements={pagination.totalElements}
      onPageChange={(page) => onPageChange(page - 1)}
    />
  )
}

function PositionBadge({ position }: { position: string }) {
  if (position === 'Administrator') {
    return (
      <span className='inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800'>
        관리자
      </span>
    );
  }

  return (
    <span className='inline-block rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800'>
      일반
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'ACTIVE') {
    return (
      <span className='inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700'>
        <span className='inline-block h-1.5 w-1.5 rounded-full bg-green-500'></span>
        활성화
      </span>
    );
  }

  return (
    <span className='inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700'>
      <span className='inline-block h-1.5 w-1.5 rounded-full bg-red-500'></span>
      비활성화
    </span>
  );
}

export default EmployeePage;
