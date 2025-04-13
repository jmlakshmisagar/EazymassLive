import { ref, get } from "firebase/database";
import { db, rtdb } from "@/lib/firebase";
import { decodeUserId } from "@/app/utils/id-encoder";
import { 
  collection, 
  doc, 
  updateDoc, 
  addDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  where 
} from "firebase/firestore";

interface FirebaseUserData {
  displayName: string;
  email: string;
  dateOfBirth: string;
  avatar?: string;
  lastLogin: string;
  createdAt: string;
  isNewUser: boolean;
}

export interface UserData {
  name: string;
  email: string;
  dateOfBirth?: string;
  avatar?: string;
  lastLogin: string;
  createdAt?: string;
  isNewUser?: boolean;
}

interface WeightEntry {
  date: Date;
  weight: number;
  userId: string;
  note?: string;
}

interface UserUpdate {
  displayName?: string;
  photoURL?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
}

class UserServiceError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'UserServiceError';
  }
}

export const userService = {
  async fetchUserData(encodedUserId: string): Promise<FirebaseUserData> {
    try {
      const userId = decodeUserId(encodedUserId);
      const userRef = ref(rtdb, `users/${userId}`);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        throw new UserServiceError('User not found', 'USER_NOT_FOUND');
      }
      
      return snapshot.val();
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw new UserServiceError('Failed to fetch user data', 'FETCH_USER_FAILED');
    }
  },

  async addWeightEntry(data: WeightEntry) {
    if (!data.userId || !data.date || !data.weight) {
      throw new UserServiceError('Missing required fields', 'INVALID_DATA');
    }

    try {
      const weightsRef = collection(db, 'users', data.userId, 'weights');
      const docRef = await addDoc(weightsRef, {
        date: data.date,
        weight: data.weight,
        note: data.note || '',
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding weight entry:', error);
      throw new UserServiceError('Failed to add weight entry', 'ADD_WEIGHT_FAILED');
    }
  },

  async updateUserProfile(userId: string, updates: UserUpdate) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new UserServiceError('User not found', 'USER_NOT_FOUND');
      }

      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date()
      });

      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new UserServiceError('Failed to update profile', 'UPDATE_PROFILE_FAILED');
    }
  },

  async getWeightHistory(userId: string, maxResults = 10) {
    try {
      const weightsRef = collection(db, 'users', userId, 'weights');
      const q = query(
        weightsRef, 
        orderBy('date', 'desc'),
        limit(maxResults)
      );
      
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate() // Convert Firestore Timestamp to Date
      }));
    } catch (error) {
      console.error('Error getting weight history:', error);
      throw new UserServiceError('Failed to fetch weight history', 'FETCH_HISTORY_FAILED');
    }
  },

  async getWeightStats(userId: string) {
    try {
      const weightsRef = collection(db, 'users', userId, 'weights');
      const snapshot = await getDocs(
        query(weightsRef, orderBy('date', 'desc'), limit(30))
      );

      const weights = snapshot.docs.map(doc => doc.data().weight);
      
      return {
        current: weights[0] || 0,
        average: weights.length ? 
          weights.reduce((a, b) => a + b, 0) / weights.length : 0,
        min: weights.length ? Math.min(...weights) : 0,
        max: weights.length ? Math.max(...weights) : 0
      };
    } catch (error) {
      console.error('Error getting weight stats:', error);
      throw new UserServiceError('Failed to fetch weight stats', 'FETCH_STATS_FAILED');
    }
  }
};