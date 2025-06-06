import React from "react";
import { Input, Select, SelectItem, Button } from "@nextui-org/react";
import { IEmployeeCreateForm } from "../EmployeeTable/useEmployeTable";

interface EmployeeCreateFormProps {
    onFormChange: <K extends keyof IEmployeeCreateForm>(key: K, value: IEmployeeCreateForm[K]) => void;
    onSubmit: () => void;
    isLoading?: boolean;
    errors?: {
        [key: string]: string;
    };
}

const positions = [
    { label: "사원", value: "STAFF" },
    { label: "대리", value: "ASSISTANT_MANAGER" },
    { label: "과장", value: "MANAGER" },
    { label: "차장", value: "DEPUTY_GENERAL_MANAGER" },
    { label: "부장", value: "GENERAL_MANAGER" },
    { label: "이사", value: "DIRECTOR" },
    { label: "상무", value: "EXECUTIVE_DIRECTOR" },
    { label: "전무", value: "MANAGING_DIRECTOR" },
    { label: "부사장", value: "VICE_PRESIDENT" },
    { label: "사장", value: "PRESIDENT" },
];

export const EmployeeCreateForm: React.FC<EmployeeCreateFormProps> = ({
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
                <h3 className="text-lg font-semibold">기본 정보</h3>
                <Input
                    label="아이디"
                    placeholder="아이디를 입력하세요"
                    onValueChange={(value) => onFormChange("loginId", value)}
                    errorMessage={errors.loginId}
                    isInvalid={!!errors.loginId}
                    isRequired
                />
                <Input
                    label="비밀번호"
                    placeholder="비밀번호를 입력하세요"
                    type="password"
                    onValueChange={(value) => onFormChange("password", value)}
                    errorMessage={errors.password}
                    isInvalid={!!errors.password}
                    isRequired
                />
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">개인 정보</h3>
                <Input
                    label="이름"
                    placeholder="이름을 입력하세요"
                    onValueChange={(value) => onFormChange("name", value)}
                    errorMessage={errors.name}
                    isInvalid={!!errors.name}
                    isRequired
                />
                <Select
                    label="직급"
                    placeholder="직급을 선택하세요"
                    onChange={(e) => onFormChange("position", e.target.value)}
                    errorMessage={errors.position}
                    isInvalid={!!errors.position}
                    isRequired
                >
                    {positions.map((position) => (
                        <SelectItem key={position.value} value={position.value}>
                            {position.label}
                        </SelectItem>
                    ))}
                </Select>
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