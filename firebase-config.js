import { initializeApp } from "firebase/app"

import { getFirestore } from '@firebase/firestore'
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage"
import { getAuth } from '@firebase/auth'
import { GoogleAuthProvider } from 'firebase/auth'
import { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId } from './config'

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);


export const db = getFirestore(app)

export const database = getDatabase(app);
export const storage = getStorage(app);

export const auth = getAuth(app)

export const provider = new GoogleAuthProvider(app);