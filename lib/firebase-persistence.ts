import { enableIndexedDbPersistence } from 'firebase/firestore';
import { db } from './firebase';

let persistenceEnabled = false;

export async function enablePersistence() {
    if (persistenceEnabled) return;
    
    try {
        await enableIndexedDbPersistence(db);
        persistenceEnabled = true;
    } catch (err: any) {
        if (err.code === 'failed-precondition') {
            console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
            console.warn('The current browser does not support offline persistence');
        }
    }
}