import Header from '@/components/features/header';
import MediumLockers from '@/components/lockers/medium_locker_list';
import { MediumLockersPage } from '@/app/lockers/lockers';
import ProtectedRoutes from '@/components/protectedRoutes';

const Medium_Locker = () => {
  return (
    <ProtectedRoutes>
      <Header />
      <MediumLockers />
    </ProtectedRoutes>
  );
};

export default Medium_Locker;