import { auth } from '@/auth';
import { Page } from '@/components/PageLayout';
import { Pay } from '@/components/Pay';
import { Transaction } from '@/components/Transaction';
import { UserInfo } from '@/components/UserInfo';
import { Verify } from '@/components/Verify';
import { ViewPermissions } from '@/components/ViewPermissions';
import PublicRoundCard from '@/components/PublicRoundCard';
import { Marble, TopBar } from '@worldcoin/mini-apps-ui-kit-react';

export default async function Home() {
  const homePageStart = performance.now();
  console.log('🏠 Home Page: Starting page render...');
  
  const sessionStart = performance.now();
  const session = await auth();
  console.log(`🏠 Home Page: Session fetch completed in ${(performance.now() - sessionStart).toFixed(2)}ms`);
  console.log(`🏠 Home Page: Total page render time: ${(performance.now() - homePageStart).toFixed(2)}ms`);

  return (
    <>
      <Page.Header className="p-0">
        <TopBar
          title="Home"
          endAdornment={
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold capitalize">
                {session?.user.username}
              </p>
              <Marble src={session?.user.profilePictureUrl} className="w-12" />
            </div>
          }
        />
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-start gap-4 mb-16">
        <UserInfo />
        
        {/* Public Rounds Section */}
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
      </Page.Main>
    </>
  );
}
