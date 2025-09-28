'use client';

import PublicRoundCard from '@/components/PublicRoundCard';

export default function PublicRoundsSection() {
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
      />
      
      <PublicRoundCard
        name="Weekly Investment Pool"
        nextAmount="50 USDC"
        dueText="Due in 2 days"
        members={8}
        totalMembers={20}
        paymentFrequency="Every 7 days"
        roundId="round-002"
      />
      
      <PublicRoundCard
        name="Emergency Fund Group"
        nextAmount="200 USDC"
        dueText="Due in 10 days"
        members={25}
        totalMembers={25}
        paymentFrequency="Every 14 days"
        roundId="round-003"
        isUserJoined={true}
      />
    </div>
  );
}