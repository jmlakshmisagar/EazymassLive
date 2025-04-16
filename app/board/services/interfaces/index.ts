import { Sidebar } from "@/components/ui/sidebar"

export interface UserData {
  displayName: string;
  email: string;
  avatar?: string;
  dateOfBirth?: string;
  age?: number;
  height?: number;
  gender?: 'male' | 'female' | 'other';
  lastLogin: string;
  createdAt: string;
  isNewUser: boolean;
  weights?: WeightEntry[];
  updatedAt?: string;
}

export interface CacheMetadata {
  expiresAt: number;
  lastAccessed: number;
  accessCount: number;
}

export interface WeightEntry {
  id?: string;
  userId: string;
  weight: number;
  date: string;
  createdAt: string;
  bmi?: number;
}

export interface UserUpdate {
  displayName?: string;
  photoURL?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  age?: number;
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

export interface AppSidebarProps {
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