import SmallLockers from '@/components/lockers/small_locker_list';
import ProtectedRoutes from '@/components/protectedRoutes';

const Small_Locker = () => {
  return (
    <ProtectedRoutes>
      <SmallLockers />
    </ProtectedRoutes>
  );
};

export default Small_Locker;