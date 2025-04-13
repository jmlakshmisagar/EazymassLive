"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BoardContent from "./[userId]/BoardContent";
import { auth } from '@/lib/firebase';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/getin');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return auth.currentUser ? (
    <BoardContent userId={auth.currentUser.uid} />
  ) : null;
}
