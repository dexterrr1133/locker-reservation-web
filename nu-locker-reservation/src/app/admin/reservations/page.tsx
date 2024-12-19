import React from "react";
import ReservationsCRUD from "@/components/admin/reservations-crud";

const Reservations: React.FC = () => {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Admin: Reservations Management</h1>
        <ReservationsCRUD />
      </div>
    );
  };
  
  export default Reservations;