"use server";

import { auth } from "@/services/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { db } from "@/services/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function signupUser(firstName: string, lastName: string, email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: `${firstName} ${lastName}` });

    const userDoc = doc(db, "users", userCredential.user.uid);
    await setDoc(userDoc, {
      firstName,
      lastName,
      email,
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    if (error instanceof FirebaseError) {
      // Firebase-specific error
      return { success: false, error: error.message };
    } else if (error instanceof Error) {
      // Generic error
      return { success: false, error: error.message };
    } else {
      // Fallback for unknown error types
      return { success: false, error: "An unexpected error occurred." };
    }
  }
}

export async function loginUser(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    if (error instanceof FirebaseError) {
      return { success: false, error: error.message };
    } else if (error instanceof Error) {
      return { success: false, error: error.message };
    } else {
      return { success: false, error: "An unexpected error occurred." };
    }
  }
}

export async function updateProfileInfo(firstName: string, lastName: string) {
  try {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: `${firstName} ${lastName}` });
      return { success: true };
    }
    return { success: false, error: "User not logged in" };
  } catch (error) {
    if (error instanceof FirebaseError) {
      return { success: false, error: error.message };
    } else if (error instanceof Error) {
      return { success: false, error: error.message };
    } else {
      return { success: false, error: "An unexpected error occurred." };
    }
  }
}
