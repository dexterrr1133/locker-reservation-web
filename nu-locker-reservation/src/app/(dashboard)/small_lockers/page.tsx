import ProtectedRoutes from '@/components/protectedRoutes';

const Small_Locker = () => {
  return (
    <ProtectedRoutes>
      <h1>Small Locker Page</h1>
    </ProtectedRoutes>
  );
};

export default Small_Locker;