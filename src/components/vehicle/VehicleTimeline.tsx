import React, { useEffect, useRef } from 'react';
import { Timeline } from '@knight-lab/timelinejs';
import '@knight-lab/timelinejs/dist/css/timeline.css';
import moment from 'moment';

interface VehicleTimelineProps {
    events?: Array<{
        id: number;
        start: string;
        end: string;
        title: string;
        color?: string;
    }>;
}

export const VehicleTimeline: React.FC<VehicleTimelineProps> = ({
    events = []
}) => {
    const timelineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!timelineRef.current) return;

        // TimelineJS3 데이터 포맷으로 변환
        const timelineData = {
            events: events.map(event => ({
                start_date: {
                    year: moment(event.start).year(),
                    month: moment(event.start).month() + 1,
                    day: moment(event.start).date(),
                    hour: moment(event.start).hour(),
                    minute: moment(event.start).minute()
                },
                end_date: {
                    year: moment(event.end).year(),
                    month: moment(event.end).month() + 1,
                    day: moment(event.end).date(),
                    hour: moment(event.end).hour(),
                    minute: moment(event.end).minute()
                },
                text: {
                    headline: event.title
                },
                background: {
                    color: event.color
                }
            }))
        };

        // TimelineJS3 초기화
        new Timeline(timelineRef.current, {
            events: timelineData.events,
            scale_factor: 1,
            language: 'ko',
            start_at_end: false,
            start_at_slide: 0,
            initial_zoom: 1,
            height: 600
        });
    }, [events]);

    return (
        <div 
            ref={timelineRef} 
            className="w-full"
            style={{ minHeight: '600px' }}
        />
    );
}; 