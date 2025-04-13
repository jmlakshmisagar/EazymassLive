import { useState } from 'react';
import { createUserDocument } from '../services/user.service';
import { showToast } from '../../../components/toasts';
import { RegistrationData, UserCredentials } from '../types/auth.types';
import { encodeUserId } from '@/app/utils/id-encoder';

// Add type for gender
type Gender = 'male' | 'female' | 'other' | 'prefer-not-to-say';

export const useRegistration = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showNewUserDialog, setShowNewUserDialog] = useState(false);
    const [showRegistrationDrawer, setShowRegistrationDrawer] = useState(false);
    const [pendingCredentials, setPendingCredentials] = useState<UserCredentials | null>(null);
    const [registeredUserId, setRegisteredUserId] = useState<string | null>(null);

    const validateRegistrationData = (data: RegistrationData) => {
        if (!data.name?.trim()) {
            throw new Error('Name is required');
        }
        if (!data.dateOfBirth) {
            throw new Error('Date of birth is required');
        }
        if (!data.gender || !['male', 'female', 'other', 'prefer-not-to-say'].includes(data.gender)) {
            throw new Error('Valid gender selection is required');
        }

        const dob = new Date(data.dateOfBirth);
        if (isNaN(dob.getTime()) || dob > new Date()) {
            throw new Error('Invalid date of birth');
        }
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

            if (!pendingCredentials?.user) {
                throw new Error("No user credentials found");
            }

            // Save user document
            await createUserDocument(pendingCredentials.user, {
                displayName: data.name.trim(),
                dateOfBirth: data.dateOfBirth,
                photoURL: data.photoURL,
                gender: data.gender,
                isNewUser: true
            });

            const uid = pendingCredentials.user.uid;
            setRegisteredUserId(uid);
            return uid;

        } catch (error) {
            console.error('Registration error:', error);
            showToast('Error', 'error', 'Registration failed');
            throw error;
        } finally {
            setIsLoading(false);
            setPendingCredentials(null);
            setShowRegistrationDrawer(false);
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
        setPendingCredentials,
        registeredUserId
    };
};