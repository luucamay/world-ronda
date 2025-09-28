'use client';
import React, { memo, useState } from 'react';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Icons (using simple Unicode symbols since we don't have Ionicons)
const GlobeIcon = () => <span className="text-sm">🌐</span>;
const PeopleIcon = () => <span className="text-sm">👥</span>;
const CheckIcon = () => <span className="text-sm text-green-500">✅</span>;
const ArrowIcon = () => <span className="text-sm">→</span>;

// Progress Bar Component
const ProgressBar = ({ value }: { value: number }) => (
  <div className="w-full bg-gray-700 rounded-full h-2">
    <div 
      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(value * 100, 100)}%` }}
    />
  </div>
);

type Props = {
  name: string;
  progress?: number;         // 0..1 (optional, calculated from members/totalMembers if not provided)
  nextAmount: string;        // "100 USDC"
  dueText: string;           // "Due in 5 days"
  members?: number;          // Current members
  totalMembers?: number;     // Total required members (default 50)
  paymentFrequency?: string; // "Every 7 days"
  isAnimated?: boolean;      // Whether to show button animation
  roundId?: string;          // ID of the round for joining
  isUserJoined?: boolean;    // Whether the user is already joined to this round
};

function PublicRoundCard({ 
  name, 
  progress, 
  nextAmount, 
  dueText, 
  members = 3, 
  totalMembers = 50, 
  paymentFrequency = "Every 7 days", 
  isAnimated = false, 
  roundId, 
  isUserJoined = false
}: Props) {
  const [isJoining, setIsJoining] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showAlreadyJoinedModal, setShowAlreadyJoinedModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasJoined, setHasJoined] = useState(isUserJoined);
  const router = useRouter();
  const { data: session } = useSession();

  // Calculate real progress based on current members vs total
  const realProgress = progress !== undefined ? progress : members / totalMembers;

  const handleJoinRound = async () => {
    if (!roundId) {
      setErrorMessage('Round ID not available');
      setShowErrorModal(true);
      return;
    }

    if (!session?.user) {
      setErrorMessage('User not authenticated. Please login again.');
      setShowErrorModal(true);
      return;
    }

    try {
      setIsJoining(true);
      console.log('🔄 Joining round:', roundId, 'for user:', session.user.id);
      
      // API call to join round
      const response = await fetch('/api/join-round', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roundId }),
      });

      if (!response.ok) {
        throw new Error('Failed to join round');
      }

      const result = await response.json();
      console.log('✅ API response:', result);
      
      console.log('✅ Successfully joined round');
      setHasJoined(true);
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('❌ Error joining round:', error);
      setErrorMessage('Failed to join the round. Please try again.');
      setShowErrorModal(true);
    } finally {
      setIsJoining(false);
    }
  };

  const handleCardPress = () => {
    if (isUserJoined) {
      setShowAlreadyJoinedModal(true);
      return;
    }

    // Navigate to round detail page (implement as needed)
    router.push(`/round-detail?id=${roundId}&name=${encodeURIComponent(name)}`);
  };

  return (
    <div 
      className={`
        bg-gray-800 border rounded-2xl p-4 cursor-pointer transition-all duration-200
        active:scale-[0.98] active:bg-gray-750
        ${isAnimated 
          ? 'border-purple-500/50 shadow-lg shadow-purple-500/20' 
          : 'border-gray-700'
        }
      `}
      onClick={handleCardPress}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-bold text-lg flex-1 truncate pr-2">
          {name}
        </h3>
        <div className="flex items-center gap-1 bg-purple-500/30 px-2 py-1 rounded-lg">
          <GlobeIcon />
          <span className="text-white text-xs font-semibold">Public</span>
        </div>
      </div>

      {/* Participants */}
      <div className="flex items-center mb-3">
        <div className="flex items-center gap-2 bg-pink-500/20 px-3 py-1.5 rounded-full">
          <PeopleIcon />
          <span className="text-white text-sm font-bold">
            {members}/{totalMembers}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <ProgressBar value={realProgress} />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <p className="text-white text-sm">
            <span className="font-bold">Next:</span> {nextAmount}
          </p>
          <p className="text-gray-400 text-sm">{dueText}</p>
        </div>
        
        {isUserJoined ? (
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500 px-3 py-2 rounded-lg">
            <CheckIcon />
            <span className="text-green-500 text-xs font-bold">JOINED</span>
          </div>
        ) : (
          <Button
            size={isAnimated ? "lg" : "sm"}
            variant="primary"
            disabled={isJoining}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation(); // Prevent card click
              handleJoinRound();
            }}
            className={`
              ${isAnimated ? 'shadow-2xl shadow-purple-500/50 ring-2 ring-purple-500/30 hover:shadow-purple-400/60 transform hover:scale-105 transition-all duration-300' : ''}
              ${isJoining ? 'opacity-60' : ''}
            `}
          >
            {isJoining ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>JOINING...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span>JOIN ROUND</span>
                <ArrowIcon />
              </div>
            )}
          </Button>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-600 rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-white font-bold text-lg mb-2">Success!</h3>
              <p className="text-gray-300 mb-6">You have successfully joined the round!</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setShowSuccessModal(false);
                }}
                className="w-full"
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-600 rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="text-4xl mb-4">❌</div>
              <h3 className="text-white font-bold text-lg mb-2">Error</h3>
              <p className="text-gray-300 mb-6">{errorMessage}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowErrorModal(false)}
                className="w-full"
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Already Joined Modal */}
      {showAlreadyJoinedModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-600 rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="text-4xl mb-4">ℹ️</div>
              <h3 className="text-white font-bold text-lg mb-2">Already Joined</h3>
              <p className="text-gray-300 mb-6">You are already a member of this round. Would you like to view your rounds?</p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAlreadyJoinedModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setShowAlreadyJoinedModal(false);
                    router.push('/home');
                  }}
                  className="flex-1"
                >
                  View Rounds
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(PublicRoundCard);