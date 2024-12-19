'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Reservation, createReservation, updateReservation, deleteReservation, getReservations } from '@/lib/actions'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"
import { MoreVertical, Plus } from "lucide-react"

export default function ReservationsCRUD() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null)
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    lockerNumber: '',
    lockerSize: 'small' as Reservation['lockerSize'],
    startDate: new Date(),
    endDate: new Date(),
    status: 'pending' as Reservation['status'],
    totalPrice: 0
  })

  const router = useRouter()

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const data = await getReservations()
      setReservations(data)
      setIsLoading(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch reservations",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingReservation) {
        await updateReservation(editingReservation.id!, formData)
        toast({
          title: "Success",
          description: "Reservation updated successfully",
        })
      } else {
        await createReservation(formData)
        toast({
          title: "Success",
          description: "Reservation created successfully",
        })
      }
      setIsOpen(false)
      setEditingReservation(null)
      fetchReservations()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save reservation",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation)
    setFormData({
      userId: reservation.userId,
      userName: reservation.userName,
      lockerNumber: reservation.lockerNumber,
      lockerSize: reservation.lockerSize,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      status: reservation.status,
      totalPrice: reservation.totalPrice
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteReservation(id)
      toast({
        title: "Success",
        description: "Reservation deleted successfully",
      })
      fetchReservations()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete reservation",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reservations</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Reservation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingReservation ? 'Edit' : 'Create'} Reservation</DialogTitle>
              <DialogDescription>
                Fill in the details for the reservation.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="userName" className="text-right">
                    User Name
                  </Label>
                  <Input
                    id="userName"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lockerNumber" className="text-right">
                    Locker Number
                  </Label>
                  <Input
                    id="lockerNumber"
                    value={formData.lockerNumber}
                    onChange={(e) => setFormData({ ...formData, lockerNumber: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lockerSize" className="text-right">
                    Size
                  </Label>
                  <Select
                    value={formData.lockerSize}
                    onValueChange={(value) => setFormData({ ...formData, lockerSize: value as Reservation['lockerSize'] })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Dates</Label>
                  <div className="col-span-3 flex gap-4">
                    <Calendar
                      selected={formData.startDate}
                      onSelect={(date) => date && setFormData({ ...formData, startDate: date })}
                      className="rounded-md border"
                    />
                    <Calendar
                      selected={formData.endDate}
                      onSelect={(date) => date && setFormData({ ...formData, endDate: date })}
                      className="rounded-md border"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as Reservation['status'] })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="totalPrice" className="text-right">
                    Total Price
                  </Label>
                  <Input
                    id="totalPrice"
                    type="number"
                    value={formData.totalPrice}
                    onChange={(e) => setFormData({ ...formData, totalPrice: Number(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingReservation ? 'Save Changes' : 'Create Reservation'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Name</TableHead>
            <TableHead>Locker</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell>{reservation.userName}</TableCell>
              <TableCell>{reservation.lockerNumber}</TableCell>
              <TableCell className="capitalize">{reservation.lockerSize}</TableCell>
              <TableCell>{format(reservation.startDate, 'PP')}</TableCell>
              <TableCell>{format(reservation.endDate, 'PP')}</TableCell>
              <TableCell className="capitalize">{reservation.status}</TableCell>
              <TableCell>${reservation.totalPrice}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEdit(reservation)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDelete(reservation.id!)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}