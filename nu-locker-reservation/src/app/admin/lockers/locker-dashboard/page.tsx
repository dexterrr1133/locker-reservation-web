import React from "react";
import LockersCrud from "@/components/admin/locker-dashboard/page";

const DashboardLockersPage: React.FC = () => {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Admin: Locker Management</h1>
        <LockersCrud />
      </div>
    );
  };
  
  export default DashboardLockersPage;
