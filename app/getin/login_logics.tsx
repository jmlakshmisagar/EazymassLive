"use client";
import { useState, useEffect } from "react";
import { 
    getAuth, 
    signInWithRedirect, 
    GoogleAuthProvider,
    FacebookAuthProvider,
    GithubAuthProvider,
    OAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    getRedirectResult
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import app from "../firebaseConfig";
import { showToast } from '../../components/toasts';

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');

export const useLoginHandlers = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
    const [showNewUserDialog, setShowNewUserDialog] = useState(false);
    const [showRegistrationDrawer, setShowRegistrationDrawer] = useState(false);
    const [pendingCredentials, setPendingCredentials] = useState<any>(null);

    const createUserDocument = async (user: any, additionalData = {}) => {
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            await setDoc(userRef, {
                id: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                dateOfBirth: null,
                ...additionalData
            });
        } else {
            await setDoc(userRef, {
                lastLogin: new Date().toISOString()
            }, { merge: true });
        }
    };

    const checkUserExists = async (uid: string) => {
        const userRef = doc(db, 'users', uid);
        const userSnapshot = await getDoc(userRef);
        return userSnapshot.exists();
    };

    const handleNewUserConfirmation = async (confirmed: boolean) => {
        if (confirmed) {
            setShowNewUserDialog(false);
            setShowRegistrationDrawer(true);
        } else {
            setShowNewUserDialog(false);
            setPendingCredentials(null);
        }
    };

    const handleProviderLogin = async (provider: any, providerName: string) => {
        try {
            setLoadingProvider(providerName);
            await signInWithRedirect(auth, provider);
            // Note: The rest of this code won't execute immediately
            // It will run after redirect when the user comes back
            // You should handle the result in a separate function using getRedirectResult
            
        } catch (error) {
            console.error('Error during login:', error);
            showToast(
                "Login Failed", 
                "error", 
                `Failed to login with ${providerName}`
            );
        } finally {
            setLoadingProvider(null);
        }
    };

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
                showToast(
                    "Login Successful", 
                    "success", 
                    "Successfully logged in"
                );
                window.location.href = '/board';
            }
        } catch (error) {
            console.error('Error handling redirect result:', error);
            showToast(
                "Login Failed", 
                "error", 
                "Failed to complete authentication"
            );
        }
    };

    const handleEmailPasswordLogin = async (e: React.FormEvent, email: string, password: string) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            if (!email || !password) {
                showToast("Missing Fields", "error", "Please fill in all fields");
                return;
            }

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userExists = await checkUserExists(userCredential.user.uid);
            
            if (!userExists) {
                setPendingCredentials({ user: userCredential.user, email, password });
                setShowNewUserDialog(true);
                return;
            }

            const user = userCredential.user;

            if (user) {
                await createUserDocument(user);
                localStorage.setItem('uid', user.uid);
                showToast("Login Successful", "success", "Welcome back!");
                window.location.href = `/board`;
            }
        } catch (error: any) {
            console.error('Error during email/password login:', error);
            let errorMessage = "Failed to login with email/password";
            
            switch (error.code) {
                case 'auth/invalid-credential':
                    errorMessage = "Invalid email or password. Please check your credentials.";
                    break;
                case 'auth/wrong-password':
                    errorMessage = "Invalid password. Please try again.";
                    break;
                case 'auth/user-not-found':
                    errorMessage = "No account found with this email.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "Invalid email address format.";
                    break;
                case 'auth/too-many-requests':
                    errorMessage = "Too many failed attempts. Please try again later.";
                    break;
                case 'auth/network-request-failed':
                    errorMessage = "Network error. Please check your connection.";
                    break;
            }
            
            showToast("Login Failed", "error", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailPasswordSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            if (!email || !password) {
                showToast("Missing Fields", "error", "Please fill in all fields");
                return;
            }
            if (password.length < 6) {
                showToast(
                    "Invalid Password", 
                    "error", 
                    "Password must be at least 6 characters"
                );
                return;
            }
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await createUserDocument(user);
            localStorage.setItem('uid', user.uid);
            showToast("Account Created", "success", "Welcome to Eazymass!");
            window.location.href = `/board`;
        } catch (error: any) {
            console.error('Error during signup:', error);
            showToast(
                "Signup Failed", 
                "error", 
                error.message || "Failed to create account"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegistration = async (data: any) => {
        try {
            setIsLoading(true);
            const user = pendingCredentials?.user;
            if (!user) {
                throw new Error("No user credentials found");
            }

            await createUserDocument(user, {
                displayName: data.name,
                dateOfBirth: data.dateOfBirth,
                photoURL: data.photoURL
            });

            showToast("Registration Complete", "success", "Welcome to Eazymass!");
            window.location.href = '/board';
        } catch (error: any) {
            console.error('Error during registration:', error);
            showToast(
                "Registration Failed", 
                "error", 
                error.message || "Failed to complete registration"
            );
        } finally {
            setIsLoading(false);
            setPendingCredentials(null);
        }
    };

    useEffect(() => {
        handleRedirectResult();
    }, []);

    return {
        isLoading,
        error,
        email,
        setEmail,
        password,
        setPassword,
        loadingProvider,
        handleGoogleLogin: () => handleProviderLogin(googleProvider, 'google'),
        handleFacebookLogin: () => handleProviderLogin(facebookProvider, 'facebook'),
        handleGithubLogin: () => handleProviderLogin(githubProvider, 'github'),
        handleMicrosoftLogin: () => handleProviderLogin(microsoftProvider, 'microsoft'),
        handleEmailPasswordLogin,
        handleEmailPasswordSignUp,
        handleRegistration,
        showNewUserDialog,
        showRegistrationDrawer,
        setShowRegistrationDrawer,
        handleNewUserConfirmation,
        pendingCredentials,
        handleRedirectResult
    };
};
