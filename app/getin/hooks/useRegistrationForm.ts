import { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { showToast } from "@/components/toasts";
import type { RegistrationData, Gender } from "../types/registration";

export const useRegistrationForm = (onSubmit: (data: RegistrationData) => Promise<void>) => {
    const [name, setName] = useState("");
    const [dob, setDob] = useState<Date>();
    const [photo, setPhoto] = useState<string | null>(null);
    const [gender, setGender] = useState<Gender>("prefer-not-to-say");
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePhotoUpload = async (file: File) => {
        try {
            setIsUploading(true);
            const storage = getStorage();
            const fileRef = ref(storage, `profile-photos/${file.name}`);
            
            await uploadBytes(fileRef, file);
            const photoURL = await getDownloadURL(fileRef);
            
            setPhoto(photoURL);
            showToast("Photo uploaded", "success");
        } catch (error) {
            console.error('Error uploading photo:', error);
            showToast("Upload failed", "error", "Failed to upload photo");
        } finally {
            setIsUploading(false);
        }
    };

    const validateForm = (): boolean => {
        if (!name.trim()) {
            showToast("Missing name", "error", "Please enter your full name");
            return false;
        }
        if (!dob) {
            showToast("Missing date", "error", "Please select your date of birth");
            return false;
        }
        if (!gender) {
            showToast("Missing gender", "error", "Please select your gender");
            return false;
        }
        if (dob > new Date()) {
            showToast("Invalid date", "error", "Date of birth cannot be in the future");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const registrationData: RegistrationData = {
                name: name.trim(),
                dateOfBirth: dob!.toISOString(),
                photoURL: photo || null,
                gender // This will be typed as Gender
            };

            console.log('Submitting registration data:', registrationData);
            await onSubmit(registrationData);
        } catch (error) {
            console.error('Form submission error:', error);
            showToast('Error', 'error', 'Failed to complete registration');
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
        isUploading,
        isSubmitting,
        handlePhotoUpload,
        handleSubmit
    };
};