import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem
} from '@nextui-org/react';

import '@fortawesome/fontawesome-free/css/all.min.css';
import z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';


const schema = z.object({
    loginId: z.string().min(1, { message: '아이디를 입력해주세요.' }),
    password: z.string().min(1, { message: '비밀번호를 입력해주세요.' }),
    name: z.string().min(1, { message: '이름을 입력해주세요.' }),
    position: z.string().min(1, { message: '직책을 선택해주세요.' })
}).required()

function EmployeeRegisterPage() {
    const navigate = useNavigate();
    
    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            loginId: '',
            password: '',
            name: '',
            position: ''
        }
    })

    const onSubmit = (data: z.infer<typeof schema>) => {
        console.log(data);
    }

    const onCancel = () => {
        navigate('/manage/employees');
    }

    return (
        <Modal isOpen={true} onClose={onCancel}>
            <ModalContent>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
                    <ModalHeader className='flex flex-col gap-1'>사용자 등록</ModalHeader>
                    <ModalBody>
                        <Input
                            label='아이디'
                            {...register('loginId')}
                            autoComplete='off'
                            fullWidth
                            isInvalid={!!errors.loginId}
                            errorMessage={errors.loginId?.message}
                        />
                        <Input
                            label='비밀번호'
                            type='password'
                            {...register('password')}
                            autoComplete='off'
                            fullWidth
                            isInvalid={!!errors.password}
                            errorMessage={errors.password?.message}
                        />
                        <Input
                            label='이름'
                            {...register('name')}
                            autoComplete='off'
                            fullWidth
                            isInvalid={!!errors.name}
                            errorMessage={errors.name?.message}
                        />
                        <Select
                            label='직책'
                            placeholder='직책을 선택하세요'
                            {...register('position')}
                            autoComplete='off'
                            isInvalid={!!errors.position}
                            errorMessage={errors.position?.message}
                        >
                            <SelectItem key='normal' value='normal'>
                                일반
                            </SelectItem>
                            <SelectItem key='Administrator' value='Administrator'>
                                관리자
                            </SelectItem>
                        </Select>
                    </ModalBody>
                    <ModalFooter>
                        <Button color='danger' variant='light' onClick={onCancel}>
                            취소
                        </Button>
                        <Button color='primary' type='submit' >
                            저장
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    )
}

export default EmployeeRegisterPage;