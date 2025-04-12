import { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { showToast } from "@/components/toasts";
import type { RegistrationData } from "../types/registration";

export function useRegistrationForm(onSubmit: (data: RegistrationData) => Promise<void>) {
    const [name, setName] = useState("");
    const [dob, setDob] = useState<Date>();
    const [photo, setPhoto] = useState<string>("");
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
        if (dob > new Date()) {
            showToast("Invalid date", "error", "Date of birth cannot be in the future");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            
            if (!validateForm()) {
                return;
            }

            if (!dob) {
                throw new Error("Date of birth is required");
            }

            await onSubmit({
                name: name.trim(),
                dateOfBirth: dob.toISOString(),
                photoURL: photo || null,
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            showToast(
                "Registration failed", 
                "error", 
                error instanceof Error ? error.message : "Failed to complete registration"
            );
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
        isUploading,
        isSubmitting,
        handlePhotoUpload,
        handleSubmit
    };
}