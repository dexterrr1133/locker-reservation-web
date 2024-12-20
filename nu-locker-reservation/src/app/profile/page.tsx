'use client'
import Header from '@/components/features/header';
import ProtectedRoutes from '@/components/protectedRoutes';
import React from "react";

const Sidebar = () => {
  return (
    <>
    <div className="w-1/4 bg-white p-8">
      <div className="mb-10">
        <h1 className="text-2xl">Allen Josef</h1>
        <p className="text-gray-500">rojov@gmail.com</p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg mb-2">My Locker</h3>
        <h3 className="font-semibold">Account</h3>
      </div>
      <h3 className="cursor-pointer text-blue-600 hover:text-blue-800">Log Out</h3>
    </div>
    </>
  );
};

const ProfileCard = () => {
  const [name, setName] = React.useState("Allen Josef Rojo");
  const [email, setEmail] = React.useState("rojov@gmail.com");

  const handleSave = () => {
    console.log("Saved", { name, email });
  };

  return (
    <>
      <div className="bg-white h-auto p-8 rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-500 flex items-center justify-center">
          <span className="text-white text-2xl">AR</span>
        </div>
        <button className="ml-4 text-blue-600 hover:text-blue-800 focus:outline-none">
          Upload photo
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="name">
          Name
        </label>
        <input
          type="text"
          id="name"
          className="w-full h-10 px-4 rounded-lg border-gray-300"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="w-full h-10 px-4 rounded-lg border-gray-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <button
          className="py-2 px-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
    </>
  );
};

const AccountPage = () => {
  return (
    <>
      <Header />
      <div className="flex h-screen bg-gray-200">
        <Sidebar />
        <div className="w-3/4 p-8">
          <ProfileCard />
        </div>
      </div>
    </>
  );
};

export default AccountPage;
