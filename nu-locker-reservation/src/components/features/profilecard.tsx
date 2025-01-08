import { useState, useEffect } from "react";
import { getUserData, updateUserData } from "@/services/firebaseService";

const ProfileCard = ({ userId }: { userId: string }) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserData(userId);
      if (userData) {
        setName(userData.name);
        setEmail(userData.email);
      }
    };
    fetchUserData();
  }, [userId]);

  // Handle saving user data (Update in Firebase)
  const handleSave = async () => {
    try {
      await updateUserData(userId, name, email);
      console.log("User data saved successfully!");
    } catch (error) {
      console.error("Error saving user data: ", error);
    }
  };

  return (
    <div className="h-auto p-8 rounded-lg shadow-md border border-gray-500">
      <div className="flex items-center justify-center mb-6">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-500 flex items-center justify-center">
          <span className="text-white text-2xl">User</span>
        </div>
      </div>

      {/* Name input */}
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

      {/* Email input */}
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

      {/* Save button */}
      <div>
        <button
          className="py-2 px-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
