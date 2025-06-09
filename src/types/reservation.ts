export enum ReservePurpose {
    COMMUTE = 'COMMUTE',
    BUSINESS_TRIP = 'BUSINESS_TRIP',
    PERSONAL = 'PERSONAL',
    OTHER = 'OTHER'
}

export const RESERVE_PURPOSE_LABELS: Record<ReservePurpose, string> = {
    [ReservePurpose.COMMUTE]: '집↔직장(학교) 정기 이동',
    [ReservePurpose.BUSINESS_TRIP]: '업무상 임시 출장',
    [ReservePurpose.PERSONAL]: '개인적 용무',
    [ReservePurpose.OTHER]: '그 외 기타 목적'
}; 