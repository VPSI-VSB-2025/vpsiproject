"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Specialization } from "@/types/specialization"
import axios, { AxiosError } from "axios"
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { Doctor } from "@/types/doctor"
import { Nurse } from "@/types/nurse"
import { useRouter } from "next/navigation"

const fetchSpecializations = async (): Promise<Specialization[]> => {
  return axios
    .get("https://nemocnice.netlify.app/specializations/")
    .then((response) => {
      return response.data
    })
    .catch((error: AxiosError) => {
      console.error("Error fetching specializations:", error)
      return []
    })
}

const fetchDoctors = async (): Promise<Doctor[]> => {
  return axios
    .get("https://nemocnice.netlify.app/doctors")
    .then((response) => {
      return response.data
    })
    .catch((error: AxiosError) => {
      console.error("Error fetching doctors:", error)
      return []
    })
}

const fetchNurses = async (): Promise<Nurse[]> => {
  return axios
    .get("https://nemocnice.netlify.app/nurses")
    .then((response) => {
      return response.data
    })
    .catch((error: AxiosError) => {
      console.error("Error fetching nurses:", error)
      return []
    })
}

const addSpecialization = async (name: string) => {
  return axios
    .post("https://nemocnice.netlify.app/specializations/", { name })
    .then((response) => {
      return response.data
    })
    .catch((error: AxiosError) => {
      console.error("Error adding specialization:", error)
      return null
    })
}

const formSchema = z.object({
  role: z.enum(["sestra", "doktor"], {
    required_error: "Please select a role",
  }),
  phoneNumber: z.string().min(9, {
    message: "Phone number must be at least 9 digits",
  }),
  specialization: z.number(),
})

export default function RoleSelectionForm() {
  const [specializations, setSpecializations] = useState<{ id: number; name: string }[]>([])
  const [open, setOpen] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [newSpecialization, setNewSpecialization] = useState("")

  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "doktor",
      phoneNumber: "",
      specialization: 0,
    },
  })

  const selectedRole = form.watch("role")

  const doctorsQueryOptions = queryOptions({
    queryKey: ["doctors"],
    queryFn: () => fetchDoctors(),
    enabled: !!isSignedIn,
  })

  const { data: doctors } = useQuery(doctorsQueryOptions)

  const nursesQueryOptions = queryOptions({
    queryKey: ["nurses"],
    queryFn: () => fetchNurses(),
    enabled: !!isSignedIn,
  })

  const { data: nurses } = useQuery(nursesQueryOptions)

  doctors?.forEach((doctor) => {
    if (doctor.email === user?.emailAddresses[0].emailAddress) {
      router.push("/protected/dashboard")
    }
  })

  nurses?.forEach((nurse) => {
    console.log(nurse.email, user?.emailAddresses[0].emailAddress)
    if (nurse.email === user?.emailAddresses[0].emailAddress) {
      router.push("/protected/dashboard")
    }
  })

  const specializationQueryOptions = queryOptions({
    queryKey: ["specializations"],
    queryFn: () => fetchSpecializations(),
    enabled: !!isSignedIn,
  })

  const { data } = useQuery(specializationQueryOptions)

  const addDoctor = async (values: z.infer<typeof formSchema>) => {
    return axios.post("https://nemocnice.netlify.app/doctors/", {
      name: user?.firstName,
      surname: user?.lastName,
      email: user?.emailAddresses[0].emailAddress,
      phone_number: values.phoneNumber,
      specialization: values.specialization,
    })
  }
  const addNurse = async (values: z.infer<typeof formSchema>) => {
    return axios.post("https://nemocnice.netlify.app/nurses/", {
      name: user?.firstName,
      surname: user?.lastName,
      email: user?.emailAddresses[0].emailAddress,
      phone_number: values.phoneNumber,
    })
  }

  const createDoctorMutation = useMutation({
    mutationFn: addDoctor,
    onSuccess: () => {
      router.push("/protected/dashboard")
    },
    onError: (error) => {
      toast.error(`Nastala chyba při přidělování role ${error}`)
      router.push("/protected/dashboard")
    },
  })

  const createNurseMutation = useMutation({
    mutationFn: addNurse,
    onSuccess: () => {
      router.push("/protected/dashboard")
    },
    onError: (error) => {
      toast.error(`Nastala chyba při přidělování role ${error}`)
      router.push("/protected/dashboard")
    },
  })

  useEffect(() => {
    if (data) {
      setSpecializations(data)
    }
  }, [data])

  if (!isLoaded || !isSignedIn) {
    return null
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.role === "doktor") {
      createDoctorMutation.mutate(values)
    } else {
      createNurseMutation.mutate(values)
    }
  }

  const handleAddSpecialization = async () => {
    if (newSpecialization.trim()) {
      const added = await addSpecialization(newSpecialization)
      setSpecializations([...specializations, added])
      form.setValue("specialization", added.id)
      setNewSpecialization("")
      setOpenDialog(false)
      setOpen(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6 max-w-md border-2 rounded-md px-16 py-10'
      >
        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem className='space-y-3'>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className='flex flex-col space-y-1'
                >
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='sestra' id='nurse' className='cursor-pointer' />
                    <FormLabel htmlFor='sestra' className='font-normal'>
                      Sestra
                    </FormLabel>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='doktor' id='doctor' className='cursor-pointer' />
                    <FormLabel htmlFor='doktor' className='font-normal'>
                      Doktor
                    </FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='phoneNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon</FormLabel>
              <FormControl>
                <Input placeholder='Zadejte své tel. číslo' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedRole === "doktor" && (
          <FormField
            control={form.control}
            name='specialization'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Specializace</FormLabel>
                <div className='flex space-x-2'>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          aria-expanded={open}
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? specializations.find(
                                (specialization) => specialization.id === field.value
                              )?.name
                            : "Zvolte specializaci"}
                          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-[200px] p-0'>
                      <Command>
                        <CommandInput placeholder='Hledat specializaci...' />
                        <CommandList>
                          <CommandEmpty>Specializace nenalezena</CommandEmpty>
                          <CommandGroup>
                            {specializations.map((specialization) => (
                              <CommandItem
                                key={specialization.id}
                                value={specialization.name}
                                onSelect={() => {
                                  form.setValue("specialization", specialization.id)
                                  setOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    specialization.id === field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {specialization.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                      <Button variant='outline' size='icon' className='flex-shrink-0'>
                        <Plus className='h-4 w-4' />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-[425px]'>
                      <DialogHeader>
                        <DialogTitle>Přidat specializaci</DialogTitle>
                      </DialogHeader>
                      <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-4 items-center gap-4'>
                          <Input
                            id='name'
                            placeholder='Specializace (např. Ortoped)'
                            className='col-span-4'
                            value={newSpecialization}
                            onChange={(e) => setNewSpecialization(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddSpecialization}>Přidat</Button>
                    </DialogContent>
                  </Dialog>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button
          type='submit'
          disabled={
            !form.formState.isValid ||
            (selectedRole === "doktor" && !form.watch("specialization")) ||
            !form.watch("phoneNumber")
          }
          className='w-full cursor-pointer'
        >
          Zvolit roli
        </Button>
      </form>
    </Form>
  )
}
