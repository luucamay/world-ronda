'use client';

import { useState, useEffect } from 'react';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { Session } from 'next-auth';

interface ProfileContentProps {
  session: Session | null;
}

// Credit Score Component
const CreditScoreCard = ({ score }: { score: number }) => {
  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-400';
    if (score >= 700) return 'text-blue-400';
    if (score >= 600) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 800) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 600) return 'Fair';
    return 'Needs Improvement';
  };

  const getScoreRing = (score: number) => {
    const percentage = (score / 850) * 100;
    return {
      strokeDasharray: '251.2', // 2 * π * 40
      strokeDashoffset: 251.2 - (251.2 * percentage) / 100,
    };
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full">
      <h3 className="text-white text-xl font-bold mb-6 text-center">Global Credit Score</h3>
      
      {/* Credit Score Circle */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 84 84">
            {/* Background circle */}
            <circle
              cx="42"
              cy="42"
              r="40"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-700"
            />
            {/* Progress circle */}
            <circle
              cx="42"
              cy="42"
              r="40"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className={getScoreColor(score)}
              style={getScoreRing(score)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                {score}
              </div>
              <div className="text-xs text-gray-400">/ 850</div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className={`text-lg font-semibold ${getScoreColor(score)} mb-2`}>
          {getScoreLabel(score)}
        </p>
        <p className="text-gray-400 text-sm">
          Based on your participation in savings rounds
        </p>
      </div>
    </div>
  );
};

// Round History Component
const RoundHistoryCard = () => {
  const mockHistory = [
    { name: 'Monthly Savings Circle', status: 'Completed', contribution: '100 USDC', date: '2024-12-15' },
    { name: 'Weekly Investment Pool', status: 'Active', contribution: '50 USDC', date: '2024-12-20' },
    { name: 'Emergency Fund Group', status: 'Completed', contribution: '200 USDC', date: '2024-11-30' },
  ];

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full">
      <h3 className="text-white text-xl font-bold mb-4">Round History</h3>
      
      <div className="space-y-3">
        {mockHistory.map((round, index) => (
          <div key={index} className="bg-gray-700/50 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-white font-semibold text-sm">{round.name}</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${
                round.status === 'Completed' 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>
                {round.status}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Contribution: {round.contribution}</span>
              <span className="text-gray-400">{round.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Stats Component
const StatsCard = () => {
  const stats = [
    { label: 'Rounds Completed', value: '12', icon: '✅' },
    { label: 'Total Contributed', value: '$2,400', icon: '💰' },
    { label: 'Perfect Payments', value: '100%', icon: '🎯' },
    { label: 'Member Since', value: 'Jan 2024', icon: '📅' },
  ];

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full">
      <h3 className="text-white text-xl font-bold mb-4">Your Stats</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-700/50 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-white font-bold text-lg">{stat.value}</div>
            <div className="text-gray-400 text-xs">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ProfileContent({ session }: ProfileContentProps) {
  const [creditScore, setCreditScore] = useState(750);
  const [joinedRounds, setJoinedRounds] = useState<string[]>([]);

  // Load joined rounds and calculate credit score
  useEffect(() => {
    const saved = localStorage.getItem('joinedRounds');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setJoinedRounds(parsed);
        
        // Calculate credit score based on participation
        // Base score of 650, +50 per joined round, max 850
        const calculatedScore = Math.min(650 + (parsed.length * 50), 850);
        setCreditScore(calculatedScore);
        
        console.log('🔵 [PROFILE] Loaded joined rounds:', parsed);
        console.log('🔵 [PROFILE] Calculated credit score:', calculatedScore);
      } catch (error) {
        console.error('❌ [PROFILE] Failed to parse joined rounds:', error);
      }
    }
  }, []);

  if (!session?.user) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center">
          <p className="text-gray-400">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* User Info Header */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gray-700">
          {session.user.profilePictureUrl ? (
            <img 
              src={session.user.profilePictureUrl} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              👤
            </div>
          )}
        </div>
        <h2 className="text-white text-xl font-bold mb-1">
          {session.user.username || 'User'}
        </h2>
        <p className="text-gray-400 text-sm">
          World ID Verified Member
        </p>
      </div>

      {/* Credit Score */}
      <CreditScoreCard score={creditScore} />

      {/* Stats */}
      <StatsCard />

      {/* Round History */}
      <RoundHistoryCard />

      {/* Actions */}
      <div className="space-y-3">
        <Button 
          variant="secondary" 
          size="lg" 
          className="w-full"
          onClick={() => {
            // TODO: Implement settings/preferences
            console.log('Settings clicked');
          }}
        >
          Account Settings
        </Button>
        
        <Button 
          variant="tertiary" 
          size="lg" 
          className="w-full"
          onClick={() => {
            // TODO: Implement help/support
            console.log('Help clicked');
          }}
        >
          Help & Support
        </Button>
      </div>
    </div>
  );
}