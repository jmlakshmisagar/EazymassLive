"use client";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { FirebaseOptions } from "firebase/app";
import { getApps, getApp } from "firebase/app";
import firebaseConfig from "../firebaseConfig";

const app = !getApps().length ? initializeApp(firebaseConfig as FirebaseOptions) : getApp();
const database = getDatabase(app);

export function fetchData(callback: (data: any) => void) {
    const dbRef = ref(database, "/");
    onValue(dbRef, (snapshot) => {
        const fetchedData = snapshot.val();
        callback(fetchedData);
    });
}