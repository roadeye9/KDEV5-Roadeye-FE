import { useEmployeeQuery, useUpdateEmployeeMutation } from '@/hooks/api/employees';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    Switch
} from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import z from 'zod';

const positionOptions = [
    { label: '일반', value: 'normal' },
    { label: '관리자', value: 'Administrator' }
] as const;

const schema = z.object({
    name: z.string().min(1),
    position: z.enum(positionOptions.map((option) => option.value) as [string, ...string[]]),
    status: z.enum(['ACTIVE', 'DISABLED'])
});

function EmployeeEditPage({ employeeId }: { employeeId: number }) {
    const navigate = useNavigate();

    const { data } = useEmployeeQuery(employeeId);

    const {
        getValues,
        setValue,
        register,
        handleSubmit,
        formState: { dirtyFields },
    } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: data.name,
            position: data.position,    
            status: data.status
        }
    });

    const { mutate: updateEmployee } = useUpdateEmployeeMutation(employeeId);

    const onSubmit = (data: z.infer<typeof schema>) => {
        const dirtyOnlyValues = Object.fromEntries(
            Object.entries(data).filter(([key]) => dirtyFields[key as keyof typeof dirtyFields])
        ) as Partial<z.infer<typeof schema>>;

        updateEmployee(dirtyOnlyValues, {
            onSuccess: () => {
                navigate("/manage/employees", { state: { refetch: true } });
            }
        });
    };

    const onCancel = () => {
        navigate("/manage/employees", { state: { refetch: true } });
    }

    return (
        <Modal isOpen={true} onClose={onCancel}>
            <ModalContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader className='flex flex-col gap-1'>사용자 정보 수정</ModalHeader>
                    <ModalBody>
                        <Input
                            label='이름'
                            fullWidth
                            {...register('name')}
                        />
                        <Select
                            label='직책'
                            placeholder='직책을 선택하세요'
                            {...register('position')}
                        >
                            {positionOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </Select>
                        <Switch
                            color='success'
                            isSelected={getValues('status') === 'ACTIVE'}
                            onChange={(event) => {
                                const isSelected = event.target.checked;
                                setValue('status', isSelected ? 'ACTIVE' : 'DISABLED', { shouldDirty: true });
                            }}
                        >
                            {getValues('status') === 'ACTIVE' ? '활성' : '비활성'}
                        </Switch>
                    </ModalBody>
                    <ModalFooter>
                        <Button color='danger' variant='light' onClick={onCancel}>
                            취소
                        </Button>
                        <Button color='primary' type='submit'>
                            저장
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    )
}

export default function () {
    const { id } = useParams();

    const employeeId = Number.parseInt(id ?? '');

    if (isNaN(employeeId)) {
        return <Navigate to="/manage/employees" replace />;
    }

    return <EmployeeEditPage employeeId={employeeId} />;
}