'use server'

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/services/firebase';
import { redirect } from 'next/navigation';

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;

  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add user to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      firstName,
      lastName,
    });

    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    });

    redirect('/home');
  } catch (error) {
    throw error;
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    redirect('/home');
  } catch (error) {
    throw error;
  }
}

export async function updateUserProfile(formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;

  if (!auth.currentUser) {
    throw new Error('No user logged in');
  }

  try {
    await updateProfile(auth.currentUser, {
      displayName: `${firstName} ${lastName}`
    });

    // Update Firestore
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      firstName,
      lastName,
    });

    redirect('/home');
  } catch (error) {
    throw error;
  }
}
