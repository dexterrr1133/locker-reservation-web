import Header from '@/components/features/header';
import SmallLockers from '@/components/lockers/small_locker_list';
import ProtectedRoutes from '@/components/protectedRoutes';

const Small_Locker = () => {
  return (
    <ProtectedRoutes>
      <Header />
      <SmallLockers />
    </ProtectedRoutes>
  );
};

export default Small_Locker;