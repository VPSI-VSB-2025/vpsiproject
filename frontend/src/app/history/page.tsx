"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form" // Import Form components
import { fetchPatientHistory, fetchTestTypes, HistoryData } from "@/lib/api" // Import API function and type
import Navbar from "@/components/custom/navbar-section"
import FooterSection from "@/components/custom/footer-section"

// Define the form schema using Zod
const formSchema = z.object({
  personalNumber: z.string().min(1, "Personal number is required"),
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
})

const links = [
  { name: "Úvod", href: "/" },
  { name: "Služby", href: "/#service" },
  { name: "Kalendář", href: "/#calendar" },
  { name: "Kontakt", href: "#/contact" },
]

type FormData = z.infer<typeof formSchema>

export default function HistoryPage() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalNumber: "",
      name: "",
      surname: "",
    },
  })

  const mutation = useMutation<HistoryData, Error, FormData>({
    mutationFn: (data) =>
      fetchPatientHistory({
        personal_number: data.personalNumber, // Map form data to API structure
        name: data.name,
        surname: data.surname,
      }),
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(data)
  }

  const { data: types } = useQuery({
    queryKey: ["tests"],
    queryFn: fetchTestTypes,
  })

  return (
    <div className='container mx-auto p-4 pt-24'>
      <Navbar links={links} />

      <Card className='max-w-lg mx-auto'>
        <CardHeader>
          <CardTitle>Historie Pacienta</CardTitle>
          <CardDescription>Vložte údaje pro zobrazení vašich testů a historie.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            {" "}
            {/* Spread form methods */}
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='personalNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rodné číslo</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., 123456/7890' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jméno</FormLabel>
                    <FormControl>
                      <Input placeholder='Jan' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='surname'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Příjmení</FormLabel>
                    <FormControl>
                      <Input placeholder='Novák' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' disabled={mutation.isPending} className='w-full'>
                {mutation.isPending ? "Načítám..." : "Vyhledat"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {mutation.isError && (
        <Alert variant='destructive' className='mt-6 max-w-lg mx-auto'>
          <AlertTitle>Error</AlertTitle>
          {/* Display error message from the mutation */}
          <AlertDescription>{mutation.error.message}</AlertDescription>
        </Alert>
      )}

      {mutation.isSuccess && mutation.data && (
        <div className='mt-8'>
          <h2 className='text-2xl font-semibold mb-4 text-center'>Vaše Historie</h2>
          <Accordion type='single' collapsible className='w-full max-w-3xl mx-auto'>
            {/* Requests Accordion */}
            <AccordionItem value='requests'>
              <AccordionTrigger>Žádanky ({mutation.data.requests.length})</AccordionTrigger>
              <AccordionContent>
                {mutation.data.requests.length > 0 ? (
                  <ul className='space-y-3'>
                    {mutation.data.requests.map((req) => (
                      <li key={req.id} className='p-3 border rounded-md bg-muted/40'>
                        <p>
                          <strong>ID:</strong> {req.id}
                        </p>
                        <p>
                          <strong>Stav:</strong> {req.state}
                        </p>
                        <p>
                          <strong>Vytvořeno:</strong> {new Date(req.created_at).toLocaleString()}
                        </p>
                        {req.description && (
                          <p>
                            <strong>Popisek:</strong> {req.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Žádanky nenalezeny.</p>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Appointments Accordion */}
            <AccordionItem value='appointments'>
              <AccordionTrigger>
                Termíny žádanek ({mutation.data.appointments.length})
              </AccordionTrigger>
              <AccordionContent>
                {mutation.data.appointments.length > 0 ? (
                  <ul className='space-y-3'>
                    {mutation.data.appointments.map((appt) => (
                      <li key={appt.id} className='p-3 border rounded-md bg-muted/40'>
                        <p>
                          <strong>ID:</strong> {appt.id}
                        </p>
                        <p>
                          <strong>Typ:</strong> {appt.event_type}
                        </p>
                        <p>
                          <strong>OD:</strong> {new Date(appt.date_from).toLocaleString()}
                        </p>
                        <p>
                          <strong>DO:</strong> {new Date(appt.date_to).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Termíny žádanek nenalezeny.</p>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Tests Accordion */}
            <AccordionItem value='tests'>
              <AccordionTrigger>Testy ({mutation.data.tests.length})</AccordionTrigger>
              <AccordionContent>
                {mutation.data.tests.length > 0 ? (
                  <ul className='space-y-3'>
                    {mutation.data.tests.map((test) => (
                      <li key={test.id} className='p-3 border rounded-md bg-muted/40'>
                        <p>
                          <strong>ID:</strong> {test.id}
                        </p>
                        <p>
                          <strong>Datum:</strong> {new Date(test.test_date).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Stav:</strong> {test.state}
                        </p>
                        <p>
                          <strong>Typ:</strong>{" "}
                          {types?.find((type) => type.id === test.test_type_id)?.name ||
                            `Type ID: ${test.test_type_id}`}
                        </p>
                        <p>
                          <strong>Výsledek:</strong> {test.results}
                        </p>
                        <p>
                          <strong>Vytvořeno:</strong> {new Date(test.created_at).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No tests found.</p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <FooterSection links={links} />
        </div>
      )}
    </div>
  )
}
