'use client';

import { FC, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
  Loader2, 
  Search,
  UserCircle,
  ShieldCheck,
  Users
} from 'lucide-react';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '@/services/firebase';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

type RoleFilter = 'all' | 'admin' | 'user';

const UsersDashboard: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    users: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, roleFilter, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('name'));
      const querySnapshot = await getDocs(q);
      
      const fetchedUsers: User[] = [];
      querySnapshot.forEach((doc) => {
        fetchedUsers.push({
          id: doc.id,
          ...doc.data() as Omit<User, 'id'>
        });
      });

      setUsers(fetchedUsers);
      
      // Calculate statistics
      const newStats = fetchedUsers.reduce((acc, user) => {
        acc.total++;
        acc[user.role === 'admin' ? 'admins' : 'users']++;
        return acc;
      }, {
        total: 0,
        admins: 0,
        users: 0,
      });
      
      setStats(newStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredUsers(filtered);
  };

  const getRoleIcon = (role: string) => {
    return role === 'admin' 
      ? <ShieldCheck className="text-blue-600" />
      : <UserCircle className="text-gray-600" />;
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: newRole,
      });
      
      // Update local state
      const updatedUsers = users.map(user => 
        user.id === userId 
          ? { ...user, role: newRole }
          : user
      );
      setUsers(updatedUsers);
    } catch (err) {
      setError('Failed to update user role');
    }
  };

  const TabButton: FC<{ 
    active: boolean; 
    onClick: () => void; 
    children: React.ReactNode 
  }> = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-colors ${
        active 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Administrators</h3>
              <p className="text-2xl font-bold">{stats.admins}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <UserCircle className="w-8 h-8 text-gray-600" />
            <div>
              <h3 className="text-lg font-semibold">Regular Users</h3>
              <p className="text-2xl font-bold">{stats.users}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Role Filter */}
        <div className="flex gap-2">
          <span className="font-semibold my-auto w-20">Role:</span>
          <div className="flex gap-2">
            {(['all', 'admin', 'user'] as const).map((role) => (
              <TabButton
                key={role}
                active={roleFilter === role}
                onClick={() => setRoleFilter(role)}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </TabButton>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">
          Users
          <span className="text-sm font-normal ml-2 text-gray-500">
            ({filteredUsers.length} users)
          </span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Role</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <select
                      className="border rounded p-1"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'user')}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default UsersDashboard;