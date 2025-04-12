export interface RegistrationData {
    name: string;
    dateOfBirth: string;
    photoURL: string | null;
}

export interface RegistrationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: RegistrationData) => Promise<void>;
}