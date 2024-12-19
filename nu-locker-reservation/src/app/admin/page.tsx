"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";


const AdminDashboard = () => {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (pathname === "/admin") {
            router.push("/admin/overview");
        }
    }, [pathname, router]);

    return(
        <div>burat</div>
    );
}

export default AdminDashboard;