import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { Calendar } from 'lucide-react';

interface EmptyStateProps {
    message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message = '신청 이력이 없습니다.' }) => {
    return (
        <Card className="w-full h-[400px] flex items-center justify-center">
            <CardBody className="flex flex-col items-center gap-4 py-8">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">{message}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        새로운 예약을 등록해보세요.
                    </p>
                </div>
            </CardBody>
        </Card>
    );
};

export default EmptyState; 