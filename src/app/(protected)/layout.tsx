import { auth } from '@/auth';
import { Navigation } from '@/components/Navigation';
import { Page } from '@/components/PageLayout';

export default async function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const layoutStart = performance.now();
  console.log('🏠 Protected Layout: Starting layout render...');
  
  const sessionStart = performance.now();
  const session = await auth();
  console.log(`🏠 Protected Layout: Session check completed in ${(performance.now() - sessionStart).toFixed(2)}ms`);

  // If the user is not authenticated, redirect to the login page
  if (!session) {
    console.log('Not authenticated');
    // redirect('/');
  }
  
  console.log(`🏠 Protected Layout: Total layout time: ${(performance.now() - layoutStart).toFixed(2)}ms`);

  return (
    <Page>
      {children}
      <Page.Footer className="px-0 fixed bottom-0 w-full bg-white">
        <Navigation />
      </Page.Footer>
    </Page>
  );
}
