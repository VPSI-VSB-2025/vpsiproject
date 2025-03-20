"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import React, { useState } from "react"

const CalendarSection = () => {
  return (
    <section id='appointments' className='w-[80%] py-12 md:py-24 lg:py-32 mx-auto'>
      <div className=''>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <div className='inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground'>
              Appointments
            </div>
            <h2 className='text-3xl font-bold tracking-tighter md:text-4xl/tight'>
              Book Your Appointment
            </h2>
            <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              Schedule a visit with our specialists at your convenience.
            </p>
          </div>
        </div>
        <div className='mx-auto max-w-4xl py-12'>
          <Tabs defaultValue='appointment' className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='appointment'>New Appointment</TabsTrigger>
              <TabsTrigger value='virtual'>Virtual Consultation</TabsTrigger>
            </TabsList>
            <TabsContent value='appointment'>
              <Card>
                <CardHeader>
                  <CardTitle>Book an In-Person Appointment</CardTitle>
                  <CardDescription>
                    Select a date, time, and specialist for your visit.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <Label htmlFor='department'>Department</Label>
                      <Select>
                        <SelectTrigger id='department'>
                          <SelectValue placeholder='Select department' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='cardiology'>Cardiology</SelectItem>
                          <SelectItem value='neurology'>Neurology</SelectItem>
                          <SelectItem value='pediatrics'>Pediatrics</SelectItem>
                          <SelectItem value='orthopedics'>Orthopedics</SelectItem>
                          <SelectItem value='oncology'>Oncology</SelectItem>
                          <SelectItem value='internal'>Internal Medicine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='doctor'>Doctor</Label>
                      <Select>
                        <SelectTrigger id='doctor'>
                          <SelectValue placeholder='Select doctor' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='dr-johnson'>Dr. Sarah Johnson</SelectItem>
                          <SelectItem value='dr-chen'>Dr. Michael Chen</SelectItem>
                          <SelectItem value='dr-rodriguez'>Dr. Emily Rodriguez</SelectItem>
                          <SelectItem value='dr-wilson'>Dr. James Wilson</SelectItem>
                          <SelectItem value='dr-patel'>Dr. Aisha Patel</SelectItem>
                          <SelectItem value='dr-kim'>Dr. Robert Kim</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2 md:col-span-2'>
                      <Label>Select Date</Label>
                      <div className='border rounded-md p-4'>
                        <AppointmentCalendar />
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='name'>Full Name</Label>
                      <Input id='name' placeholder='Enter your full name' />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='email'>Email</Label>
                      <Input id='email' type='email' placeholder='Enter your email' />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='phone'>Phone Number</Label>
                      <Input id='phone' placeholder='Enter your phone number' />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='insurance'>Insurance Provider</Label>
                      <Input id='insurance' placeholder='Enter your insurance provider' />
                    </div>
                    <div className='space-y-2 md:col-span-2'>
                      <Label htmlFor='reason'>Reason for Visit</Label>
                      <Textarea
                        id='reason'
                        placeholder='Briefly describe your symptoms or reason for visit'
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className='w-full'>Book Appointment</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value='virtual'>
              <Card>
                <CardHeader>
                  <CardTitle>Book a Virtual Consultation</CardTitle>
                  <CardDescription>
                    Speak with a doctor from the comfort of your home.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <Label htmlFor='v-department'>Department</Label>
                      <Select>
                        <SelectTrigger id='v-department'>
                          <SelectValue placeholder='Select department' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='cardiology'>Cardiology</SelectItem>
                          <SelectItem value='neurology'>Neurology</SelectItem>
                          <SelectItem value='pediatrics'>Pediatrics</SelectItem>
                          <SelectItem value='orthopedics'>Orthopedics</SelectItem>
                          <SelectItem value='oncology'>Oncology</SelectItem>
                          <SelectItem value='internal'>Internal Medicine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='v-doctor'>Doctor</Label>
                      <Select>
                        <SelectTrigger id='v-doctor'>
                          <SelectValue placeholder='Select doctor' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='dr-johnson'>Dr. Sarah Johnson</SelectItem>
                          <SelectItem value='dr-chen'>Dr. Michael Chen</SelectItem>
                          <SelectItem value='dr-rodriguez'>Dr. Emily Rodriguez</SelectItem>
                          <SelectItem value='dr-wilson'>Dr. James Wilson</SelectItem>
                          <SelectItem value='dr-patel'>Dr. Aisha Patel</SelectItem>
                          <SelectItem value='dr-kim'>Dr. Robert Kim</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2 md:col-span-2'>
                      <Label>Select Date</Label>
                      <div className='border rounded-md p-4'>
                        <AppointmentCalendar />
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='v-name'>Full Name</Label>
                      <Input id='v-name' placeholder='Enter your full name' />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='v-email'>Email</Label>
                      <Input id='v-email' type='email' placeholder='Enter your email' />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='v-phone'>Phone Number</Label>
                      <Input id='v-phone' placeholder='Enter your phone number' />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='v-insurance'>Insurance Provider</Label>
                      <Input id='v-insurance' placeholder='Enter your insurance provider' />
                    </div>
                    <div className='space-y-2 md:col-span-2'>
                      <Label htmlFor='v-reason'>Reason for Consultation</Label>
                      <Textarea
                        id='v-reason'
                        placeholder='Briefly describe your symptoms or reason for consultation'
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className='w-full'>Book Virtual Consultation</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}

export default CalendarSection

function AppointmentCalendar() {
  const [date, setDate] = useState(new Date())

  return (
    <div className='space-y-4'>
      <Calendar
        mode='single'
        selected={date}
        onSelect={(day) => day && setDate(day)}
        className='rounded-md border'
      />
      <div className='space-y-2'>
        <Label>Select Time</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='Select time' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='9:00'>9:00 AM</SelectItem>
            <SelectItem value='10:00'>10:00 AM</SelectItem>
            <SelectItem value='11:00'>11:00 AM</SelectItem>
            <SelectItem value='13:00'>1:00 PM</SelectItem>
            <SelectItem value='14:00'>2:00 PM</SelectItem>
            <SelectItem value='15:00'>3:00 PM</SelectItem>
            <SelectItem value='16:00'>4:00 PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
