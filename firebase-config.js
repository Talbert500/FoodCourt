import { initializeApp } from "firebase/app"

import {getFirestore} from '@firebase/firestore'
import {getDatabase} from "firebase/database"
import {getStorage} from "firebase/storage"
import {getAuth} from '@firebase/auth'
import {GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey:"AIzaSyBUeL6s9MCZ3nH_qnpSJXGw3Z38oiCQe-U",
  authDomain: "restaurants-db-dee75.firebaseapp.com",
  projectId:  "restaurants-db-dee75",
  storageBucket: "restaurants-db-dee75.appspot.com",
  messagingSenderId: "343568497668",
  appId:  "1:343568497668:web:f4852a9a39cd7009bd4951"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);


export const db = getFirestore(app)

export const database= getDatabase(app);
export const storage = getStorage(app);

export const auth = getAuth(app)

export const provider = new GoogleAuthProvider(app);