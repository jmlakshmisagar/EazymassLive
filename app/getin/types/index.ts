import { FormEvent } from 'react';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegistrationData {
  // Define the structure of RegistrationData here
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