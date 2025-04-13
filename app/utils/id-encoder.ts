/**
 * Utility functions for encoding and decoding user IDs
 * Handles Firebase Auth UIDs for URL-safe format
 */

// Constants for validation
const FIREBASE_UID_LENGTH = 28;
const ENCODED_SEGMENT_LENGTHS = [8, 4, 4, 4, 8];

export function encodeUserId(userId: string): string {
    // Input validation
    if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid user ID provided');
    }

    // Convert to lowercase for consistency
    const normalizedId = userId.toLowerCase();

    // Validate Firebase UID format
    if (normalizedId.length !== FIREBASE_UID_LENGTH) {
        throw new Error('Invalid user ID length');
    }

    // Create URL-safe segments
    const segments = [
        normalizedId.slice(0, 8),
        normalizedId.slice(8, 12),
        normalizedId.slice(12, 16),
        normalizedId.slice(16, 20),
        normalizedId.slice(20)
    ];

    // Validate segments
    if (segments.some((segment, i) => segment.length !== ENCODED_SEGMENT_LENGTHS[i])) {
        throw new Error('Invalid segment length');
    }

    return segments.join('-');
}

export function decodeUserId(encodedId: string): string {
    // Input validation
    if (!encodedId || typeof encodedId !== 'string') {
        throw new Error('Invalid encoded ID provided');
    }

    // Validate format
    const segments = encodedId.split('-');
    if (segments.length !== ENCODED_SEGMENT_LENGTHS.length) {
        throw new Error('Invalid encoded ID format');
    }

    // Validate segment lengths
    if (segments.some((segment, i) => segment.length !== ENCODED_SEGMENT_LENGTHS[i])) {
        throw new Error('Invalid segment length in encoded ID');
    }

    // Get original ID from localStorage for comparison
    const originalId = localStorage.getItem('originalUid');
    if (!originalId) {
        throw new Error('Original user ID not found');
    }

    // Decode and compare
    const decodedId = segments.join('').toLowerCase();
    const encodedOriginal = encodeUserId(originalId);
    const normalizedOriginal = encodedOriginal.replace(/-/g, '').toLowerCase();

    // Verify match
    if (decodedId !== normalizedOriginal) {
        throw new Error('ID verification failed');
    }

    return originalId;
}

// Helper function to verify if an ID is valid
export function isValidUserId(id: string): boolean {
    try {
        return id.length === FIREBASE_UID_LENGTH && /^[a-zA-Z0-9]+$/.test(id);
    } catch {
        return false;
    }
}