import { useCurrentTime } from '@/hooks/useCurrentTime';
import { Clock, MapPin } from 'lucide-react';

interface TrackingHeaderProps {
    title: string;
    subtitle?: string;
}

function TrackingHeader({ title, subtitle }: TrackingHeaderProps) {
    const currentTime = useCurrentTime();

    return (
        <header className='border-b bg-white p-6'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <h1 className='flex items-center gap-3 text-2xl font-bold text-gray-800'>
                        <MapPin className='text-blue-500' />
                        {title}
                    </h1>
                    {subtitle && (
                        <span className='text-md text-gray-600'>{subtitle}</span>
                    )}
                </div>
                <div className='flex items-center gap-4'>
                    <div className='flex items-center gap-2 text-gray-600'>
                        <Clock className='h-4 w-4' />
                        <span>{currentTime}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default TrackingHeader; 