"use client"

import { useState, useEffect } from "react"
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
import { useQuery } from "@tanstack/react-query"

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
import { toast } from "sonner"
import { fetchRequests, updateRequestStatus, fetchPatients } from "@/utils/api"

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

  // Fetch requests and patients data
  const {
    data: requestsData,
    isLoading: isLoadingRequests,
    refetch,
  } = useQuery({
    queryKey: ["requests"],
    queryFn: () => fetchRequests(),
  })

  const { data: patientsData, isLoading: isLoadingPatients } = useQuery({
    queryKey: ["patients"],
    queryFn: () => fetchPatients(),
  })

  // Format the data for the table when API data changes
  const [data, setData] = useState<PatientRequest[]>([])

  useEffect(() => {
    if (!requestsData || !patientsData) return

    // Map the API data to the format expected by the table
    const formattedData = requestsData.map((request) => {
      // Find the patient associated with this request
      const patient = patientsData.find((p) => p.id === request.patient_id) || {
        name: "Unknown",
        surname: "Patient",
      }

      // Extract date and time from the request timestamp
      const requestDate = new Date(request.created_at || new Date())
      const dateString = requestDate.toLocaleDateString("cs-CZ")
      const timeString = requestDate.toLocaleTimeString("cs-CZ", {
        hour: "2-digit",
        minute: "2-digit",
      })

      return {
        id: (request.id ?? 0).toString(),
        patientName: `${patient.name} ${patient.surname}`,
        date: dateString,
        time: timeString,
        reason: request.description,
        status: (request.state?.toLowerCase() || "pending") as
          | "pending"
          | "approved"
          | "declined"
          | "completed",
      }
    })

    setData(formattedData)
  }, [requestsData, patientsData])

  // Handle request actions
  const handleApproveRequest = async (id: string) => {
    try {
      await updateRequestStatus(Number(id), "approved")
      toast.success("Žádost byla schválena")
      refetch()
    } catch (error) {
      toast.error("Nepodařilo se schválit žádost")
      console.error("Error approving request:", error)
    }
  }

  const handleRejectRequest = async (id: string) => {
    try {
      await updateRequestStatus(Number(id), "declined")
      toast.success("Žádost byla odmítnuta")
      refetch()
    } catch (error) {
      toast.error("Nepodařilo se odmítnout žádost")
      console.error("Error rejecting request:", error)
    }
  }

  const handleCompleteRequest = async (id: string) => {
    try {
      await updateRequestStatus(Number(id), "completed")
      toast.success("Žádost byla označena jako dokončená")
      refetch()
    } catch (error) {
      toast.error("Nepodařilo se označit žádost jako dokončenou")
      console.error("Error completing request:", error)
    }
  }

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
                <DropdownMenuItem onClick={() => handleApproveRequest(request.id)}>
                  Schválit žádost
                </DropdownMenuItem>
              )}
              {userRole === "doctor" && request.status === "pending" && (
                <DropdownMenuItem onClick={() => handleRejectRequest(request.id)}>
                  Zamítnout žádost
                </DropdownMenuItem>
              )}
              {userRole === "doctor" && request.status === "approved" && (
                <DropdownMenuItem onClick={() => handleCompleteRequest(request.id)}>
                  Označit jako dokončené
                </DropdownMenuItem>
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

  // Show loading state
  if (isLoadingRequests || isLoadingPatients) {
    return <div className='flex justify-center p-8'>Načítání žádostí pacientů...</div>
  }

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
          {userRole === "doctor" && (
            <Button
              variant='default'
              onClick={() => {
                const selectedRows = table.getFilteredSelectedRowModel().rows
                if (selectedRows.length === 0) {
                  toast.info("Není vybrána žádná žádost")
                  return
                }

                // Process all selected requests
                Promise.all(selectedRows.map((row) => handleApproveRequest(row.original.id))).then(
                  () => {
                    toast.success(`${selectedRows.length} žádostí bylo zpracováno`)
                  }
                )
              }}
            >
              Zpracovat vybrané
            </Button>
          )}
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
