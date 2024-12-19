'use client';

import { useState, useEffect } from 'react';

import PageContainer from '@/components/features/page-container';
import { buttonVariants } from '@/components/ui/button';
import Nav from '@/components/features/admin_navbar';
import { Separator } from '@/components/ui/separator';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import UserTable from './user-tables';
import { User } from 'firebase/auth';

import { db } from '@/services/firebase'; // Import your firebase service
import { collection, getDocs, query, where, limit, startAfter } from 'firebase/firestore'; 

type TUserListingPage = {};

export default async function UserListingPage({}: TUserListingPage) {

    const [userData, setUserData] = useState<User[]>([]);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);


    const page = searchParamsCache.get('page');
    const search = searchParamsCache.get('q');
    const gender = searchParamsCache.get('gender');
    const pageLimit = searchParamsCache.get('limit');

    const filters = {
        page,
        limit: pageLimit,
        ...(search && { search }),
        ...(gender && { gender })
      };

      useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          try {
            const usersRef = collection(db, 'users');
            let q = query(usersRef, limit(pageLimit || 10));
    
            if (search) {
              q = query(q, where('name', '>=', search), where('name', '<=', search + '\uf8ff')); // Assuming `name` is indexed
            }
            if (gender) {
              q = query(q, where('gender', '==', gender));
            }
    
            // For pagination, you can add a startAfter for the next page
            if (page && page > 1) {
              // Example: Use last document of previous query to paginate
              // Add startAfter logic here based on the last document from the previous page
            }
    
            const querySnapshot = await getDocs(q);
            const users = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
    
            // Fetch total users count (assuming a collection or a count method is available)
            setTotalUsers(querySnapshot.size); // This will give the current page's user count
            setUserData(userData);
          } catch (error) {
            console.error("Error fetching users: ", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, [filters]);
    
      if (loading) {
        return <div>Loading...</div>;
      }


  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
        

          <Link
            href={'/dashboard/employee/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <UserTable data={userData} totalData={totalUsers} />
      </div>
    </PageContainer>
  )


}