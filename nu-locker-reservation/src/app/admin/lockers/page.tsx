"use client"

import LockersCrud from "@/components/lockers/admin_lockers_crud";

const Lockers = () => {

    return(

        <div style={{ padding: "20px" }}>
            <h1>Locker Management</h1>
            <LockersCrud />
        </div>
    )

}

export default Lockers;