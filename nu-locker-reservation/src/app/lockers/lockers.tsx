"use client";

import React, { useState, useEffect } from 'react'
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc 
} from 'firebase/firestore'
import { db } from '@/services/firebase'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"


// Locker interface (match the one from initialization script)
interface Locker {
  id: string
  name: string
  status: 'available' | 'maintenance' | 'in-use'
  size: 'small' | 'medium' | 'large'
  lastReservedAt?: Date | null
  reservedBy?: string | null
}

// Fetch Lockers by Size Component
export function LockersBySize({ size }: { size: 'small' | 'medium' | 'large' }) {
  const [lockers, setLockers] = useState<Locker[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLockersBySize() {
      try {
        setLoading(true)
        const lockersRef = collection(db, 'locker')
        const q = query(lockersRef, where('size', '==', size))
        
        const querySnapshot = await getDocs(q)
        const fetchedLockers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Locker))

        setLockers(fetchedLockers)
      } catch (error) {
        console.error(`Error fetching ${size} locker:`, error)
      } finally {
        setLoading(false)
      }
    }

    fetchLockersBySize()
  }, [size])

  // Handle locker status update
  const handleLockerStatusUpdate = async (lockerId: string, newStatus: Locker['status']) => {
    try {
      const lockerRef = doc(db, 'lockers', lockerId)
      await updateDoc(lockerRef, { 
        status: newStatus,
        ...(newStatus === 'available' && { 
          reservedBy: null, 
          lastReservedAt: null 
        })
      })

      // Optimistically update local state
      setLockers(prev => 
        prev.map(locker => 
          locker.id === lockerId 
            ? { ...locker, status: newStatus } 
            : locker
        )
      )
    } catch (error) {
      console.error('Error updating locker status:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading {size} lockers...</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {lockers.map((locker) => (
        <Card key={locker.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{locker.name}</CardTitle>
            <Badge 
              variant={
                locker.status === 'available' ? 'default' 
                : locker.status === 'maintenance' ? 'destructive'
                : 'secondary'
              }
            >
              {locker.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              
              <div>
                
                <p>Size: {locker.size}</p>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              {locker.status === 'in-use' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleLockerStatusUpdate(locker.id, 'available')}
                >
                  
                </Button>
              )}
              {locker.status === 'available' && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleLockerStatusUpdate(locker.id, 'maintenance')}
                >
                  
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Individual Page Components
export function SmallLockersPage() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Small Lockers</h1>
        <Button variant="outline">Reserve Locker</Button>
      </div>
      <LockersBySize size="small" />
    </div>
  )
}

export function MediumLockersPage() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Medium Lockers</h1>
        <Button variant="outline">Reserve Locker</Button>
      </div>
      <LockersBySize size="medium" />
    </div>
  )
}

export function LargeLockersPage() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Large Lockers</h1>
        <Button variant="outline">Reserve Locker</Button>
      </div>
      <LockersBySize size="large" />
    </div>
  )
}