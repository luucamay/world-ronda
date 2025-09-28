'use client';

import { TabItem, Tabs } from '@worldcoin/mini-apps-ui-kit-react';
import { CircleSpark, Home, User } from 'iconoir-react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * This component uses the UI Kit to navigate between pages
 * Bottom navigation is the most common navigation pattern in Mini Apps
 * We require mobile first design patterns for mini apps
 * Read More: https://docs.world.org/mini-apps/design/app-guidelines#mobile-first
 */

export const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState('home');

  // Update active tab based on current pathname
  useEffect(() => {
    if (pathname.includes('/profile')) {
      setValue('profile');
    } else if (pathname.includes('/new-round')) {
      setValue('new-round');
    } else {
      setValue('home');
    }
  }, [pathname]);

  const handleTabChange = (newValue: string) => {
    setValue(newValue);
    
    // Navigate to the appropriate page
    switch (newValue) {
      case 'home':
        console.log('🔵 [NAV] Navigating to Home');
        router.push('/home');
        break;
      case 'new-round':
        console.log('🔵 [NAV] Navigating to New Round (TODO: implement page)');
        // TODO: Implement new round creation page
        break;
      case 'profile':
        console.log('🔵 [NAV] Navigating to Profile');
        router.push('/profile');
        break;
      default:
        router.push('/home');
    }
  };

  return (
    <Tabs value={value} onValueChange={handleTabChange}>
      <TabItem value="home" icon={<Home />} label="Home" />
      <TabItem value="new-round" icon={<CircleSpark />} label="New Round" />
      <TabItem value="profile" icon={<User />} label="Profile" />
    </Tabs>
  );
};
