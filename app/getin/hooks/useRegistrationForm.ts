import { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Gender, RegistrationData } from '../types/registration';

export function useRegistrationForm(onSubmit: (data: RegistrationData) => Promise<void>) {
    const [name, setName] = useState('');
    const [dob, setDob] = useState<Date>(new Date());
    const [photo, setPhoto] = useState<string | null>(null);
    const [gender, setGender] = useState<Gender>('prefer-not-to-say');
    const [height, setHeight] = useState<number>(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePhotoUpload = async (file: File) => {
        try {
            setIsUploading(true);
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            setPhoto(base64);
        } catch (error) {
            toast.error('Failed to upload photo');
        } finally {
            setIsUploading(false);
        }
    };

    const validateForm = (): boolean => {
        if (!name.trim()) {
            toast.error('Name is required');
            return false;
        }
        if (!dob) {
            toast.error('Date of birth is required');
            return false;
        }
        if (!gender) {
            toast.error('Gender is required');
            return false;
        }
        if (!height || height < 1 || height > 300) {
            toast.error('Height must be between 1 and 300 cm');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            setIsSubmitting(true);
            await onSubmit({
                name: name.trim(),
                dateOfBirth: format(dob, 'yyyy-MM-dd'),
                photoURL: photo,
                gender,
                height
            });
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Failed to complete registration');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        name,
        setName,
        dob,
        setDob,
        photo,
        gender,
        setGender,
        height,
        setHeight,
        isUploading,
        isSubmitting,
        handlePhotoUpload,
        handleSubmit
    };
}