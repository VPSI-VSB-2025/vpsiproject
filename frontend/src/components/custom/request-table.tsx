"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface RequestsTableProps {
  userRole: "doctor" | "nurse"
}

type PatientRequest = {
  id: string
  patientName: string
  date: string
  time: string
  reason: string
  status: "pending" | "approved" | "declined" | "completed"
}

export function RequestsTable({ userRole }: RequestsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  // Mock data
  const data: PatientRequest[] = [
    {
      id: "ZAD-001",
      patientName: "Jan Novák",
      date: "25.03.2024",
      time: "09:00",
      reason: "Roční prohlídka",
      status: "pending",
    },
    {
      id: "ZAD-002",
      patientName: "Jana Svobodová",
      date: "25.03.2024",
      time: "10:30",
      reason: "Kontrola",
      status: "approved",
    },
    {
      id: "ZAD-003",
      patientName: "Robert Dvořák",
      date: "26.03.2024",
      time: "11:45",
      reason: "Výsledky krevních testů",
      status: "completed",
    },
    {
      id: "ZAD-004",
      patientName: "Eliška Nováková",
      date: "26.03.2024",
      time: "13:15",
      reason: "Očkování",
      status: "declined",
    },
    {
      id: "ZAD-005",
      patientName: "Michal Černý",
      date: "27.03.2024",
      time: "14:30",
      reason: "Konzultace",
      status: "pending",
    },
    {
      id: "ZAD-006",
      patientName: "Sára Veselá",
      date: "27.03.2024",
      time: "15:45",
      reason: "Obnovení receptu",
      status: "pending",
    },
    {
      id: "ZAD-007",
      patientName: "David Malý",
      date: "28.03.2024",
      time: "09:30",
      reason: "Výsledky rentgenu",
      status: "approved",
    },
    {
      id: "ZAD-008",
      patientName: "Lucie Tichá",
      date: "28.03.2024",
      time: "11:00",
      reason: "Test na alergie",
      status: "pending",
    },
  ]

  const columns: ColumnDef<PatientRequest>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Vybrat vše'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Vybrat řádek'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID žádosti",
      cell: ({ row }) => <div className='font-medium'>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "patientName",
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Jméno pacienta
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("patientName")}</div>,
    },
    {
      accessorKey: "date",
      header: "Datum",
      cell: ({ row }) => <div>{row.getValue("date")}</div>,
    },
    {
      accessorKey: "time",
      header: "Čas",
      cell: ({ row }) => <div>{row.getValue("time")}</div>,
    },
    {
      accessorKey: "reason",
      header: "Důvod",
      cell: ({ row }) => <div>{row.getValue("reason")}</div>,
    },
    {
      accessorKey: "status",
      header: "Stav",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const statusMap: Record<string, string> = {
          pending: "Čeká na schválení",
          approved: "Schváleno",
          declined: "Zamítnuto",
          completed: "Dokončeno",
        }
        return (
          <Badge
            variant='outline'
            className={cn(
              status === "pending" &&
                "bg-yellow-50 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-700",
              status === "approved" &&
                "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700",
              status === "declined" && "bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700",
              status === "completed" &&
                "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
            )}
          >
            {statusMap[status]}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const request = row.original
        const canModify =
          userRole === "doctor" || (userRole === "nurse" && request.status === "pending")

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Otevřít menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Akce</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(request.id)}>
                Kopírovat ID žádosti
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Zobrazit detaily pacienta</DropdownMenuItem>
              {canModify && request.status === "pending" && (
                <DropdownMenuItem>Schválit žádost</DropdownMenuItem>
              )}
              {userRole === "doctor" && request.status === "pending" && (
                <DropdownMenuItem>Zamítnout žádost</DropdownMenuItem>
              )}
              {userRole === "doctor" && request.status === "approved" && (
                <DropdownMenuItem>Označit jako dokončené</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <Input
          placeholder='Filtrovat podle jména pacienta...'
          value={(table.getColumn("patientName")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("patientName")?.setFilterValue(event.target.value)}
          className='max-w-sm'
        />
        <div className='flex items-center space-x-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='ml-auto'>
                Sloupce <ChevronDown className='ml-2 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {userRole === "doctor" && <Button variant='default'>Zpracovat vybrané</Button>}
        </div>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  Žádné výsledky.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} z{" "}
          {table.getFilteredRowModel().rows.length} řádků vybráno.
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Předchozí
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Další
          </Button>
        </div>
      </div>
    </div>
  )
}
