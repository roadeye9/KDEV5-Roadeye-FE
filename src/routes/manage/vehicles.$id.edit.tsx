import { useVehicleDetailQuery, useVehicleUpdateMutation } from '@/hooks/api/vehicle';
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
import { Car } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import z from 'zod';


const schema = z.object({
    name: z.string().min(1),
});

const VehicleEditPage = ({ id }: { id: number }) => {
    const navigate = useNavigate();

    const { data: vehicle } = useVehicleDetailQuery(id);
    const { mutate: updateVehicle } = useVehicleUpdateMutation();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: vehicle.name
        }
    });

    const onSubmit = (data: z.infer<typeof schema>) => {
        updateVehicle({ id: Number(id), vehicle: data }, {
            onSuccess: () => {
                toast.success('차량이 성공적으로 수정되었습니다.');
                navigate('/manage/vehicles');
            }
        });
    };

    const handleClose = () => {
        navigate('/manage/vehicles');
    };

    return (
        <Modal onClose={handleClose} isOpen={true} size='2xl'>
            <ModalContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader className='flex flex-col gap-1'>
                        <div className='flex items-center gap-3'>
                            <Car className='text-blue-500' />
                            <span>차량 수정</span>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <div className='space-y-4'>
                            <Input
                                label='차량 이름'
                                placeholder='차량 이름을 입력하세요'
                                startContent={<Car className='text-blue-500' />}
                                {...register('name')}
                                errorMessage={errors.name?.message}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='light' onPress={handleClose}>
                            취소
                        </Button>
                        <Button color='primary' type='submit'>
                            수정
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default function () {
    const { id } = useParams<{ id: string }>();

    const vehicleId = Number(id);

    if (isNaN(vehicleId)) {
        throw new Error('Invalid vehicle ID');
    }

    return <VehicleEditPage id={vehicleId} />;
} 