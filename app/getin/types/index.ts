import { FormEvent } from 'react';

export type Gender = 'male' | 'female' | 'other' | 'prefer-not-to-say';

export interface WeightEntry {
    id: string;
    date: string;
    weight: number;
    bmi?: number;
    createdAt: string;
}

export interface UserDocument {
    id: string;
    email: string;
    displayName: string;
    dateOfBirth: string;
    gender: Gender;
    height: number;
    createdAt: string;
    lastLogin: string;
    isNewUser: boolean;
    weights?: WeightEntry[];
}

export interface RegistrationData {
    name: string;
    dateOfBirth: string;
    gender: Gender;
    height: number;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginPageLayoutProps {
  isLoading?: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onSubmit: (e: FormEvent, email: string, password: string) => Promise<void>;
  onGoogleLogin: () => void;
  onFacebookLogin: () => void;
  onGithubLogin: () => void;
  onMicrosoftLogin: () => void;
  loadingProvider: string | null;
  showNewUserDialog: boolean;
  showRegistrationDrawer: boolean;
  onNewUserConfirmation: (confirmed: boolean) => void;
  onRegistrationDrawerClose: () => void;
  onRegistration: (data: RegistrationData) => Promise<void>;
}