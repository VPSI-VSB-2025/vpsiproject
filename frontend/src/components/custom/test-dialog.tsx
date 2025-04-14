"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CalendarIcon, Loader2, PlusCircle } from "lucide-react"
import { format } from "date-fns"

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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea" // Use Textarea for results
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { createTest, fetchRequestsForSelection, fetchTestTypes, TestCreateData } from "@/lib/api"
import { toast } from "sonner" // Assuming you use sonner for toasts
import { CreateTestTypeDialog } from "./create-test-type-dialog" // Import the new dialog

// Zod schema for form validation
const testFormSchema = z.object({
  test_date: z.date({ required_error: "Test date is required." }),
  results: z.string().min(1, "Results are required.").max(512, "Results too long"),
  state: z.string().min(1, "State is required."), // Consider a specific enum/union type if applicable
  test_type_id: z.string().min(1, "Test type is required."), // Use string initially for Select
  request_id: z.string().min(1, "Request is required."), // Use string initially for Select
})

type TestFormData = z.infer<typeof testFormSchema>

interface TestDialogProps {
  children: React.ReactNode // To wrap the trigger button
}

export function TestDialog({ children }: TestDialogProps) {
  const [open, setOpen] = useState(false)
  const [createTestTypeDialogOpen, setCreateTestTypeDialogOpen] = useState(false) // State for the new dialog
  const queryClient = useQueryClient()

  const form = useForm<TestFormData>({
    resolver: zodResolver(testFormSchema),
    defaultValues: {
      results: "",
      state: "Negativní", // Default state?
    },
  })

  // Fetch data for Select inputs
  const { data: testTypes, isLoading: isLoadingTestTypes } = useQuery({
    queryKey: ["testTypes"],
    queryFn: fetchTestTypes,
  })

  const { data: requests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ["requestsForSelection"],
    queryFn: fetchRequestsForSelection,
  })

  const mutation = useMutation({
    mutationFn: createTest,
    onSuccess: () => {
      toast.success("Test result created successfully!")
      queryClient.invalidateQueries({ queryKey: ["tests"] }) // Refetch tests list
      setOpen(false) // Close dialog
      form.reset() // Reset form
    },
    onError: (error) => {
      toast.error(`Failed to create test: ${error.message}`)
    },
  })

  const onSubmit = (data: TestFormData) => {
    const submissionData: TestCreateData = {
      ...data,
      test_date: data.test_date.toISOString(), // Format date for backend
      test_type_id: parseInt(data.test_type_id, 10), // Convert string ID to number
      request_id: parseInt(data.request_id, 10), // Convert string ID to number
    }

    console.log(submissionData) // For debugging
    mutation.mutate(submissionData)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* Add asChild to DialogTrigger */}
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Vytvořit nový výsledek testu</DialogTitle>
            <DialogDescription>Vyplňte detaily níže</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              {/* Test Date */}
              <FormField
                control={form.control}
                name='test_date'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Datum testu</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Zvolte datum</span>}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Results */}
              <FormField
                control={form.control}
                name='results'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Výsledky</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Zde vložte výsledky...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* State */}
              <FormField
                control={form.control}
                name='state'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stav</FormLabel>
                    <FormControl>
                      {/* Consider a Select if states are predefined */}
                      <Input placeholder='e.g., Pozitivní, Negativní ' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Test Type */}
              <FormField
                control={form.control}
                name='test_type_id'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between'>
                      <FormLabel>Typ Testu</FormLabel>
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => setCreateTestTypeDialogOpen(true)} // Open the create dialog
                        className='h-7 px-2'
                      >
                        <PlusCircle className='h-4 w-4 mr-1' />
                        Přidat Typ
                      </Button>
                    </div>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingTestTypes}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Zvolte typ testu' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {testTypes?.map((type) => (
                          <SelectItem key={type.id} value={String(type.id)}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Request */}
              <FormField
                control={form.control}
                name='request_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Přidružená žádanka</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingRequests}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Zvolte přidruženou žádanku' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {requests?.map((req) => (
                          <SelectItem key={req.id} value={String(req.id)}>
                            {/* Display useful request info */}
                            ID Žádanky: {req.id}{" "}
                            {req.description ? `- ${req.description.substring(0, 30)}...` : ""}{" "}
                            (Pacient: {req.patient_id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type='button' variant='outline' onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type='submit' disabled={mutation.isPending}>
                  {mutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                  Create Test Result
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {/* Render the CreateTestTypeDialog */}
      <CreateTestTypeDialog
        open={createTestTypeDialogOpen}
        onOpenChange={setCreateTestTypeDialogOpen}
        // Optional: Add onSuccess if you want specific behavior after creation,
        // e.g., selecting the new type automatically.
        // onSuccess={() => { /* Maybe refetch or select the new item */ }}
      />
    </>
  )
}
