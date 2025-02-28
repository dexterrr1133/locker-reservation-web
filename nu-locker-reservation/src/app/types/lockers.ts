import { Timestamp } from "firebase/firestore";

export interface Reservation {
    id: string;
    createdAt: Timestamp;
    status: string;
    totalPrice: number;
    lockerSize: string;
  }
  
  export interface GrowthData {
    date: string;
    revenue: number;
    bookings: number;
  }
  
  export interface StatusData {
    name: string;
    value: number;
  }
  
  export interface LockerSizeData {
    size: string;
    count: number;
  }

  export type TimeframeOption = '7d' | '30d' | '90d';