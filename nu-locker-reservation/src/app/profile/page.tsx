import ProtectedRoutes from '@/components/protectedRoutes';

const Profile = () => {
  return (
    <ProtectedRoutes>
      <h1>Profile Page</h1>
    </ProtectedRoutes>
  );
};

export default Profile;