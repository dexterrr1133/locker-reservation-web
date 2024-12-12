'use client'

import Header from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function HomeDashboard() {
  const router = useRouter();

  return (
    <>
    <Header/>
      <div className="min-h-screen p-12">
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-5xl font-bold">Secure your storage needs with Locker</h1>
            </div>
            <p className="text-gray-700 text-xl mt-2">Secure your storage needs with Locker</p>
            <div className="flex space-x-10 mt-10">
                <Card className="max-w-sm rounded-lg shadow-md p-6 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300" onClick={() => router.push("/small_lockers")}>
                    <CardHeader className="text-m font-bold p-0">
                      <CardTitle>
                        Small Locker
                      </CardTitle>
                      <CardDescription>
                      <p>16" x 11"</p>
                      <p className="font-bold">$500 per AY</p>
                      </CardDescription>
                    </CardHeader>
                    <img className="mt-4" src="https://placehold.co/320x180" alt="Placeholder image of a small locker with several compartments." />
                </Card>
                <Card className="max-w-sm rounded-lg shadow-md p-6 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300" onClick={() => router.push("/medium_lockers")}>
                    <CardHeader className="text-m font-bold p-0">
                      <CardTitle>
                        Medium Locker
                      </CardTitle>
                      <CardDescription>
                      <p>21.5" x 11" </p>
                      <p className="font-bold">$800 per AY</p>
                      </CardDescription>
                    </CardHeader>
                    <img className="mt-4" src="https://placehold.co/320x180" alt="Placeholder image of a small locker with several compartments." />
                </Card>
                <Card className="max-w-sm rounded-lg shadow-md p-6 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300" onClick={() => router.push("/tall_lockers")}>
                    <CardHeader className="text-m font-bold p-0">
                      <CardTitle>
                        Tall Locker
                      </CardTitle>
                      <CardDescription>
                      <p>32" x 11"</p>
                      <p className="font-bold">$1200 per AY</p>
                      </CardDescription>
                    </CardHeader>
                    <img className="mt-4" src="https://placehold.co/320x180" alt="Placeholder image of a small locker with several compartments." />
                </Card>
            </div>
        </div>
    </div>
    </>
  );
}