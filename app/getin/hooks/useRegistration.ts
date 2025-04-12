import { useState } from 'react';
import { createUserDocument } from '../services/user.service';
import { showToast } from '../../../components/toasts';
import { RegistrationData, UserCredentials } from '../types/auth.types';

export const useRegistration = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showNewUserDialog, setShowNewUserDialog] = useState(false);
    const [showRegistrationDrawer, setShowRegistrationDrawer] = useState(false);
    const [pendingCredentials, setPendingCredentials] = useState<UserCredentials | null>(null);

    const validateRegistrationData = (data: RegistrationData) => {
        if (!data.name?.trim()) {
            throw new Error('Name is required');
        }
        if (!data.dateOfBirth) {
            throw new Error('Date of birth is required');
        }
        // Add any other validations you need
    };

    const handleNewUserConfirmation = (confirmed: boolean) => {
        if (confirmed) {
            setShowNewUserDialog(false);
            setShowRegistrationDrawer(true);
        } else {
            setShowNewUserDialog(false);
            setPendingCredentials(null);
        }
    };

    const handleRegistration = async (data: RegistrationData) => {
        try {
            setIsLoading(true);
            validateRegistrationData(data);

            const user = pendingCredentials?.user;
            if (!user) {
                throw new Error("No user credentials found");
            }

            await createUserDocument(user, {
                displayName: data.name.trim(),
                dateOfBirth: data.dateOfBirth,
                photoURL: data.photoURL?.trim() || null
            });

            showToast("Registration Complete", "success", "Welcome to Eazymass!");
            window.location.href = '/board';
        } catch (error: any) {
            console.error('Error during registration:', error);
            showToast("Registration Failed", "error", error.message || "Failed to complete registration");
        } finally {
            setIsLoading(false);
            setPendingCredentials(null);
        }
    };

    return {
        isLoading,
        showNewUserDialog,
        setShowNewUserDialog,
        showRegistrationDrawer,
        setShowRegistrationDrawer,
        handleNewUserConfirmation,
        handleRegistration,
        pendingCredentials,
        setPendingCredentials
    };
};