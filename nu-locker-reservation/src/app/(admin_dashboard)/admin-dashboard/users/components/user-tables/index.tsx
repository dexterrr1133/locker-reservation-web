'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { User } from 'firebase/auth';
import { columns } from '../user-tables/columns';
import { useUserTableFilters } from './use-user-table-filters';

export default function UserTable({
  data,
  totalData
}: {
  data: User[];
  totalData: number;
}) {
  const {
    setPage,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setSearchQuery
  } = useUserTableFilters();

  return (
    <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
       
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      {/* Table displaying user data */}
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}