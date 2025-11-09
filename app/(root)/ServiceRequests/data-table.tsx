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
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { fetchServiceRequests } from "@/features/ServiceRequests/ServiceRequestsSlice";
import { useSpecialties } from "@/hooks/useSpecialties";

interface DataTableProps {
  data: any[];
  meta?: any;
}

export function DataTable({ data, meta }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const { specialties } = useSpecialties();

  console.log("specialties", specialties);

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

  const [filters, setFilters] = React.useState({
    specialty: "",
    status: "",
    title: "",
    page: 1,
  });

  const dispatch = useDispatch<AppDispatch>();

  const updateFilters = (updates: any) => {
    const newFilters = { ...filters, ...updates };
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      setFilters({ ...newFilters, page: 1 });
      dispatch(fetchServiceRequests({ ...newFilters, page: 1 }));
    }
  };

  const handleFilterChange = (
    filterKey: any,
    value: string | number | boolean | undefined
  ) => {
    const newFilters = { ...filters, [filterKey]: value };
    setFilters(newFilters);
    dispatch(fetchServiceRequests(newFilters));
  };

  return (
    <div>
      <div className="flex  mb-4 justify-between flex-col md:flex-row">
        <div className="flex bg-white items-center rounded-md border px-[5px] text-sm font-sans py-1 max-w-[600px] mb-2 md:mb-0">
          {[
            "All",
            "pending",
            "offers_received",
            "accepted",
            "completed",
            "cancelled",
          ].map((status) => {
            const isActive =
              status === "All" ? !filters.status : filters.status === status;

            const handleClick = () => {
              updateFilters({ status: status === "All" ? "" : status });
            };

            return (
              <button
                key={status}
                onClick={handleClick}
                className={`px-4 py-1 rounded-md transition  ${
                  isActive
                    ? "bg-secondary text-white "
                    : "bg-white text-gray-500 hover:bg-gray-100"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <Select
              onValueChange={(value) => {
                updateFilters({ specialty: value === "all" ? "" : value });
              }}
            >
              <SelectTrigger className="gap-4 text-black-200">
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>

              <SelectContent>
                {/* 🆕 "All" option */}
                <SelectItem value="all">All Specialties</SelectItem>

                {/* Render the list of specialties */}
                {specialties.map((s) => (
                  <SelectItem key={s._id} value={s._id}>
                    {s.name}
                  </SelectItem>
                ))}
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          className="bg-white"
          size="sm"
          onClick={() => handleFilterChange("page", filters.page - 1)}
          disabled={filters.page <= 1}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {meta?.page ?? 1} of {meta?.totalPages ?? 1}
        </span>
        <Button
          className="bg-white"
          variant="outline"
          size="sm"
          onClick={() => handleFilterChange("page", filters.page + 1)}
          disabled={meta?.page >= meta?.totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
