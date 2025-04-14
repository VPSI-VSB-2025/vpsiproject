"use client"

import { useQuery } from "@tanstack/react-query"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DashboardShell } from "@/components/custom/dashboard-shell" // Import DashboardShell
import { fetchTests } from "@/lib/api"
import { TestDialog } from "@/components/custom/test-dialog" // Import the dialog
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton" // For loading state

export default function TestsPage() {
  const {
    data: tests,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tests"],
    queryFn: fetchTests,
  })

  return (
    <DashboardShell>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>Test Results</h1>
        {/* Wrap the Button in the Dialog component */}
        <TestDialog>
          <Button>
            <PlusCircle className='mr-2 h-4 w-4' /> Create New Test Result
          </Button>
        </TestDialog>
      </div>

      {isLoading && (
        <div className='space-y-2'>
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
        </div>
      )}

      {isError && (
        <Alert variant='destructive'>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {tests && !isLoading && !isError && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>ID Žádanky</TableHead>
              <TableHead>ID Typu Testu</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead>Stav</TableHead>
              <TableHead>Výsledek</TableHead>
              {/* Add other relevant columns */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className='text-center'>
                  No test results found.
                </TableCell>
              </TableRow>
            ) : (
              tests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell>{test.id}</TableCell>
                  <TableCell>{test.request_id}</TableCell>
                  {/* Assuming request_id is in Test interface */}
                  <TableCell>{test.test_type_id}</TableCell>
                  {/* Assuming test_type_id is in Test interface */}
                  <TableCell>{new Date(test.test_date).toLocaleDateString()}</TableCell>
                  <TableCell>{test.state}</TableCell>
                  <TableCell className='max-w-xs truncate'>{test.results}</TableCell>
                  {/* Add other relevant cells */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </DashboardShell>
  )
}
