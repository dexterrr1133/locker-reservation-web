import MediumLockers from '@/components/lockers/medium_locker_list';
import ProtectedRoutes from '@/components/protectedRoutes';

const Medium_Locker = () => {
  return (
    <ProtectedRoutes>
      <MediumLockers />
    </ProtectedRoutes>
  );
};

export default Medium_Locker;