import { ref, set, get } from 'firebase/database';
import { database } from '@/lib/firebase';
import { UserDocument } from '../types/auth.types';
import { showToast } from '../../../components/toasts';

// Add network state check
const isOnline = () => navigator.onLine;

export const createUserDocument = async (user: any, additionalData: Partial<UserDocument> = {}) => {
    if (!user) throw new Error('No user data provided');
    
    try {
        const userRef = ref(database, `users/${user.uid}`);
        
        // Create user data with required gender field
        const userData = {
            id: user.uid,
            email: user.email ?? '',
            displayName: additionalData.displayName || null,
            photoURL: additionalData.photoURL || null,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            dateOfBirth: additionalData.dateOfBirth || null,
            gender: additionalData.gender, // Remove default value to ensure it's passed
            isNewUser: true
        };

        // Log the data being saved
        console.log('Saving user data:', userData);

        // Save the complete user document
        await set(userRef, userData);
        
        return userData;
    } catch (error) {
        console.error('Error saving user data:', error);
        showToast('Error', 'error', 'Failed to save user data');
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
        const userRef = ref(database, `users/${uid}`);
        const userSnapshot = await get(userRef);
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