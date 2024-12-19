'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from 'firebase/auth';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'first_name',
    header: 'FIRST NAME'
  },
  {
    accessorKey: 'last_name',
    header: 'LAST NAME'
  },
  {
    accessorKey: 'email',
    header: 'EMAIL'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];