import { ref, set, get } from 'firebase/database';
import { rtdb } from '@/lib/firebase';
import { UserDocument } from '../types/index';
import { showToast } from '../../../components/toasts';

export class UserServiceError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = 'UserServiceError';
    }
}

// Add network state check
const isOnline = () => navigator.onLine;

export const createUserDocument = async (
    user: { uid: string; email: string | null }, 
    additionalData: Partial<UserDocument>
): Promise<UserDocument> => {
    if (!user) throw new UserServiceError('No user data provided', 'NO_USER_DATA');
    
    try {
        const userRef = ref(rtdb, `users/${user.uid}`);
        
        // Only include essential fields
        const userData: UserDocument = {
            id: user.uid,
            email: user.email ?? '',
            displayName: additionalData.displayName || '',
            dateOfBirth: additionalData.dateOfBirth || '',
            gender: additionalData.gender || 'prefer-not-to-say',
            height: additionalData.height || 0,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            isNewUser: true,
            weights: []
        };

        // Validate required fields
        if (!userData.displayName) {
            throw new UserServiceError('Display name is required', 'INVALID_DISPLAY_NAME');
        }
        if (!userData.dateOfBirth) {
            throw new UserServiceError('Date of birth is required', 'INVALID_DOB');
        }
        if (!userData.gender) {
            throw new UserServiceError('Gender is required', 'INVALID_GENDER');
        }
        if (!userData.height || userData.height <= 0) {
            throw new UserServiceError('Valid height is required', 'INVALID_HEIGHT');
        }

        await set(userRef, userData);
        return userData;
    } catch (error) {
        throw new UserServiceError(
            error instanceof UserServiceError ? error.message : 'Failed to create user document', 
            'CREATE_USER_FAILED'
        );
    }
};

export const checkUserExists = async (uid: string): Promise<boolean> => {
    if (!uid) {
        throw new UserServiceError('No user ID provided', 'NO_USER_ID');
    }

    if (!isOnline()) {
        showToast('Error', 'error', 'No internet connection. Please check your network.');
        throw new UserServiceError('No internet connection', 'NO_INTERNET');
    }

    try {
        const userRef = ref(rtdb, `users/${uid}`);
        const userSnapshot = await get(userRef);
        return userSnapshot.exists();
    } catch (error: any) {
        console.error('Error checking user existence:', error);
        const errorMessage = !isOnline() 
            ? 'No internet connection. Please check your network.'
            : 'Failed to check user existence';
        showToast('Error', 'error', errorMessage);
        throw new UserServiceError(errorMessage, 'CHECK_USER_FAILED');
    }
};

export const getUserData = async (uid: string): Promise<UserDocument | null> => {
    try {
        const userRef = ref(rtdb, `users/${uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
            return snapshot.val() as UserDocument;
        }
        
        return null;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw new UserServiceError('Failed to fetch user data', 'FETCH_USER_FAILED');
    }
};