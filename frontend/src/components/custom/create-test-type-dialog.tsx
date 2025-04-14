"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { createTestType, TestTypeCreateData } from "@/lib/api" // Import the new API function
import { toast } from "sonner"

// Zod schema for the new test type form
const testTypeFormSchema = z.object({
  name: z.string().min(1, "Test type name is required.").max(100, "Name too long"),
  description: z.string().max(255, "Description too long").optional().nullable(), // Match backend schema
})

type TestTypeFormData = z.infer<typeof testTypeFormSchema>

interface CreateTestTypeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void // Optional callback on success
}

export function CreateTestTypeDialog({ open, onOpenChange, onSuccess }: CreateTestTypeDialogProps) {
  const queryClient = useQueryClient()

  const form = useForm<TestTypeFormData>({
    resolver: zodResolver(testTypeFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const mutation = useMutation({
    mutationFn: createTestType,
    onSuccess: () => {
      toast.success("Test type created successfully!")
      queryClient.invalidateQueries({ queryKey: ["testTypes"] }) // Invalidate the query used in TestDialog
      onOpenChange(false) // Close this dialog
      form.reset() // Reset the form
      onSuccess?.() // Call optional success callback
    },
    onError: (error) => {
      // Display a more specific error from the backend if available
      const message = error instanceof Error ? error.message : "An unknown error occurred."
      toast.error(`Failed to create test type: ${message}`)
    },
  })

  const onSubmit = (data: TestTypeFormData) => {
    const submissionData: TestTypeCreateData = {
      ...data,
      // Ensure description is null if empty, matching backend expectation
      description: data.description || null,
    }

    console.log(submissionData)
    mutation.mutate(submissionData)
  }

  // Handle closing without submitting
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset() // Reset form if closing
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[400px]'>
        <DialogHeader>
          <DialogTitle>Create New Test Type</DialogTitle>
          <DialogDescription>Enter the details for the new test type.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Test Type Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g., Blood Glucose Test' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Test Type Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe the test type...'
                      {...field}
                      // Handle null value from react-hook-form
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type='submit' disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Create Test Type
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
