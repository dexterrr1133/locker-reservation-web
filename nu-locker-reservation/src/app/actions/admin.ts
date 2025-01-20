
import {
    collection,
    getDocs,
    query,
    orderBy,
    where,
    QueryDocumentSnapshot,
    DocumentData

} from 'firebase/firestore'
import { db } from '@/services/firebase'
import { User, UserDocument } from '../types/user'
import { GrowthData, LockerSizeData, Reservation, StatusData } from '../types/lockers';


const convertUserDoc = (doc: QueryDocumentSnapshot<DocumentData>): User => {
    const data = doc.data() as UserDocument;
    return {
      uid: doc.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    };
  };

  
// fetch user data
export const fetchUsers = async (): Promise<User[]> => {
    const usersRef = collection(db, 'users');
    const usersQuery = query(usersRef, orderBy('lastName'));
    const usersSnapshot = await getDocs(usersQuery);
    return usersSnapshot.docs.map(convertUserDoc);
  };


  export const fetchReservations = async (): Promise<Reservation[]> => {
  const reservationsRef = collection(db, 'reservations');
  const reservationsQuery = query(reservationsRef, orderBy('createdAt', 'desc'));
  const reservationsSnapshot = await getDocs(reservationsQuery);
  return reservationsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Reservation));
};

export const getDateRangeData = (days: number) => {
  const now = new Date();
  const startDate = new Date(now.setDate(now.getDate() - days));
  return { startDate };
};

export const prepareGrowthData = (reservations: Reservation[], days: number): GrowthData[] => {
  const { startDate } = getDateRangeData(days);
  
  const filteredReservations = reservations.filter(
    r => r.createdAt.toDate() >= startDate
  );

  const dailyData = new Map();
  filteredReservations.forEach(reservation => {
    const date = reservation.createdAt.toDate().toLocaleDateString();
    const current = dailyData.get(date) || { date, revenue: 0, bookings: 0 };
    current.revenue += reservation.totalPrice;
    current.bookings += 1;
    dailyData.set(date, current);
  });

  return Array.from(dailyData.values()).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

export const prepareStatusData = (reservations: Reservation[]): StatusData[] => {
  const statusCount = reservations.reduce((acc, reservation) => {
    acc[reservation.status] = (acc[reservation.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(statusCount).map(([name, value]) => ({
    name,
    value
  }));
};

export const prepareLockerSizeData = (reservations: Reservation[]): LockerSizeData[] => {
  const sizeCount = reservations.reduce((acc, reservation) => {
    acc[reservation.lockerSize] = (acc[reservation.lockerSize] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(sizeCount).map(([size, count]) => ({
    size,
    count
  }));
};

export const calculateTotalRevenue = (reservations: Reservation[]): number => {
  return reservations.reduce((sum, r) => sum + r.totalPrice, 0);
};

export const getActiveReservations = (reservations: Reservation[]): number => {
  return reservations.filter(r => r.status === 'active').length;
};

  