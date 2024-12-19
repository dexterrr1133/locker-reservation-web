
import React from "react";
import SmallLockersCrud from "@/components/admin/lockers-crud"; 

const AdminLockersPage: React.FC = () => {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Admin: Locker Management</h1>
        <SmallLockersCrud />
      </div>
    );
  };
  
  export default AdminLockersPage;
