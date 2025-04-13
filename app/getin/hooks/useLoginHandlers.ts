import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Changed from 'next/router'
import { 
    providers, 
    handleProviderLogin, 
    handleEmailPasswordAuth, 
    updateUserProfile, 
    createUserData 
} from '../services/auth.service';
import { checkUserExists, createUserDocument } from '../services/user.service';
import { useAuthRedirect } from './useAuthRedirect';
import { useRegistration } from './useRegistration';
import { showToast } from '../../../components/toasts';
import { UserCredential, User, OAuthProvider } from 'firebase/auth';
import { encodeUserId } from '@/app/utils/id-encoder';

interface PendingCredentials {
    user: UserCredential['user'];
    email: string;
    password: string;
}

export const useLoginHandlers = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
    const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true);
    const [showNewUserDialog, setShowNewUserDialog] = useState(false);
    const [showRegistrationDrawer, setShowRegistrationDrawer] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            showToast('Connected', 'success', 'Internet connection restored');
        };

        const handleOffline = () => {
            setIsOnline(false);
            showToast('Disconnected', 'error', 'No internet connection');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const {
        showNewUserDialog: registrationShowNewUserDialog,
        showRegistrationDrawer: registrationShowRegistrationDrawer,
        setShowRegistrationDrawer: registrationSetShowRegistrationDrawer,
        setShowNewUserDialog: registrationSetShowNewUserDialog,
        handleNewUserConfirmation,
        handleRegistration: originalHandleRegistration,
        pendingCredentials,
        setPendingCredentials
    } = useRegistration();

    const { handleRedirectResult } = useAuthRedirect(setPendingCredentials, registrationSetShowNewUserDialog);

    const handleProviderLoginWithState = async (provider: any, providerName: string) => {
        if (!isOnline) {
            showToast('Error', 'error', 'No internet connection. Please check your network.');
            return;
        }

        try {
            setLoadingProvider(providerName);
            await handleProviderLogin(provider, providerName);
        } finally {
            setLoadingProvider(null);
        }
    };

    const handleEmailPasswordLogin = async (e: React.FormEvent, email: string, password: string) => {
        e.preventDefault();
        if (!isOnline) {
            showToast('Error', 'error', 'No internet connection');
            return null;
        }

        let rateLimitError = false;
        try {
            setIsLoading(true);
            const { user, isNewUser } = await handleEmailPasswordAuth(email, password);
            
            if (isNewUser || !user.displayName) {
                setPendingCredentials({ user, email, password });
                setShowNewUserDialog(true);
                return null;
            }

            return await handleSuccessfulLogin(user);
        } catch (error: any) {
            console.error('Error during email/password login:', error);
            showToast(
                "Login Failed", 
                "error", 
                error.message || 'An error occurred during login'
            );

            if (error.message.includes('wait')) {
                rateLimitError = true;
                // Keep the loading state for rate limit duration
                setTimeout(() => setIsLoading(false), 30000);
                return null;
            }
        } finally {
            if (!rateLimitError) {
                setIsLoading(false);
            }
        }
        return null;
    };

    const handleSuccessfulLogin = async (user: User) => {
        try {
            // Remove localStorage and URL encoding
            const uid = user.uid;
            // Return the uid instead of navigation
            return uid;
        } catch (error) {
            console.error('Login success handler error:', error);
            showToast('Error', 'error', 'Failed to process login');
            throw error;
        }
    };

    const handleRegistration = async (data: { name: string, photoURL?: string, dateOfBirth: string }) => {
        if (!data.dateOfBirth) {
            showToast("Registration Failed", "error", "Date of birth is required");
            return null;
        }

        try {
            setIsLoading(true);
            const user = pendingCredentials?.user;
            
            if (!user) {
                throw new Error("No user credentials found");
            }

            // First update the profile with correct type
            await updateUserProfile(user, {
                displayName: data.name,
                photoURL: data.photoURL || null
            });

            // Then save to Realtime Database
            await createUserData(user.uid, {
                displayName: data.name,
                email: user.email,
                photoURL: data.photoURL || null,
                dateOfBirth: data.dateOfBirth,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                isNewUser: true
            });

            showToast("Registration Complete", "success", "Welcome to Eazymass!");
            return user.uid;
        } catch (error: any) {
            console.error('Error during registration:', error);
            showToast("Registration Failed", "error", error.message);
            throw error;
        } finally {
            setIsLoading(false);
            setPendingCredentials(null);
            setShowRegistrationDrawer(false);
        }
    };

    // Create a proper handler for registration drawer close
    const handleRegistrationDrawerClose = () => {
        setShowRegistrationDrawer(false);
        // Also clear pending credentials if drawer is closed
        setPendingCredentials(null);
    };

    // Add proper handler for new user dialog confirmation
    const handleNewUserDialogConfirm = (confirmed: boolean) => {
        setShowNewUserDialog(false);
        if (confirmed) {
            setShowRegistrationDrawer(true);
        } else {
            setPendingCredentials(null);
        }
    };

    const handleMicrosoftLogin = async () => {
        // try {
        //     setLoadingProvider('microsoft');
        //     const { user, isNewUser } = await handleProviderLoginWithState(providers.microsoft, 'Microsoft');
            
        //     if (isNewUser || !user.displayName) {
        //         setPendingCredentials({ user });
        //         setShowNewUserDialog(true);
        //         return null;
        //     }

        //     return await handleSuccessfulLogin(user);
        // } catch (error) {
        //     console.error('Microsoft login error:', error);
        //     showToast('Error', 'error', 'Microsoft login failed');
        //     throw error;
        // } finally {
        //     setLoadingProvider(null);
        // }
    };

    return {
        isLoading,
        email,
        setEmail,
        password,
        setPassword,
        loadingProvider,
        handleGoogleLogin: () => handleProviderLoginWithState(providers.google, 'google'),
        handleFacebookLogin: () => handleProviderLoginWithState(providers.facebook, 'facebook'),
        handleGithubLogin: () => handleProviderLoginWithState(providers.github, 'github'),
        handleMicrosoftLogin,
        handleEmailPasswordLogin,
        showNewUserDialog,
        showRegistrationDrawer,
        setShowRegistrationDrawer,
        handleNewUserConfirmation,
        handleRegistration,
        pendingCredentials,
        handleRedirectResult,
        isOnline,
        handleNewUserDialogConfirm,
        handleRegistrationDrawerClose
    };
};