import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import React from "react";

interface VehicleCreateFormProps {
    onFormChange: (field: string, value: string | number) => void;
    onSubmit: () => void;
    isLoading?: boolean;
    errors?: Record<string, string>;
}

export const VehicleCreateForm: React.FC<VehicleCreateFormProps> = ({
    onFormChange,
    onSubmit,
    isLoading = false,
    errors = {}
}) => {
    return (
        <form 
            className="flex flex-col gap-6 p-6" 
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
        >
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">차량 정보</h3>
                <Input
                    label="차량명"
                    placeholder="차량명을 입력하세요"
                    onValueChange={(value) => onFormChange("name", value)}
                    errorMessage={errors.name}
                    isInvalid={!!errors.name}
                    isRequired
                />
                <Input
                    label="번호판"
                    placeholder="번호판을 입력하세요"
                    onValueChange={(value) => onFormChange("licenseNumber", value)}
                    errorMessage={errors.licenseNumber}
                    isInvalid={!!errors.licenseNumber}
                    isRequired
                />
                <Input
                    label="이미지 URL"
                    placeholder="이미지 URL을 입력하세요"
                    onValueChange={(value) => onFormChange("imageUrl", value)}
                    errorMessage={errors.imageUrl}
                    isInvalid={!!errors.imageUrl}
                />
                <Input
                    type="number"
                    label="초기 주행거리"
                    placeholder="초기 주행거리를 입력하세요"
                    onValueChange={(value) => onFormChange("mileageInitial", Number(value))}
                    errorMessage={errors.mileageInitial}
                    isInvalid={!!errors.mileageInitial}
                    isRequired
                />
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <Button
                    type="submit"
                    color="primary"
                    isLoading={isLoading}
                >
                    저장
                </Button>
            </div>
        </form>
    );
}; 