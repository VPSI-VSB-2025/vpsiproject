"use client"

import type React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
  role: "doctor" | "nurse"
  onRoleChange: (role: "doctor" | "nurse") => void
}

export function DashboardHeader({
  heading,
  text,
  children,
  role,
  onRoleChange,
}: DashboardHeaderProps) {
  return (
    <div className='flex items-center justify-between px-2'>
      <div className='grid gap-1'>
        <div className='flex items-center gap-2'>
          <h1 className='font-heading text-3xl md:text-4xl'>{heading}</h1>
          <Select value={role} onValueChange={(value) => onRoleChange(value as "doctor" | "nurse")}>
            <SelectTrigger className='w-[150px] h-8'>
              <SelectValue placeholder='Select role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='doctor'>Lékař</SelectItem>
              <SelectItem value='nurse'>Sestra</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {text && <p className='text-lg text-muted-foreground'>{text}</p>}
      </div>
      {children}
    </div>
  )
}
