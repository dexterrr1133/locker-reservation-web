import TallLockers from '@/components/lockers/tall_locker_list';
import ProtectedRoutes from '@/components/protectedRoutes';

const Large_Locker = () => {
  return (
    <ProtectedRoutes>
      <TallLockers />
    </ProtectedRoutes>
  );
};

export default Large_Locker;