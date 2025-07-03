import { useEffect, useState } from "react";

export function useCurrentTime({
    interval = 1000,
    locale = 'ko-KR',
    format = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }
}: {
    interval?: number,
    locale?: string,
    format?: Intl.DateTimeFormatOptions
} = {}) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, interval);

        return () => clearInterval(timer);
    }, []);

    return currentTime.toLocaleTimeString(locale, format);
}