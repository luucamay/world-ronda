'use client';
import { useSearchParams } from 'next/navigation';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';

export default function RoundDetailContent() {
  const searchParams = useSearchParams();
  const roundId = searchParams.get('id');
  const name = searchParams.get('name');

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-4">
          {name || 'Round Details'}
        </h1>
        
        <div className="space-y-4 text-white">
          <div>
            <h3 className="font-semibold text-lg mb-2">Round Information</h3>
            <p className="text-gray-300">Round ID: {roundId}</p>
            <p className="text-gray-300">This is a detailed view of the selected round.</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">How it works</h3>
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
              className="w-full"
              onClick={() => {
                alert('Join functionality would be implemented here');
              }}
            >
              Join This Round
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}