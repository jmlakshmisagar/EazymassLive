import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AvatarUploadProps {
    photoURL: string | null | undefined;
    name: string;
}

export function AvatarUpload({ photoURL, name }: AvatarUploadProps) {
    // Convert null to undefined for the src prop
    const imageSrc = photoURL || undefined;

    return (
        <div className="flex justify-center mb-6">
            <Avatar className="w-24 h-24">
                <AvatarImage src={imageSrc} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {name ? name.charAt(0).toUpperCase() : '?'}
                </AvatarFallback>
            </Avatar>
        </div>
    );
}