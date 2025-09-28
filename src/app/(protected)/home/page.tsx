import { auth } from '@/auth';
import { Page } from '@/components/PageLayout';
import { Pay } from '@/components/Pay';
import { Transaction } from '@/components/Transaction';
import { UserInfo } from '@/components/UserInfo';
import { Verify } from '@/components/Verify';
import { ViewPermissions } from '@/components/ViewPermissions';
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
        <Verify />
        <Pay />
        <Transaction />
        <ViewPermissions />
      </Page.Main>
    </>
  );
}
