import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

export const createUser = async (userId: string, name: string, email: string) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { name, email });
    console.log("User created successfully!");
  } catch (error) {
    console.error("Error creating user: ", error);
  }
};

export const getUserData = async (userId: string): Promise<{ name: string; email: string } | null> => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data() as { name: string; email: string };
      } else {
        console.log("No such user found!");
        return null;
      }
    } catch (error) {
      console.error("Error reading user data: ", error);
      return null;
    }
  };

export const updateUserData = async (userId: string, name: string, email: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { name, email });
    console.log("User data updated successfully!");
  } catch (error) {
    console.error("Error updating user data: ", error);
  }
};

export const deleteUserData = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);
    console.log("User deleted successfully!");
  } catch (error) {
    console.error("Error deleting user: ", error);
  }
};
