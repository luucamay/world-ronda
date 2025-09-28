'use client';

import { useState, useEffect } from 'react';
import PublicRoundCard from '@/components/PublicRoundCard';

export default function PublicRoundsSection() {
  const [joinedRounds, setJoinedRounds] = useState<string[]>([]);

  // Load joined rounds from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('joinedRounds');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setJoinedRounds(parsed);
        console.log('🔵 [ROUNDS SECTION] Loaded joined rounds from localStorage:', parsed);
      } catch (error) {
        console.error('❌ [ROUNDS SECTION] Failed to parse joined rounds:', error);
      }
    }
  }, []);

  // Listen for storage changes to update when user joins a round from detail page
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'joinedRounds' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setJoinedRounds(parsed);
          console.log('🔵 [ROUNDS SECTION] Updated joined rounds from storage event:', parsed);
        } catch (error) {
          console.error('❌ [ROUNDS SECTION] Failed to parse storage update:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="w-full max-w-md space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Available Rounds</h2>
      
      <PublicRoundCard
        name="Monthly Savings Circle"
        nextAmount="100 USDC"
        dueText="Due in 5 days"
        members={15}
        totalMembers={50}
        paymentFrequency="Every 30 days"
        roundId="round-001"
        isAnimated={true}
        isUserJoined={joinedRounds.includes('round-001')}
      />
      
      <PublicRoundCard
        name="Weekly Investment Pool"
        nextAmount="50 USDC"
        dueText="Due in 2 days"
        members={8}
        totalMembers={20}
        paymentFrequency="Every 7 days"
        roundId="round-002"
        isUserJoined={joinedRounds.includes('round-002')}
      />
      
      <PublicRoundCard
        name="Emergency Fund Group"
        nextAmount="200 USDC"
        dueText="Due in 10 days"
        members={25}
        totalMembers={25}
        paymentFrequency="Every 14 days"
        roundId="round-003"
        isUserJoined={joinedRounds.includes('round-003')}
      />
    </div>
  );
}