import { useEffect } from 'react';
import { getRedirectResult } from 'firebase/auth';
import { auth } from '../services/auth.service';
import { checkUserExists, createUserDocument } from '../services/user.service';
import { showToast } from '../../../components/toasts';

export const useAuthRedirect = (setPendingCredentials: (creds: any) => void, setShowNewUserDialog: (show: boolean) => void) => {
    const handleRedirectResult = async () => {
        try {
            const result = await getRedirectResult(auth);
            if (result && result.user) {
                const userExists = await checkUserExists(result.user.uid);
                
                if (!userExists) {
                    setPendingCredentials(result);
                    setShowNewUserDialog(true);
                    return;
                }
                await createUserDocument(result.user);
                localStorage.setItem('uid', result.user.uid);
                showToast("Login Successful", "success", "Successfully logged in");
                window.location.href = '/board';
            }
        } catch (error) {
            console.error('Error handling redirect result:', error);
            showToast("Login Failed", "error", "Failed to complete authentication");
        }
    };

    useEffect(() => {
        handleRedirectResult();
    }, []);

    return { handleRedirectResult };
};