"use client";
import * as React from "react";
import {
  SortingState,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { DateRange } from "react-day-picker";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { usePathname, useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  user?: string;
}

const PropertyType = [
  "All",
  "Apartment",
  "Villa",
  "Land",
  "Compound",
  "Farm",
  "Rest House",
  "Duplex",
  "Whole Building",
  "Full Floor",
];

export function DataTable<TData, TValue>({
  columns,
  data,
  user,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    undefined
  );
  const [priceRange, setPriceRange] = React.useState<{
    min?: number;
    max?: number;
  }>({});

  const pathname = usePathname();
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex justify-start  gap-4 mb-3">
        <div className="relative ">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
            <FiSearch />
          </span>
          <Input
            placeholder="Search sender or Complaint id"
            value={
              (table.getColumn("customer")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("Sender")?.setFilterValue(event.target.value)
            }
            className="pl-10 w-[245px]"
          />
        </div>

        <>
          <div className="flex items-center">
            <Select
              onValueChange={(value) => {
                const column = table.getColumn("status");
                if (column) {
                  column.setFilterValue(value === "All" ? undefined : value);
                }
              }}
            >
              <SelectTrigger className="gap-4">
                <SelectValue placeholder="Complaint Type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value={"All"}>All</SelectItem>
                <SelectItem value={"Complaint"}>Complaint</SelectItem>
                <SelectItem value={"Inquiry"}>Inquiry</SelectItem>
                <SelectItem value={"Suggestion"}>Suggestion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center">
            <Select
              onValueChange={(value) => {
                const column = table.getColumn("status");
                if (column) {
                  column.setFilterValue(value === "All" ? undefined : value);
                }
              }}
            >
              <SelectTrigger className="gap-4">
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value={"All"}>All</SelectItem>
                <SelectItem value={"Pending"}>Pending</SelectItem>
                <SelectItem value={"Resolved"}>Resolved</SelectItem>
                <SelectItem value={"Rejected"}>Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      </div>

      <div className="rounded-md border bg-white">
        <Table className="rounded-md">
          <TableHeader className="text-gray-500">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`${
                    pathname.includes("pending") && "cursor-pointer"
                  } `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          className="bg-white"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          className="bg-white"
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
