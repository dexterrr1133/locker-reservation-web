import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/services/firebase';
import type {
  User,
  AuthResponse,
  SignUpData,
  SignInData,
  UserDocument,
} from '../types/user';

// Helper function to handle Firestore operations
const handleFirestoreError = (error: any, context: string): never => {
  console.error(`Firestore Error (${context}):`, error);
  throw new Error(`Failed to ${context}`);
};

// Helper function to handle Firebase Auth errors
const handleAuthError = (error: any): never => {
  console.error('Authentication Error:', error);

  switch (error.code) {
    case 'auth/email-already-in-use':
      throw new Error('This email is already registered');
    case 'auth/invalid-email':
      throw new Error('Invalid email address');
    case 'auth/weak-password':
      throw new Error('Password should be at least 6 characters');
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      throw new Error('Invalid email or password');
    case 'auth/too-many-requests':
      throw new Error('Too many failed attempts. Please try later');
    case 'auth/user-not-found':
      throw new Error('No account found with this email');
    default:
      throw new Error('An unexpected error occurred. Please try again');
  }
};

// Helper function to create a user document in Firestore
const createUserDocument = async (uid: string, userData: Omit<User, 'uid'>): Promise<void> => {
  try {
    await setDoc(doc(db, 'users', uid), {
      ...userData,
      createdAt: new Date().toISOString(), // Add a timestamp for when the user was created
    });
  } catch (error) {
    handleFirestoreError(error, 'create user document');
  }
};

// Helper function to fetch user data from Firestore
const fetchUserData = async (uid: string): Promise<UserDocument> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));

    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    return {
      id: uid,
      ...userDoc.data(),
    } as UserDocument;
  } catch (error) {
    handleFirestoreError(error, 'fetch user data');
  }
};

// Sign up a new user
export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
}: SignUpData): Promise<AuthResponse> => {
  try {
    // Create authentication record
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { uid } = userCredential.user;

    // Prepare user data
    const userData: Omit<User, 'uid'> = {
      firstName,
      lastName,
      email,
    };

    // Store additional user data in Firestore
    await createUserDocument(uid, userData);

    // Return the success response with user data
    return {
      success: true,
      user: {
        uid,
        ...userData,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

// Sign in an existing user
export const signIn = async ({ email, password }: SignInData): Promise<AuthResponse> => {
  try {
    // Authenticate user
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { uid } = userCredential.user;

    // Fetch user data from Firestore
    const userDocument = await fetchUserData(uid);

    // Return the success response with user data
    return {
      success: true,
      user: {
        uid,
        ...userDocument,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

// Sign out the current user
export const signOut = async (): Promise<AuthResponse> => {
  try {
    await firebaseSignOut(auth);
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sign out',
    };
  }
};

// Send a password reset email
export const resetPassword = async (email: string): Promise<AuthResponse> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send password reset email',
    };
  }
};