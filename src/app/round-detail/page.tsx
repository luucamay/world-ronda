'use client';

import { Page } from '@/components/PageLayout';
import { TopBar } from '@worldcoin/mini-apps-ui-kit-react';
import { Suspense } from 'react';
import RoundDetailContent from './RoundDetailContent';

export default function RoundDetailPage() {
  return (
    <>
      <Page.Header className="p-0">
        <TopBar
          title="Round Details"
          startAdornment={
            <button 
              onClick={() => window.history.back()} 
              className="text-white hover:text-gray-300"
            >
              ← Back
            </button>
          }
        />
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-start gap-4 mb-16">
        <Suspense fallback={<div>Loading...</div>}>
          <RoundDetailContent />
        </Suspense>
      </Page.Main>
    </>
  );
}