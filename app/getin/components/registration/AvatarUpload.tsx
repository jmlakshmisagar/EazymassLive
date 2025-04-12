import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AvatarUploadProps {
    photoURL: string;
    name: string;
}

export function AvatarUpload({ photoURL, name }: AvatarUploadProps) {
    return (
        <div className="flex justify-center mb-6">
            <Avatar className="w-24 h-24">
                <AvatarImage src={photoURL} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {name ? name.charAt(0).toUpperCase() : '?'}
                </AvatarFallback>
            </Avatar>
        </div>
    );
}