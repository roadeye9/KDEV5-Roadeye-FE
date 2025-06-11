import { useCallback, useState } from "react";

export interface Coordinate {
    lat: number;
    lng: number;
}

const DEFAULT_COORDINATE: Coordinate = { lat: 37.494589, lng: 126.868346 };

export default function useMapCenter() {
    const [center, setCenter] = useState<Coordinate>(DEFAULT_COORDINATE);

    const reset = useCallback(() => {
        setCenter(DEFAULT_COORDINATE);
    }, []);

    return [center, setCenter, reset] as const;
}