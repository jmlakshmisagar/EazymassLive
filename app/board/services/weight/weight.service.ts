import { ref, get, set } from "firebase/database";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { rtdb, db } from "@/lib/firebase";
import { WeightEntry } from "../interfaces";
import { ServiceError } from "../core/errors";

interface WeightStats {
  current: number;
  average: number;
  min: number;
  max: number;
}

export class WeightService {
  static async addEntry(data: WeightEntry, userHeight?: number): Promise<boolean> {
    try {
      const weightsRef = ref(rtdb, `users/${data.userId}/weights`);
      const currentWeights = await this.getCurrentWeights(weightsRef);
      
      const newWeight = {
        ...data,
        bmi: userHeight ? this.calculateBMI(data.weight, userHeight) : undefined,
        createdAt: new Date().toISOString()
      };

      await this.saveNewEntry(weightsRef, currentWeights, newWeight);
      return true;
    } catch (error) {
      throw new ServiceError({
        message: 'Failed to add weight',
        code: 'ADD_WEIGHT_FAILED'
      });
    }
  }

  static async getHistory(userId: string, maxResults = 10): Promise<WeightEntry[]> {
    try {
      const weightsRef = ref(rtdb, `users/${userId}/weights`);
      const snapshot = await get(weightsRef);
      const weights = snapshot.val() || [];
      
      return weights
        .sort((a: WeightEntry, b: WeightEntry) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, maxResults);
    } catch (error) {
      throw new ServiceError({
        message: 'Failed to fetch history',
        code: 'FETCH_HISTORY_FAILED'
      });
    }
  }

  static async getStats(userId: string): Promise<WeightStats> {
    try {
      const weights = await this.getRecentWeights(userId);
      return this.calculateStats(weights);
    } catch (error) {
      throw new ServiceError({
        message: 'Failed to fetch stats',
        code: 'FETCH_STATS_FAILED'
      });
    }
  }

  static async getBMIHistory(userId: string): Promise<Array<{date: string, bmi: number}>> {
    const weights = await this.getHistory(userId);
    return weights
      .filter(w => w.bmi)
      .map(w => ({
        date: w.date,
        bmi: w.bmi!
      }));
  }

  private static async getCurrentWeights(ref: any): Promise<WeightEntry[]> {
    const snapshot = await get(ref);
    return snapshot.val() || [];
  }

  private static async saveNewEntry(
    ref: any, 
    currentWeights: WeightEntry[], 
    data: WeightEntry
  ): Promise<void> {
    const newWeight = {
      date: data.date,
      weight: data.weight,
      userId: data.userId,
      createdAt: new Date().toISOString()
    };
    await set(ref, [...currentWeights, newWeight]);
  }

  private static async getRecentWeights(userId: string): Promise<number[]> {
    const weights = await this.getHistory(userId, 30);
    return weights.map(w => w.weight);
  }

  private static calculateStats(weights: number[]): WeightStats {
    return {
      current: weights[0] || 0,
      average: weights.length ? 
        weights.reduce((a, b) => a + b, 0) / weights.length : 0,
      min: weights.length ? Math.min(...weights) : 0,
      max: weights.length ? Math.max(...weights) : 0
    };
  }

  private static calculateBMI(weight: number, height: number): number {
    if (!height) return 0;
    const heightInMeters = height / 100;
    return +(weight / (heightInMeters * heightInMeters)).toFixed(1);
  }
}