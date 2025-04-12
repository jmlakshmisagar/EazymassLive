import { 
    getAuth, 
    signInWithRedirect, 
    GoogleAuthProvider,
    FacebookAuthProvider,
    GithubAuthProvider,
    OAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    UserCredential,
    User
} from 'firebase/auth';
import { getDatabase, ref as dbRef, set } from 'firebase/database';
import app from '../../firebaseConfig';
import { showToast } from '../../../components/toasts';

export const auth = getAuth(app);
const db = getDatabase(app);

export const providers = {
    google: new GoogleAuthProvider(),
    facebook: new FacebookAuthProvider(),
    github: new GithubAuthProvider(),
    microsoft: new OAuthProvider('microsoft.com')
};

export const handleProviderLogin = async (provider: any, providerName: string) => {
    try {
        await signInWithRedirect(auth, provider);
    } catch (error: any) {
        console.error('Error during login:', error);
        showToast("Login Failed", "error", `Failed to login with ${providerName}`);
        throw error;
    }
};

interface AuthResponse {
    user: UserCredential['user'];
    isNewUser: boolean;
}

const RATE_LIMIT_DURATION = 3000; // 30 seconds
let lastAttemptTime = 0;

export const handleEmailPasswordAuth = async (email: string, password: string): Promise<AuthResponse> => {
    const now = Date.now();
    if (now - lastAttemptTime < RATE_LIMIT_DURATION) {
        const waitTime = Math.ceil((RATE_LIMIT_DURATION - (now - lastAttemptTime)) / 1000);
        throw new Error(`Please wait ${waitTime} seconds before trying again`);
    }

    try {
        lastAttemptTime = now;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, isNewUser: false };
    } catch (error: any) {
        if (error.code === 'auth/too-many-requests') {
            throw new Error('Too many login attempts. Please wait 30 seconds before trying again.');
        }
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
            const credential = await createUserWithEmailAndPassword(auth, email, password);
            return { user: credential.user, isNewUser: true };
        }
        throw error;
    }
};

export const createUserData = async (uid: string, userData: any) => {
    try {
        const userRef = dbRef(db, `users/${uid}`);
        await set(userRef, userData);
    } catch (error) {
        console.error('Error creating user data:', error);
        throw error;
    }
};

export const updateUserProfile = async (
    user: User,
    profileData: {
        displayName: string | null;
        photoURL: string | null;
    }
) => {
    try {
        await updateProfile(user, profileData);
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};