import { differenceInHours, differenceInMinutes, differenceInSeconds, differenceInMilliseconds } from 'date-fns';

export const formatDate = (date?: string | Date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

export const formatDuration = (start: string | Date, end: string | Date) => {
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const endDate = typeof end === 'string' ? new Date(end) : end;
  const diffMs = endDate.getTime() - startDate.getTime();
  if (isNaN(diffMs) || diffMs < 0) return '0시간 0분';
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}시간 ${minutes}분`;
};

export const getDateDiff = (start: string | Date, end: string | Date) => {
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const endDate = typeof end === 'string' ? new Date(end) : end;
  const diffMs = endDate.getTime() - startDate.getTime();
  if (isNaN(diffMs) || diffMs < 0)
    return undefined;

  const hours = differenceInHours(endDate, startDate);
  const minutes = differenceInMinutes(endDate, startDate);
  const seconds = differenceInSeconds(endDate, startDate);
  const milliseconds = differenceInMilliseconds(endDate, startDate);

  return {
    hours: differenceInHours(endDate, startDate),
    minutes: differenceInMinutes(endDate, startDate),
    seconds: differenceInSeconds(endDate, startDate),
    milliseconds: differenceInMilliseconds(endDate, startDate)
  }
};

export const isExpired = (expireAt?: Date | string | number) => {
  if (!expireAt)
    return true;
  const expire = typeof expireAt === 'string' || typeof expireAt === 'number' ? new Date(expireAt) : expireAt;
  return expire.getTime() < Date.now();
};