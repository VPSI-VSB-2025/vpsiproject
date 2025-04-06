"use client"

import type React from "react"

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
  role: "doctor" | "nurse"
  onRoleChange: (role: "doctor" | "nurse") => void
}

export function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
  return (
    <div className='flex items-center justify-between px-2'>
      <div className='grid gap-1'>
        <div className='flex items-center gap-2'>
          <h1 className='font-heading text-3xl md:text-4xl'>{heading}</h1>
        </div>
        {text && <p className='text-lg text-muted-foreground'>{text}</p>}
      </div>
      {children}
    </div>
  )
}
