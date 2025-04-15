import { ref, get } from "firebase/database";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { rtdb, db } from "@/lib/firebase";
import { decodeUserId } from "@/app/utils/id-encoder";
import { UserData, UserUpdate } from "../interfaces";
import { ServiceError } from "../core/errors";
import { CacheService } from "../cache/cache.service";

export class UserService {
  static async fetchUserData(encodedUserId: string): Promise<UserData> {
    try {
      const userId = decodeUserId(encodedUserId);
      const userData = await this.getUserFromDb(userId);
      await CacheService.setCachedData(userId, userData);
      return userData;
    } catch (error) {
      throw new ServiceError({
        message: 'Failed to fetch user data',
        code: 'FETCH_USER_FAILED'
      });
    }
  }

  static async updateProfile(userId: string, updates: UserUpdate): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new ServiceError({
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      // Calculate age if dateOfBirth is provided
      const age = updates.dateOfBirth ? 
          this.calculateAge(new Date(updates.dateOfBirth)) : 
          undefined;

      await updateDoc(userRef, {
        ...updates,
        age,
        updatedAt: new Date().toISOString()
      });

      await CacheService.clearCache(userId);
      return true;
    } catch (error) {
      throw new ServiceError({
        message: 'Failed to update profile',
        code: 'UPDATE_PROFILE_FAILED'
      });
    }
  }

  private static calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  private static async getUserFromDb(userId: string): Promise<UserData> {
    const userRef = ref(rtdb, `users/${userId}`);
    const snapshot = await get(userRef);
    
    if (!snapshot.exists()) {
      throw new ServiceError({
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }
    
    return snapshot.val();
  }
}