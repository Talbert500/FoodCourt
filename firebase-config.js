import { initializeApp } from "firebase/app"

import {getFirestore} from '@firebase/firestore'
import {getDatabase} from "firebase/database"
import {getStorage} from "firebase/storage"
import {getAuth} from '@firebase/auth'

import config from "./config"

const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  projectId: config.firebase.projectId,
  storageBucket: config.firebase.storageBucket,
  messagingSenderId: config.firebase.messagingSenderId,
  appId: config.firebase.appId
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);


export const db = getFirestore(app)

export const database= getDatabase(app);
export const storage = getStorage(app);

export const auth = getAuth(app)
