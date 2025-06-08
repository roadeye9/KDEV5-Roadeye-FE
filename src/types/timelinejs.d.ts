declare module '@knight-lab/timelinejs' {
    export class Timeline {
        constructor(
            element: HTMLElement,
            options: {
                events: Array<{
                    start_date: {
                        year: number;
                        month: number;
                        day: number;
                        hour?: number;
                        minute?: number;
                    };
                    end_date?: {
                        year: number;
                        month: number;
                        day: number;
                        hour?: number;
                        minute?: number;
                    };
                    text: {
                        headline: string;
                        text?: string;
                    };
                    background?: {
                        color?: string;
                        url?: string;
                    };
                }>;
                scale_factor?: number;
                language?: string;
                start_at_end?: boolean;
                start_at_slide?: number;
                initial_zoom?: number;
                height?: number;
            }
        );
    }
} 