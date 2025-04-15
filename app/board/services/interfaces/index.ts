import { Sidebar } from "@/components/ui/sidebar"

export interface UserData {
  displayName: string;
  email: string;
  dateOfBirth?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  avatar?: string;
  lastLogin: string;
  createdAt: string;
  isNewUser: boolean;
  weights?: WeightEntry[];
}

export interface WeightEntry {
  id?: string;
  date: string;
  weight: number;
  createdAt: string;
  userId: string;
  bmi?: number;
}

export interface UserUpdate {
  displayName?: string;
  photoURL?: string;
  dateOfBirth?: string;
  age?: number;
  height?: number;
  gender?: 'male' | 'female' | 'other';
}

export interface CacheMetadata {
  expiresAt: number;
  lastAccessed: number;
  accessCount: number;
}

export interface ServiceErrorParams {
  message: string;
  code: string;
}

export interface EditProfileFormData {
  name: string;
  email: string;
  dateOfBirth: Date;
  age: number;
  height: number;
  gender: string;
  avatar: string;
}

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userId: string;
  userData: UserData | null;
  onAddWeight: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
}

export interface EditProfileProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: () => void;
}

export interface GetWeightProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onWeightAdded: () => void;
  userHeight?: number;
}