import { User } from 'firebase/auth';

export type Gender = 'male' | 'female' | 'other' | 'prefer-not-to-say';

export interface AuthResult {
  user: User;
  isNewUser?: boolean;
}

export interface UserCredentials {
    user: User;
    email: string;
    password: string;
}

export interface UserDocument {
    id: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    createdAt: string;
    lastLogin: string;
    dateOfBirth: string | null;
    gender: Gender;
    isNewUser: boolean;
}

export interface RegistrationData {
    name: string;
    dateOfBirth: string;
    photoURL?: string | null;
    gender: Gender;
}