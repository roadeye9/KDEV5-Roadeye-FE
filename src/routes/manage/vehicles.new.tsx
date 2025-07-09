import type { CreateVehicleRequest } from '@/api/vehicle';
import { useVehicleMutation } from '@/hooks/api/vehicle';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader
} from '@nextui-org/react';
import { Car, Hash, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z.object({
    name: z.string().min(1),
    licenseNumber: z.string().min(1),
    mileageInitial: z.number().min(0),
});

const VehicleNewPage = () => {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            licenseNumber: '',
            mileageInitial: 0,
        }
    });

    const { mutate: createVehicle } = useVehicleMutation();

    const onSubmit = (data: z.infer<typeof schema>) => {
        const payload: CreateVehicleRequest = {
            name: data.name,
            licenseNumber: data.licenseNumber,
            mileageInitial: data.mileageInitial * 1000 // km → m
        };

        createVehicle(payload, {
            onSuccess: () => {
                toast.success('차량이 성공적으로 등록되었습니다.');
                navigate('/manage/vehicles');
            },
            onError: () => {
                toast.error('차량 등록에 실패했습니다.');
            }
        });
    };

    const handleClose = () => {
        navigate('/manage/vehicles');
    };

    return (
        <Modal onClose={handleClose} size='2xl' isOpen={true}>
            <ModalContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader className='flex flex-col gap-1'>
                        <div className='flex items-center gap-3'>
                            <Car className='text-blue-500' />
                            <span>차량 등록</span>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <div className='space-y-4'>
                            <Input
                                label='차량 번호'
                                placeholder='차량 번호를 입력하세요'
                                startContent={<Hash className='text-blue-500' />}
                                {...register('licenseNumber')}
                                errorMessage={errors.licenseNumber?.message}
                            />
                            <Input
                                label='차량 이름'
                                placeholder='차량 이름을 입력하세요'
                                {...register('name')}
                                startContent={<Car className='text-blue-500' />}
                                errorMessage={errors.name?.message}
                            />
                            <Input
                                label='주행거리 (km)'
                                type='number'
                                placeholder='주행거리를 입력하세요'
                                {...register('mileageInitial')}
                                startContent={<MapPin className='text-blue-500' />}
                                errorMessage={errors.mileageInitial?.message}
                            />
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>차량 사진</label>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='light' onPress={handleClose}>
                            취소
                        </Button>
                        <Button color='primary' type='submit'>
                            등록
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default VehicleNewPage; 