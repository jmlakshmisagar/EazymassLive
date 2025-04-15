"use client";

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { CalendarIcon } from "lucide-react";
import { userService } from '../services/user.service';
import { toast } from 'sonner';
import { EditProfileProps, EditProfileFormData } from '../services/interfaces';

export default function EditProfile({ 
    userId, 
    isOpen, 
    onClose,
    onProfileUpdated 
}: EditProfileProps) {
    const [formData, setFormData] = useState<EditProfileFormData>({
        name: '',
        email: '',
        dateOfBirth: new Date(),
        age: 0,
        height: 0,
        gender: '',
        avatar: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [profileImage, setProfileImage] = useState<string>('/default-avatar.png');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await userService.getUserProfile(userId);
                if (profile) {
                    setFormData({
                        name: profile.displayName,
                        email: profile.email,
                        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : new Date(),
                        age: profile.age || 0,
                        height: profile.height || 0,
                        gender: profile.gender || '',
                        avatar: profile.avatar || ''
                    });
                    setProfileImage(profile.avatar || '/default-avatar.png');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                toast.error('Failed to load profile');
            }
        };

        if (isOpen && userId) {
            fetchProfile();
        }
    }, [isOpen, userId]);

    const calculateAge = (birthDate: Date) => {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (formData.height <= 0) {
            newErrors.height = 'Please enter a valid height';
        }

        if (!formData.gender) {
            newErrors.gender = 'Please select a gender';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            setIsLoading(true);
            await userService.updateProfile(userId, {
                displayName: formData.name,
                photoURL: formData.avatar,
                dateOfBirth: format(formData.dateOfBirth, 'yyyy-MM-dd'),
                gender: formData.gender as 'male' | 'female' | 'other',
                height: formData.height,
                age: formData.age
            });
            
            toast.success('Profile updated successfully');
            onProfileUpdated();
            onClose();
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    setProfileImage(base64String);
                    setFormData(prev => ({ ...prev, avatar: base64String }));
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Error uploading image:', error);
                toast.error('Failed to upload image');
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image upload section */}
                    <div className="flex flex-col items-center space-y-2">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden">
                            <Image
                                src={profileImage}
                                alt="Profile"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Change Photo
                        </Button>
                    </div>

                    {/* Form fields */}
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Name and Email fields */}
                            <div className="space-y-2">
                                <label>Name</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ 
                                        ...prev, 
                                        name: e.target.value 
                                    }))}
                                    placeholder="Enter name"
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <label>Email</label>
                                <Input
                                    value={formData.email}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>
                        </div>

                        {/* Height and Gender fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label>Height (cm)</label>
                                <Input
                                    type="number"
                                    value={formData.height}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        height: parseFloat(e.target.value)
                                    }))}
                                    placeholder="Enter height"
                                />
                                {errors.height && <p className="text-red-500 text-sm">{errors.height}</p>}
                            </div>
                            <div className="space-y-2">
                                <label>Gender</label>
                                <Select
                                    value={formData.gender}
                                    onValueChange={(value) => setFormData(prev => ({ 
                                        ...prev, 
                                        gender: value 
                                    }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                            </div>
                        </div>

                        {/* Date of Birth field */}
                        <div className="space-y-2">
                            <label>Date of Birth</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !formData.dateOfBirth && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.dateOfBirth ? (
                                            format(formData.dateOfBirth, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={formData.dateOfBirth}
                                        onSelect={(date) => date && setFormData(prev => ({
                                            ...prev,
                                            dateOfBirth: date,
                                            age: calculateAge(date)
                                        }))}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Updating...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}