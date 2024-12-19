import React from "react";
import TallLockersCrud from "@/components/admin/large-lockers-crud";

const TallLockersPage: React.FC = () => {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Admin: Locker Management</h1>
        <TallLockersCrud />
      </div>
    );
  };
  
  export default TallLockersPage;
