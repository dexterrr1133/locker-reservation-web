import React from "react";
import MediumLockersCrud from "@/components/admin/medium-lockers-crud";

const MediumLockersPage: React.FC = () => {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Admin: Locker Management</h1>
        <MediumLockersCrud />
      </div>
    );
  };
  
  export default MediumLockersPage;
