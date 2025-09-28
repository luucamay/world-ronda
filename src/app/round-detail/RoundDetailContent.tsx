'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { useSession } from 'next-auth/react';

// Progress Bar Component
const ProgressBar = ({ value }: { value: number }) => (
  <div className="w-full bg-gray-700 rounded-full h-2">
    <div 
      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(value * 100, 100)}%` }}
    />
  </div>
);

export default function RoundDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const roundId = searchParams.get('id');
  const name = searchParams.get('name');
  const nextAmount = searchParams.get('nextAmount');
  const dueText = searchParams.get('dueText');
  const members = parseInt(searchParams.get('members') || '3');
  const totalMembers = parseInt(searchParams.get('totalMembers') || '50');
  
  const [isJoining, setIsJoining] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const progress = members / totalMembers;

  const handleJoinRound = async () => {
    console.log('🚨 [ROUND DETAIL] JOIN THIS ROUND BUTTON CLICKED!');
    console.log('🔵 [ROUND DETAIL] Joining round:', { roundId, name });
    
    if (!roundId) {
      console.log('❌ [ROUND DETAIL] Round ID validation failed');
      setErrorMessage('Round ID not available');
      setShowErrorModal(true);
      return;
    }

    if (!session?.user) {
      console.log('❌ [ROUND DETAIL] Session validation failed');
      setErrorMessage('User not authenticated. Please login again.');
      setShowErrorModal(true);
      return;
    }

    try {
      setIsJoining(true);
      console.log('🔄 [ROUND DETAIL] Setting isJoining=true, showing loading state');
      
      const requestBody = { roundId };
      console.log('🔵 [ROUND DETAIL] Making API call with:', requestBody);
      
      const response = await fetch('/api/rounds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('🔵 [ROUND DETAIL] Response status:', response.status, response.statusText);

      if (!response.ok) {
        console.log('❌ [ROUND DETAIL] API response not OK:', response.status);
        throw new Error(`Failed to join round: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ [ROUND DETAIL] API response successful:', result);
      
      // Save joined round to localStorage
      const currentJoined = JSON.parse(localStorage.getItem('joinedRounds') || '[]');
      if (!currentJoined.includes(roundId)) {
        currentJoined.push(roundId);
        localStorage.setItem('joinedRounds', JSON.stringify(currentJoined));
        console.log('✅ [ROUND DETAIL] Saved joined round to localStorage:', currentJoined);
      }
      
      console.log('✅ [ROUND DETAIL] Successfully joined round - showing success modal');
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('❌ [ROUND DETAIL] Error joining round:', error);
      setErrorMessage('Failed to join the round. Please try again.');
      setShowErrorModal(true);
    } finally {
      console.log('🔵 [ROUND DETAIL] Setting isJoining=false');
      setIsJoining(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-4">
          {name || 'Round Details'}
        </h1>
        
        <div className="space-y-6 text-white">
          {/* Round Stats */}
          <div className="bg-gray-700/50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-300">Participants</span>
              <span className="text-white font-bold">{members}/{totalMembers}</span>
            </div>
            <ProgressBar value={progress} />
          </div>

          {/* Payment Info */}
          <div className="bg-gray-700/50 rounded-xl p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Next Payment:</span>
                <span className="text-white font-bold">{nextAmount || '100 USDC'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Due:</span>
                <span className="text-yellow-400">{dueText || 'Due in 5 days'}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3">How it works</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Members contribute regularly to the pool</li>
              <li>• Each cycle, one member receives the full amount</li>
              <li>• Process continues until all members have received</li>
              <li>• Safe, transparent, and community-driven</li>
            </ul>
          </div>
          
          <div className="pt-4">
            <Button 
              variant="primary" 
              size="lg" 
              className="w-full shadow-2xl shadow-purple-500/50 ring-2 ring-purple-500/30 hover:shadow-purple-400/60 transform hover:scale-105 transition-all duration-300"
              disabled={isJoining}
              onClick={handleJoinRound}
            >
              {isJoining ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>JOINING...</span>
                </div>
              ) : (
                'Join This Round'
              )}
            </Button>
          </div>
        </div>
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
                  console.log('🔵 [ROUND DETAIL] Success modal OK clicked - navigating back to home');
                  setShowSuccessModal(false);
                  router.push('/home');
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
    </div>
  );
}