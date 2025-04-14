"use client"

import type React from "react"

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
  role: "doctor" | "nurse"
}

export function DashboardHeader({ heading, text, children, role }: DashboardHeaderProps) {
  const roleText = role === "doctor" ? "Lékař" : "Sestra"

  return (
    <div className='flex items-center justify-between px-2'>
      <div className='grid gap-1'>
        <div className='flex items-center gap-2'>
          <h1 className='font-heading text-3xl md:text-4xl'>{heading}</h1>
          <span className='text-sm font-medium text-muted-foreground'>({roleText})</span>
        </div>
        {text && <p className='text-lg text-muted-foreground'>{text}</p>}
      </div>
      {children}
    </div>
  )
}
