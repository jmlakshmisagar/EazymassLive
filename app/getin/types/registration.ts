export type Gender = 'male' | 'female' | 'other' | 'prefer-not-to-say';

export interface UserDocument {
    id: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    createdAt: string;
    lastLogin: string;
    dateOfBirth: string | null;
    gender: Gender;
    height?: number; // Add height field
    isNewUser: boolean;
}

export interface RegistrationData {
    name: string;
    dateOfBirth: string;
    photoURL?: string | null;
    gender: Gender;
    height?: number;
}

export interface RegistrationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: RegistrationData) => Promise<void>;
}