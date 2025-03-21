"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
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
import ContainerSection from "./container-section"

const CalendarSection = () => {
  return (
    <ContainerSection id='calendar' className='py-12 md:py-24 lg:py-32'>
      <div className='flex flex-col items-center justify-center space-y-4 text-center'>
        <div className='space-y-2'>
          <div className='inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground'>
            Kalendář
          </div>
          <h2 className='text-3xl font-bold tracking-tighter md:text-4xl/tight'>
            Přehled dostupných termínů
          </h2>
          <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
            nejaky text....
          </p>
        </div>
      </div>
      <div className='mx-auto max-w-4xl py-12'>
        <Tabs defaultValue='appointment' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='appointment'>Rezervujte si zadanku</TabsTrigger>
            <TabsTrigger value='virtual'>Terminy bez registrace</TabsTrigger>
          </TabsList>
          <TabsContent value='appointment'>
            <Card>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='doctor'>Doktor</Label>
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
                    <Label>Vyberte datum</Label>
                    <div className='border rounded-md p-4'>
                      <AppointmentCalendar />
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Full Name</Label>
                    <Input id='name' placeholder='Enter your full name' />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='phone'>Phone Number</Label>
                    <Input id='phone' placeholder='Enter your phone number' />
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
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='doctor'>Doktor</Label>
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
                    <Label>Vyberte datum</Label>
                    <div className='border rounded-md p-4'>
                      <AppointmentCalendar />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ContainerSection>
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
