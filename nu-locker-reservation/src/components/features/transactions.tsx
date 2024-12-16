'use client'
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/services/firebase"; // Adjust path to your Firebase setup

interface LockerOwner {
  name: string;
  email: string;
  startDate: string;
  endDate: string;
}

export default function Transactions() {
  const [lockerOwners, setLockerOwners] = useState<LockerOwner[]>([]);

  useEffect(() => {
    const fetchLockerOwners = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "lockers")); // Adjust collection name

        // Explicit mapping to ensure fields match LockerOwner
        const data: LockerOwner[] = querySnapshot.docs.map((doc) => {
          const docData = doc.data();

          const owner = docData.owner;

          return {
            name: owner.name || "Unknown Name", // Default values in case of missing data
            email: owner.email || "Unknown Email",
            startDate: owner.startDate || "Unknown Start Date",
            endDate: owner.endDate || "Unknown End Date",
          };
        });

        setLockerOwners(data);
      } catch (error) {
        console.error("Error fetching locker owners: ", error);
      }
    };

    fetchLockerOwners();
  }, []);

  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Locker Owners</CardTitle>
        <CardDescription>List of all locker reservations.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lockerOwners.map((owner) => (
              <TableRow key={owner.email}>
                <TableCell>
                  <div className="font-medium">{owner.name}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">{owner.email}</div>
                </TableCell>
                <TableCell>{owner.startDate}</TableCell>
                <TableCell>{owner.endDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
