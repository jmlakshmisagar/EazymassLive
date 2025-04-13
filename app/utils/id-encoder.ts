export function encodeUserId(userId: string): string {
  const segments = [
    userId.slice(0, 8),
    userId.slice(8, 12),
    userId.slice(12, 16),
    userId.slice(16, 20),
    userId.slice(20)
  ];
  return segments.join('-');
}

export function decodeUserId(encodedId: string): string {
  return encodedId.replace(/-/g, '');
}