import { useState, useEffect } from 'react';
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
import { UserCredential } from 'firebase/auth';

interface PendingCredentials {
    user: UserCredential['user'];
    email: string;
    password: string;
}

export const useLoginHandlers = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

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
        showNewUserDialog,
        showRegistrationDrawer,
        setShowRegistrationDrawer,
        setShowNewUserDialog,
        handleNewUserConfirmation,
        handleRegistration: originalHandleRegistration,
        pendingCredentials,
        setPendingCredentials
    } = useRegistration();

    const { handleRedirectResult } = useAuthRedirect(setPendingCredentials, setShowNewUserDialog);

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
            return;
        }

        let rateLimitError = false;
        try {
            setIsLoading(true);
            const { user, isNewUser } = await handleEmailPasswordAuth(email, password);
            
            if (isNewUser || !user.displayName) {
                setPendingCredentials({ user, email, password });
                setShowNewUserDialog(true);
                return;
            }

            localStorage.setItem('uid', user.uid);
            showToast("Login Successful", "success", "Welcome back!");
            window.location.href = '/board';
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
                return;
            }
        } finally {
            if (!rateLimitError) {
                setIsLoading(false);
            }
        }
    };

    const handleRegistration = async (data: { name: string, photoURL?: string, dateOfBirth: string }) => {
        if (!data.dateOfBirth) {
            showToast("Registration Failed", "error", "Date of birth is required");
            return;
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
            localStorage.setItem('uid', user.uid);
            window.location.href = '/board';
        } catch (error: any) {
            console.error('Error during registration:', error);
            showToast("Registration Failed", "error", error.message);
        } finally {
            setIsLoading(false);
            setPendingCredentials(null);
        }
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
        handleMicrosoftLogin: () => handleProviderLoginWithState(providers.microsoft, 'microsoft'),
        handleEmailPasswordLogin,
        showNewUserDialog,
        showRegistrationDrawer,
        setShowRegistrationDrawer,
        handleNewUserConfirmation,
        handleRegistration,
        pendingCredentials,
        handleRedirectResult,
        isOnline
    };
};