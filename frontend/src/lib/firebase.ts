import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, UserCredential } from 'firebase/auth';
import { fetchApi } from './api';
import { User } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyBO2i3vdBVwOFXUMr3pke3UFQZCHBnWzVw",
  authDomain: "kanhaiyya-a1014.firebaseapp.com",
  databaseURL: "https://kanhaiyya-a1014-default-rtdb.firebaseio.com",
  projectId: "kanhaiyya-a1014",
  storageBucket: "kanhaiyya-a1014.firebasestorage.app",
  messagingSenderId: "788394706121",
  appId: "1:788394706121:web:09552e88eb4eb1dfa07918",
  measurementId: "G-J5PD1JVVV4"
};

// Initialize Firebase safely for SSR/Next.js
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export interface GoogleAuthResponse {
  user: User;
  token: string;
}

/**
 * Sign in with Google popup and sync session with backend
 */
export async function signInWithGoogle(): Promise<GoogleAuthResponse> {
  const result: UserCredential = await signInWithPopup(auth, googleProvider);
  const fbUser = result.user;

  if (!fbUser.email) {
    throw new Error('Google account does not have an email address associated.');
  }

  // Sync with backend /api/auth/google
  const res = await fetchApi<{ user: User; token: string }>('/auth/google', {
    method: 'POST',
    body: {
      email: fbUser.email,
      name: fbUser.displayName || fbUser.email.split('@')[0],
      photoUrl: fbUser.photoURL || undefined,
      uid: fbUser.uid,
    },
  });

  if (!res.success || !res.data) {
    throw new Error(res.error || 'Failed to authenticate with backend');
  }

  return res.data;
}
