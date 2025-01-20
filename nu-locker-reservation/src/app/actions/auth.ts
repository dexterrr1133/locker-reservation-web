import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/services/firebase';
import type { User, SignUpData, SignInData } from '../types/user';

export const signUp = async ({ 
  email, 
  password, 
  firstName, 
  lastName 
}: SignUpData): Promise<User> => {
  try {
    // Create authentication record
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { uid } = userCredential.user;

    // Prepare user data
    const userData: Omit<User, 'uid'> = {
      email,
      firstName,
      lastName,

    };

    // Store additional user data in Firestore
    await setDoc(doc(db, 'users', uid), userData);

    return {
      uid,
      ...userData
    };
  } catch (error: any) {
    // Handle specific error cases
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error('This email is already registered');
      case 'auth/invalid-email':
        throw new Error('Invalid email address');
      case 'auth/weak-password':
        throw new Error('Password should be at least 6 characters');
      default:
        throw new Error('Failed to create account');
    }
  }
};

export const signIn = async ({ 
  email, 
  password 
}: SignInData): Promise<User> => {
  try {
    // Authenticate user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const { uid } = userCredential.user;

    // Fetch user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    return {
      uid,
      ...userDoc.data()
    } as User;
  } catch (error: any) {
    // Handle specific error cases
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        throw new Error('Invalid email or password');
      case 'auth/too-many-requests':
        throw new Error('Too many failed attempts. Please try again later');
      default:
        throw new Error('Failed to sign in');
    }
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw new Error('Failed to sign out');
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    switch (error.code) {
      case 'auth/user-not-found':
        throw new Error('No account found with this email');
      default:
        throw new Error('Failed to send password reset email');
    }
  }
};