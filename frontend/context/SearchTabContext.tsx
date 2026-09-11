'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export type SearchTabType =
  | 'flights'
  | 'hotels'
  | 'train'
  | 'bus'
  | 'holidays'
  | 'umrah'
  | 'visa'
  | 'insurance'
  | 'medical';

interface SearchTabContextType {
  activeTab: SearchTabType;
  setActiveTab: (tab: SearchTabType) => void;
  selectTab: (tab: SearchTabType) => void;
}

const SearchTabContext = createContext<SearchTabContextType>({
  activeTab: 'flights',
  setActiveTab: () => {},
  selectTab: () => {},
});

export const SearchTabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<SearchTabType>('flights');
  const pathname = usePathname();
  const router = useRouter();

  // Sync from URL search params if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as SearchTabType;
      const validTabs: SearchTabType[] = [
        'flights',
        'hotels',
        'train',
        'bus',
        'holidays',
        'umrah',
        'visa',
        'insurance',
        'medical',
      ];
      if (tabParam && validTabs.includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, [pathname]);

  const selectTab = (tab: SearchTabType) => {
    setActiveTab(tab);
    if (pathname === '/') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.pushState({}, '', url.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push(`/?tab=${tab}`);
    }
  };

  return (
    <SearchTabContext.Provider value={{ activeTab, setActiveTab, selectTab }}>
      {children}
    </SearchTabContext.Provider>
  );
};

export const useSearchTab = () => useContext(SearchTabContext);
