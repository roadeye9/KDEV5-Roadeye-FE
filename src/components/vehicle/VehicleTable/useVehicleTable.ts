import { useState } from 'react';
import { Vehicle } from '@/api/vehicle';
import { useVehicleMutation, VEHICLE_QUERY_KEY } from '@/hooks/api/vehicle';
import { queryClient } from '@/app';

interface UseVehicleTableProps {
    length: number;
    size: number;
    page: number;
}

export const useVehicleTable = ({ length, size, page }: UseVehicleTableProps) => {
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Vehicle & { mileageInitial: number }>>({});
    const { mutate, isPending } = useVehicleMutation();

    const handleOpenCreateForm = () => setIsCreateFormOpen(true);
    const handleCloseCreateForm = () => setIsCreateFormOpen(false);

    const handleOnChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            if (!formData.name || !formData.licenseNumber || !formData.mileageInitial) {
                return;
            }

            mutate({
                name: formData.name,
                licenseNumber: formData.licenseNumber,
                imageUrl: formData.imageUrl || '',
                mileageInitial: formData.mileageInitial 
            }, {
                onSuccess: () => {
                    queryClient.refetchQueries({ queryKey: VEHICLE_QUERY_KEY.list({
                        page: page,
                        size: size  
                    })});

                    handleCloseCreateForm();
                    setFormData({});
                }
            })
        } catch (error) {
            console.error('Failed to create vehicle:', error);
        }
    };

    const getEmptyRows = () => {
        const emptyRowCount = size - length;
        return Array(emptyRowCount > 0 ? emptyRowCount : 0).fill({ isEmpty: true });
    };

    return {
        isCreateFormOpen,
        handleOpenCreateForm,
        handleCloseCreateForm,
        handleOnChange,
        handleSubmit,
        getEmptyRows,
        isLoading: isPending
    };
}; 