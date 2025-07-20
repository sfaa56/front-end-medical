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

import { FiSearch } from "react-icons/fi";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getColumns } from "./columns";

import type { ServiceRequest } from "./columns";

interface DataTableProps {
  data: any[];
}

export function DataTable({ data }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const columns = getColumns();

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
      <div className="flex  mb-4 justify-between flex-col md:flex-row">
        <div className="flex bg-white items-center rounded-md border px-[5px] text-sm font-sans py-1 max-w-[330px] mb-2 md:mb-0">
          {["All", "waiting", "inprogress", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => {
                const columnStatus = table.getColumn("status");

                if (columnStatus) {
                  columnStatus?.setFilterValue(
                    status === "All" ? undefined : status
                  ); // Clear role filter
                }
              }}
              className={`px-4 py-1 rounded-md transition ${
                table.getColumn("status")?.getFilterValue() ===
                (status === "All" ? undefined : status)
                  ? "bg-secondary text-white font-sans font-medium text-sm"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <div className="flex items-center gap-2 ">
            <Select
              onValueChange={(value) => {
                const column = table.getColumn("specialty");
                if (column) {
                  column.setFilterValue(value === "All" ? undefined : value);
                }
              }}
            >
              <SelectTrigger className="gap-4 text-black-200">
                <SelectValue placeholder="Speciality" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value={"All"}>All</SelectItem>
                <SelectItem value={"Doctor"}>Doctor </SelectItem>
                <SelectItem value={"Lawyer"}>Lawyer</SelectItem>
                <SelectItem value={"Engineer"}>Engineer</SelectItem>
                <SelectItem value={"Carpenter"}>Carpenter</SelectItem>
                <SelectItem value={"Electrician"}>Electrician</SelectItem>
                <SelectItem value={"Mechanic"}>Mechanic </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
              <FiSearch />
            </span>
            <Input
              placeholder="Search ..."
              value={
                (table.getColumn("title")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="pl-10 "
            />
          </div>
        </div>
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
          <TableBody className="font-sans font-medium">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
      <div className="flex items-center justify-end space-x-2 py-4 ">
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
