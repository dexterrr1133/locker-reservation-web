'use client';

import React from 'react';
import ViewUserModal from './userview';


interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface UserTableProps {
  users: User[];
  onUserUpdated: () => void; // Callback to refresh user list
  onUserDeleted: (userId: string) => void; // Callback for deletion
}

const UserTable: React.FC<UserTableProps> = ({ users, onUserUpdated, onUserDeleted }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Last Name</th>
            <th className="text-left p-2">First Name</th>
            <th className="text-left p-2">Email</th>
            <th className="text-right p-2"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-900">
              <td className="p-2">{user.lastName}</td>
              <td className="p-2">{user.firstName}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2 text-right">
                
                <ViewUserModal
                  user={user}
                  onUserUpdated={onUserUpdated}
                  onUserDeleted={onUserDeleted}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
