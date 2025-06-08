import React, { useState, useRef, useEffect } from 'react';
import { Button, ButtonGroup } from '@nextui-org/react';
import moment from 'moment';
import 'moment/locale/ko';

interface TimeSlot {
    start: moment.Moment;
    end: moment.Moment;
}

type ViewMode = 'hourly' | 'daily' | 'weekly';

interface NotionStyleTimelineProps {
    allowLeftScroll?: boolean;
    onTimeSlotClick?: (slot: TimeSlot) => void;
    events?: Array<{
        id: number;
        start: string;
        end: string;
        title: string;
        color?: string;
    }>;
}

export const NotionStyleTimeline: React.FC<NotionStyleTimelineProps> = ({
    allowLeftScroll = false,
    onTimeSlotClick,
    events = []
}) => {
    const [viewMode, setViewMode] = useState<ViewMode>('hourly');
    const [visibleDates, setVisibleDates] = useState<moment.Moment[]>([]);
    const [startDate, setStartDate] = useState(moment().startOf('day'));
    const timelineRef = useRef<HTMLDivElement>(null);

    const generateTimeSlots = (date: moment.Moment, mode: ViewMode): TimeSlot[] => {
        const slots: TimeSlot[] = [];
        const start = date.clone().startOf('day');
        
        switch (mode) {
            case 'hourly':
                for (let i = 0; i < 72; i++) {
                    slots.push({
                        start: start.clone().add(i, 'hours'),
                        end: start.clone().add(i + 1, 'hours')
                    });
                }
                break;
            case 'daily':
                for (let i = 0; i < 14; i++) {
                    slots.push({
                        start: start.clone().add(i, 'days'),
                        end: start.clone().add(i + 1, 'days')
                    });
                }
                break;
            case 'weekly':
                for (let i = 0; i < 8; i++) {
                    slots.push({
                        start: start.clone().add(i, 'weeks'),
                        end: start.clone().add(i + 1, 'weeks')
                    });
                }
                break;
        }
        return slots;
    };

    const handleScroll = () => {
        if (!timelineRef.current) return;
        
        const { scrollLeft, scrollWidth, clientWidth } = timelineRef.current;
        const isNearEnd = scrollWidth - (scrollLeft + clientWidth) < 300;
        
        if (isNearEnd) {
            const lastDate = visibleDates[visibleDates.length - 1];
            const nextDate = lastDate.clone().add(1, 'day');
            setVisibleDates([...visibleDates, nextDate]);
        }
    };

    useEffect(() => {
        const initialDates = [
            startDate.clone(),
            startDate.clone().add(1, viewMode === 'weekly' ? 'weeks' : 'days'),
            startDate.clone().add(2, viewMode === 'weekly' ? 'weeks' : 'days')
        ];
        setVisibleDates(initialDates);
    }, [startDate, viewMode]);

    return (
        <div className="flex flex-col w-full">
            <div className="flex justify-between items-center mb-4 px-4">
                <ButtonGroup>
                    <Button
                        size="sm"
                        variant={viewMode === 'hourly' ? 'solid' : 'flat'}
                        onPress={() => setViewMode('hourly')}
                    >
                        시간별
                    </Button>
                    <Button
                        size="sm"
                        variant={viewMode === 'daily' ? 'solid' : 'flat'}
                        onPress={() => setViewMode('daily')}
                    >
                        일별
                    </Button>
                    <Button
                        size="sm"
                        variant={viewMode === 'weekly' ? 'solid' : 'flat'}
                        onPress={() => setViewMode('weekly')}
                    >
                        주별
                    </Button>
                </ButtonGroup>
                <div className="text-sm text-gray-600">
                    {startDate.format('YYYY년 MM월')}
                </div>
            </div>

            <div
                ref={timelineRef}
                className="overflow-x-auto overflow-y-hidden"
                style={{
                    overflowX: allowLeftScroll ? 'auto' : 'scroll',
                    overflowY: 'hidden',
                    WebkitOverflowScrolling: 'touch'
                }}
                onScroll={handleScroll}
            >
                <div className="inline-flex" style={{ width: 'max-content' }}>
                    {/* 헤더 영역 */}
                    <div className="flex">
                        {/* 좌측 상단 빈 영역 */}
                        <div className="sticky left-0 z-10 w-48 h-10 border-b border-r bg-white flex items-center px-4 font-medium">
                            차량
                        </div>
                        
                        {/* 시간 헤더 */}
                        {generateTimeSlots(startDate, viewMode).map((slot) => (
                            <div
                                key={slot.start.format()}
                                className="w-[120px] h-10 border-b border-r flex flex-col items-center justify-center font-medium shrink-0"
                            >
                                <div className="text-xs text-gray-500">
                                    {slot.start.format('MM/DD')}
                                </div>
                                <div>
                                    {slot.start.format(
                                        viewMode === 'hourly'
                                            ? 'HH:mm'
                                            : viewMode === 'daily'
                                            ? 'ddd'
                                            : '[W]W'
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 차량 타임라인 */}
                    <div className="flex">
                        {/* 차량 정보 */}
                        <div className="sticky left-0 z-10 w-48 border-b border-r bg-white px-4 py-2">
                            차량 정보
                        </div>
                        
                        {/* 시간대별 이벤트 */}
                        {generateTimeSlots(startDate, viewMode).map((slot) => (
                            <div
                                key={slot.start.format()}
                                className="w-[120px] border-b border-r hover:bg-gray-50 cursor-pointer min-h-[100px] px-1 py-1 shrink-0"
                                onClick={() => onTimeSlotClick?.(slot)}
                            >
                                {events
                                    .filter(
                                        event =>
                                            moment(event.start).isBetween(
                                                slot.start,
                                                slot.end,
                                                null,
                                                '[)'
                                            )
                                    )
                                    .map(event => (
                                        <div
                                            key={event.id}
                                            className="rounded px-2 py-1 mb-1 text-xs"
                                            style={{
                                                backgroundColor: event.color || '#E2E8F0'
                                            }}
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}; 