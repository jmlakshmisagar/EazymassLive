"use client";

import { formatDate, cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import Spinner from "@/components/spinner";
import { AvatarUpload } from "./registration/AvatarUpload";
import { useRegistrationForm } from "../hooks/useRegistrationForm";
import type { RegistrationDrawerProps } from "../types/registration";

export function RegistrationDrawer({ isOpen, onClose, onSubmit }: RegistrationDrawerProps) {
    const {
        name,
        setName,
        dob,
        setDob,
        photo,
        isUploading,
        isSubmitting,
        handlePhotoUpload,
        handleSubmit
    } = useRegistrationForm(onSubmit);

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className="flex flex-col items-center">
                <DrawerHeader className="text-center">
                    <DrawerTitle>Complete Your Profile</DrawerTitle>
                </DrawerHeader>
                <form onSubmit={handleSubmit} className="w-full max-w-md p-6 space-y-6">
                    <AvatarUpload photoURL={photo} name={name} />

                    {/* Form fields */}
                    <div className="space-y-6">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Date of Birth */}
                        <div className="space-y-2">
                            <Label>Date of Birth *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                        disabled={isSubmitting}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formatDate(dob)}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={dob}
                                        onSelect={setDob}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Photo Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="photo">Profile Photo (Optional)</Label>
                            <Input
                                id="photo"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handlePhotoUpload(file);
                                }}
                                disabled={isUploading || isSubmitting}
                            />
                            {isUploading && (
                                <div className="flex items-center justify-center gap-2">
                                    <Spinner size="small" />
                                    <span>Uploading...</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            className="flex-1"
                            disabled={isSubmitting || isUploading}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Spinner size="small" />
                                    <span>Getting In...</span>
                                </div>
                            ) : (
                                "Get In"
                            )}
                        </Button>
                    </div>
                </form>
            </DrawerContent>
        </Drawer>
    );
}

export default RegistrationDrawer;