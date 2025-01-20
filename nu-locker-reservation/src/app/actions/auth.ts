'use server'

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getIdToken } from 'firebase/auth';
import { adminAuth, adminDb } from '@/services/fireabaseAdmin';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/services/firebase';
import { User } from '../types/user';

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface SigninData {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean
  error?: string
  user?: User
}


export async function SignupUser(data: SignupData): Promise<AuthResponse> {
  try {
    // Validate input
    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      return {
        success: false,
        error: 'All fields are required'
      }
    }

    // Create user with Firebase Admin
    const userRecord = await adminAuth.createUser({
      email: data.email,
      password: data.password,
      displayName: `${data.firstName} ${data.lastName}`
    })

    const userData: User = {
      uid: userRecord.uid,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,

    }


    // Store additional user data in Firestore
    await adminDb.collection('users').doc(userRecord.uid).set(userData)
    return {
      success: true,
      user: userData
    }

  } catch (error: any) {
    // Handle specific Firebase Auth errors
    const errorMessage = (() => {
      switch (error.code) {
        case 'auth/email-already-exists':
          return 'This email is already registered'
        case 'auth/invalid-email':
          return 'Invalid email address'
        case 'auth/operation-not-allowed':
          return 'Email/password accounts are not enabled'
        case 'auth/invalid-password':
          return 'Password should be at least 6 characters'
        default:
          return error.message || 'An error occurred during signup'
      }
    })()

    return {
      success: false,
      error: errorMessage
    }
  }
}

export async function SigninUser(data: SigninData): Promise<AuthResponse> {
  try {
    if (!data.email || !data.password) {
      return {
        success: false,
        error: 'Email and password are required'
      }
    }

    // For login, we use the client-side Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password)
    await getIdToken(userCredential.user, true);

    const userDoc = await adminDb.collection('users').doc(userCredential.user.uid).get()
    const userData = userDoc.data() as User

    return { 
      success: true,
      user: userData
    }
   

  } catch (error: any) {
    const errorMessage = (() => {
      switch (error.code) {
        case 'auth/invalid-email':
          return 'Invalid email address'
        case 'auth/user-disabled':
          return 'This account has been disabled'
        case 'auth/user-not-found':
          return 'No account found with this email'
        case 'auth/wrong-password':
          return 'Incorrect password'
        default:
          return 'Invalid email or password'
      }
    })()

    return { success: false, error: errorMessage }
  }
}