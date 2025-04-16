import { useState } from 'react';
import { createUserDocument, UserServiceError } from '../services/user.service';
import { showToast } from '../../../components/toasts';
import { RegistrationData, UserDocument, Gender } from '../types/index';
import { UserCredentials } from '../types/auth.types';

export const useRegistration = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showNewUserDialog, setShowNewUserDialog] = useState(false);
    const [showRegistrationDrawer, setShowRegistrationDrawer] = useState(false);
    const [pendingCredentials, setPendingCredentials] = useState<UserCredentials | null>(null);
    const [registeredUserId, setRegisteredUserId] = useState<string | null>(null);

    const validateRegistrationData = (data: RegistrationData): void => {
        const errors: string[] = [];

        if (!data.name?.trim()) {
            errors.push('Name is required');
        }
        if (!data.dateOfBirth) {
            errors.push('Date of birth is required');
        }
        if (!data.gender || !['male', 'female', 'other', 'prefer-not-to-say'].includes(data.gender)) {
            errors.push('Valid gender selection is required');
        }
        if (data.height !== undefined && (data.height <= 0 || data.height > 300)) {
            errors.push('Height must be between 1 and 300 cm');
        }

        const dob = new Date(data.dateOfBirth);
        if (isNaN(dob.getTime()) || dob > new Date()) {
            errors.push('Invalid date of birth');
        }

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
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

            await createUserDocument(pendingCredentials.user, {
                displayName: data.name.trim(),
                dateOfBirth: data.dateOfBirth,
                gender: data.gender,
                height: data.height,
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