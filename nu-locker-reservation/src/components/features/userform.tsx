'use client';

import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';

interface UserFormProps {
  onUserAdded: () => void; // Callback to refresh the user list
}

const UserForm: React.FC<UserFormProps> = ({ onUserAdded }) => {
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const handleAddUser = async () => {
    try {
      const userRef = collection(db, 'users');
      await addDoc(userRef, newUser);
      setNewUser({ firstName: '', lastName: '', email: '' }); // Reset form
      onUserAdded(); // Trigger refresh
    } catch (err) {
      console.error('Failed to add user:', err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <input
            type="text"
            placeholder="First Name"
            className="w-full border rounded p-2"
            value={newUser.firstName}
            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-full border rounded p-2"
            value={newUser.lastName}
            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded p-2"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleAddUser}>Add User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
