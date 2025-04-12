import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebaseConfig';
import { UserDocument } from '../types/auth.types';
import { showToast } from '../../../components/toasts';

// Add network state check
const isOnline = () => navigator.onLine;

export const createUserDocument = async (user: any, additionalData = {}) => {
    if (!user) {
        throw new Error('No user data provided');
    }

    if (!isOnline()) {
        showToast('Error', 'error', 'No internet connection. Please check your network.');
        throw new Error('No internet connection');
    }

    try {
        const userRef = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            const userData: UserDocument = {
                id: user.uid,
                email: user.email ?? '',
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                dateOfBirth: null,
                ...additionalData
            };
            await setDoc(userRef, userData);
        } else {
            await setDoc(userRef, {
                lastLogin: new Date().toISOString(),
                ...additionalData
            }, { merge: true });
        }
    } catch (error: any) {
        console.error('Error creating/updating user document:', error);
        const errorMessage = !isOnline() 
            ? 'No internet connection. Please check your network.'
            : 'Failed to save user data';
        showToast('Error', 'error', errorMessage);
        throw error;
    }
};

export const checkUserExists = async (uid: string): Promise<boolean> => {
    if (!uid) {
        throw new Error('No user ID provided');
    }

    if (!isOnline()) {
        showToast('Error', 'error', 'No internet connection. Please check your network.');
        throw new Error('No internet connection');
    }

    try {
        const userRef = doc(db, 'users', uid);
        const userSnapshot = await getDoc(userRef);
        return userSnapshot.exists();
    } catch (error: any) {
        console.error('Error checking user existence:', error);
        const errorMessage = !isOnline() 
            ? 'No internet connection. Please check your network.'
            : 'Failed to check user existence';
        showToast('Error', 'error', errorMessage);
        throw error;
    }
};