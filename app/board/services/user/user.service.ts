import { ref, get, set, update } from 'firebase/database';
import { auth, rtdb } from '@/lib/firebase';
import { UserData, WeightData } from '../interfaces';
import { ServiceError } from '../core/errors';

export const userService = {
  async getUserProfile(userId: string): Promise<UserData | null> {
    try {
      const userRef = ref(rtdb, `users/${userId}`);
      const snapshot = await get(userRef);
      return snapshot.exists() ? snapshot.val() as UserData : null;
    } catch (error) {
      throw ServiceError.create('Failed to fetch user profile', 'USER_FETCH_FAILED');
    }
  },

  async updateProfile(userId: string, data: Partial<UserData>): Promise<void> {
    try {
      const userRef = ref(rtdb, `users/${userId}`);
      await update(userRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      throw ServiceError.create('Failed to update profile', 'PROFILE_UPDATE_FAILED');
    }
  },

  async addWeightEntry(userId: string, weightData: Omit<WeightData, 'id'>): Promise<void> {
    try {
      const weightRef = ref(rtdb, `users/${userId}/weights`);
      const snapshot = await get(weightRef);
      const currentWeights = snapshot.val() || [];
      
      const newWeight = {
        ...weightData,
        id: Date.now().toString()
      };

      await set(weightRef, [...currentWeights, newWeight]);
    } catch (error) {
      throw ServiceError.create('Failed to add weight entry', 'WEIGHT_ADD_FAILED');
    }
  },

  async logout(): Promise<void> {
    try {
      console.log("object");
    } catch (error) {
      throw ServiceError.create('Failed to logout', 'LOGOUT_FAILED');
    }
  }
};