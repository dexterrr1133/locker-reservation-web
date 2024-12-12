export interface LockerConfig {
  rows: number;
  cols: number;
  size: string;
}

export interface Locker {
  color: string;
  id: string;
}

export type LockerGrid = Locker[][];

export interface LockerProps {
  className?: string;
}