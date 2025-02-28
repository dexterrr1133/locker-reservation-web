'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { Eye } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  reservedLocker?: string; // Optional reserved locker
}

interface ViewUserModalProps {
  user: User;
  onUserUpdated: () => void; // Callback for updates
  onUserDeleted: (userId: string) => void; // Callback for deletion
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ user, onUserUpdated, onUserDeleted }) => {
  const [updatedUser, setUpdatedUser] = useState(user);

  const handleUpdateUser = async () => {
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
      });
      onUserUpdated();
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const userRef = doc(db, 'users', user.id);
      await deleteDoc(userRef);
      onUserDeleted(user.id);
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button> <Eye />View User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <input
            type="text"
            placeholder="First Name"
            className="w-full border rounded p-2"
            value={updatedUser.firstName}
            onChange={(e) => setUpdatedUser({ ...updatedUser, firstName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-full border rounded p-2"
            value={updatedUser.lastName}
            onChange={(e) => setUpdatedUser({ ...updatedUser, lastName: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded p-2"
            value={updatedUser.email}
            onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
          />
          <p>Reserved Locker: {user.reservedLocker || 'None'}</p>
        </div>
        <DialogFooter className="flex justify-between">
          <Button onClick={handleDeleteUser} variant="destructive">
            Delete User
          </Button>
          <Button onClick={handleUpdateUser}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserModal;
