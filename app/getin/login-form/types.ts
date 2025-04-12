import type { ComponentPropsWithoutRef } from 'react';

export type FormSubmitHandler = (e: React.FormEvent, email: string, password: string) => Promise<void>;

export interface BaseInputProps {
  isLoading: boolean;
  error?: string;
}

export interface EmailInputProps extends BaseInputProps {
  email: string;
  setEmail: (value: string) => void;
}

export interface PasswordInputProps extends BaseInputProps {
  password: string;
  setPassword: (value: string) => void;
}

export interface LoginFormProps extends Omit<ComponentPropsWithoutRef<"div">, "onSubmit"> {
  isLoading: boolean;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  onSubmit: FormSubmitHandler;
  onGoogleLogin: () => void;
  onFacebookLogin: () => void;
  onGithubLogin: () => void;
  onMicrosoftLogin: () => void;
  loadingProvider: string | null;
}