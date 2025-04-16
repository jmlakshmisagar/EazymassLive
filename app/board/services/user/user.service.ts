import { ref, get, set, update } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { UserData, UserUpdate } from '../interfaces';
import { ServiceError } from '../core/errors';

interface WeightEntryInput {
  userId: string;
  weight: number;
  date: string;
  createdAt: string;
}

export const userService = {
  async getUserProfile(userId: string): Promise<UserData | null> {
    try {
      const userRef = ref(rtdb, `users/${userId}`);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        return null;
      }

      return snapshot.val() as UserData;
    } catch (error) {
      throw ServiceError.create(
        'Failed to fetch user profile',
        'USER_FETCH_FAILED'
      );
    }
  },

  async updateProfile(userId: string, data: UserUpdate): Promise<UserData> {
    try {
      const userRef = ref(rtdb, `users/${userId}`);
      const updates = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      await update(userRef, updates);
      
      const updatedProfile = await this.getUserProfile(userId);
      if (!updatedProfile) {
        throw new Error('Failed to fetch updated profile');
      }
      
      return updatedProfile;
    } catch (error) {
      throw ServiceError.create(
        'Failed to update profile',
        'PROFILE_UPDATE_FAILED'
      );
    }
  },

  async addWeightEntry(entry: WeightEntryInput, userHeight?: number): Promise<void> {
    try {
      const userRef = ref(rtdb, `users/${entry.userId}/weights`);
      const snapshot = await get(userRef);
      const currentWeights = snapshot.val() || [];
      
      const newEntry = {
        ...entry,
        bmi: userHeight ? (entry.weight / ((userHeight/100) ** 2)) : undefined,
        id: Date.now().toString()
      };
      
      await set(userRef, [...currentWeights, newEntry]);
    } catch (error) {
      throw ServiceError.create(
        'Failed to add weight entry',
        'WEIGHT_ADD_FAILED'
      );
    }
  }
};