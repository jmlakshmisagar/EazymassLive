import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";
import { decodeUserId } from "@/app/utils/id-encoder";

export interface UserData {
  name: string;
  email: string;
  avatar: string;
}

export async function fetchUserData(encodedUserId: string): Promise<UserData> {
  try {
    const userId = decodeUserId(encodedUserId);
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    
    throw new Error('User not found');
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      name: 'Guest User',
      email: '',
      avatar: '/avatars/default.png'
    };
  }
}