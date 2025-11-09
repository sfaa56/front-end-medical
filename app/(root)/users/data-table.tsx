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

import type { User } from "./columns";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchUsers } from "@/features/user/useSlice";
import { useDebounce } from "@/hooks/useDebounce";

interface DataTableProps {
  data: User[];
  specialties: any[];
}

export function DataTable({ data, specialties }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [filters, setFilters] = React.useState({
    role: "",
    isVerified: undefined,
    specialty: "",
    status: "",
    search: "",
    page: 1,
  });

  const { users, loading, meta } = useSelector(
    (state: RootState) => state.users
  );
  const dispatch = useDispatch<AppDispatch>();

  const updateFilters = (updates: any) => {
    const newFilters = { ...filters, ...updates, page: 1 };
    setFilters(newFilters);
    dispatch(fetchUsers(newFilters));
  };

  const handleFilterChange = (
    filterKey: any,
    value: string | number | boolean | undefined
  ) => {
    const newFilters = { ...filters, [filterKey]: value };
    setFilters(newFilters);
    dispatch(fetchUsers(newFilters));
  };

  // React.useEffect(() => {
  //   dispatch(fetchUsers(filters));
  // }, [dispatch, filters]);

  const roleFilter = columnFilters.find((filter) => filter.id === "role")
    ?.value as string;

  const VerifiedFilter = columnFilters.find(
    (filter) => filter.id === "isVerified"
  )?.value as boolean;

console.log("VerifiedFilter column",VerifiedFilter)

  const columns = getColumns(filters);

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

  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearch = useDebounce(searchTerm, 400); // waits 400ms before triggering

  // When debouncedSearch changes, call backend
React.useEffect(() => {
  handleFilterChange("search", debouncedSearch);
}, [debouncedSearch]);

  return (
    <div>
      <div className="flex  mb-4 justify-between flex-col md:flex-row ">
        <div className="flex bg-white items-center rounded-md border px-[5px] text-sm font-sans py-1 max-w-[300px] mb-2 md:mb-0">
          {["All", "Client", "Provider", "Request"].map((role) => {
            const isActive =
              role === "All"
                ? !filters.role && filters.isVerified === undefined
                : role === "Request"
                ? filters.role === "provider" && filters.isVerified === false
                : filters.role === role.toLowerCase() &&
                  filters.isVerified === undefined;

            const handleClick = () => {
              if (role === "All")
                updateFilters({ role: "", isVerified: undefined });
              else if (role === "Request")
                updateFilters({ role: "provider", isVerified: false });
              else
                updateFilters({
                  role: role.toLowerCase(),
                  isVerified: undefined,
                });
            };

            return (
              <button
                key={role}
                onClick={handleClick}
                className={`px-4 py-1 rounded-md transition ${
                  isActive
                    ? "bg-secondary text-white"
                    : "bg-white text-gray-500 hover:bg-gray-100"
                }`}
              >
                {role}
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          {table.getColumn("role") &&
            (table.getColumn("role")?.getFilterValue() === "Provider" ||
              table.getColumn("isVerified")?.getFilterValue() === false) && (
              <div className="flex items-center gap-2 ">
                <Select
                  onValueChange={(value) => {
                    const column = table.getColumn("SubSpecialty.naem");
                    if (column) {
                      column.setFilterValue(
                        value === "All" ? undefined : value
                      );
                    }
                  }}
                >
                  <SelectTrigger className="gap-4">
                    <SelectValue placeholder="Speciality" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="All" key={"All"}>
                      All
                    </SelectItem>
                    {specialties.map((specialty) =>
                      specialty.subSpecialties?.map((subSpecialty) => (
                        <SelectItem
                          key={subSpecialty.name}
                          value={subSpecialty.name}
                        >
                          {subSpecialty.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

          {table.getColumn("isVerified")?.getFilterValue() === undefined && (
            <div className="flex items-center gap-2 ">
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
                  <SelectItem value={"Active"}>Active</SelectItem>
                  <SelectItem value={"Inactive"}>InActive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

<div className="relative max-w-sm">
  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
    <FiSearch />
  </span>
  <Input
    placeholder="Search..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pl-10"
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
