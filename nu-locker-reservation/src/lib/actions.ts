import { db } from "@/services/firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy, Timestamp } from "firebase/firestore";

// Firestore collection reference
const lockerCollection = collection(db, "lockers");

// Fetch all lockers
export const fetchLockers = async () => {
  const snapshot = await getDocs(lockerCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Add a new locker
export const addLocker = async (locker: {
  lockerId: string;
  lockerName: string;
  lockerSize: string;
  lockerPrice: string;
}) => {
  return await addDoc(lockerCollection, locker);
};

// Update an existing locker
export const editLocker = async (
  id: string,
  locker: {
    lockerId: string;
    lockerName: string;
    lockerSize: string;
    lockerPrice: string;
  }
) => {
  const lockerDoc = doc(db, "lockers", id);
  return await updateDoc(lockerDoc, locker);
};

// Delete a locker
export const removeLocker = async (id: string) => {
  const lockerDoc = doc(db, "lockers", id);
  return await deleteDoc(lockerDoc);
};

export type Reservation = {
  id?: string;
  userId: string;
  userName: string;
  lockerNumber: string;
  lockerSize: 'small' | 'medium' | 'large';
  startDate: Date;
  endDate: Date;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export async function createReservation(data: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const docRef = await addDoc(collection(db, "reservations"), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      startDate: Timestamp.fromDate(data.startDate),
      endDate: Timestamp.fromDate(data.endDate),
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
}

export async function updateReservation(id: string, data: Partial<Reservation>) {
  try {
    const reservationRef = doc(db, "reservations", id);
    const updateData = {
      ...data,
      updatedAt: Timestamp.now(),
      ...(data.startDate && { startDate: Timestamp.fromDate(data.startDate) }),
      ...(data.endDate && { endDate: Timestamp.fromDate(data.endDate) }),
    };
    await updateDoc(reservationRef, updateData);
    return { id, ...data };
  } catch (error) {
    console.error("Error updating reservation:", error);
    throw error;
  }
}

export async function deleteReservation(id: string) {
  try {
    const reservationRef = doc(db, "reservations", id);
    await deleteDoc(reservationRef);
    return true;
  } catch (error) {
    console.error("Error deleting reservation:", error);
    throw error;
  }
}

export async function getReservations() {
  try {
    const reservationsRef = collection(db, "reservations");
    const q = query(reservationsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startDate: doc.data().startDate.toDate(),
      endDate: doc.data().endDate.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Reservation[];
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
}