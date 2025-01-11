'use client';

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Search } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/services/firebase';
import UserForm from './userform';
import UserTable from './usertable';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  lockerAssigned?: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('lastName'));
      const querySnapshot = await getDocs(q);

      const fetchedUsers: User[] = [];
      querySnapshot.forEach((doc) => {
        fetchedUsers.push({
          id: doc.id,
          ...doc.data() as Omit<User, 'id'>,
        });
      });

      setUsers(fetchedUsers);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = users.filter(user => 
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
    setFilteredUsers(filtered);
  };

  const handleUserAdded = () => {
    fetchUsers();
  };

  const handleUserDeleted = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  if (loading) return <div className="flex-1 w-full flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <Card className="p-4 flex justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
        </div>
        <UserForm onUserAdded={handleUserAdded} />
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by first name, last name, or email..."
          className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
        <UserTable
          users={filteredUsers}
          onUserUpdated={fetchUsers}
          onUserDeleted={handleUserDeleted}
        />
        </TabsContent>
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div>Notifications</div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <div>Reports</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
