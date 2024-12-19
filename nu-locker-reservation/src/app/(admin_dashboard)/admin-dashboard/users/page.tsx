import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import React from 'react';
import UserListingPage from './components/user-listing-page';

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : User'
};

export default async function Page({ searchParams }: pageProps) {
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  return <UserListingPage />;
}