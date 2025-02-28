import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/services/firebase"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateUserId = async (): Promise<string> => {
  const usersRef = collection(db, "users");
  const userSnapshot = await getDocs(usersRef);
  const userCount = userSnapshot.size;
  // Fix: Use backticks instead of single quotes
  const userId = `USER-${(userCount + 1).toString().padStart(3, "0")}`;
  return userId;
};
