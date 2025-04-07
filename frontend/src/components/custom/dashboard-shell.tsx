"use client"

import type React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Calendar, FileText, Home, LogOut, Settings, User, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className='flex h-16 items-center px-4'>
          <div className='flex items-center gap-2 font-semibold'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='h-6 w-6'
            >
              <path d='M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z'></path>
            </svg>
            <span>MediSys</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
                <a href='/dashboard'>
                  <Home className='h-4 w-4' />
                  <span>Přehled</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href='/dashboard/appointments'>
                  <Calendar className='h-4 w-4' />
                  <span>Termíny</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href='/dashboard/requests'>
                  <FileText className='h-4 w-4' />
                  <span>Žádosti pacientů</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href='/dashboard/patients'>
                  <Users className='h-4 w-4' />
                  <span>Pacienti</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href='/dashboard/profile'>
                  <User className='h-4 w-4' />
                  <span>Profil</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href='/dashboard/settings'>
                  <Settings className='h-4 w-4' />
                  <span>Nastavení</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Avatar className='h-5 w-5'>
                  <AvatarImage src='/placeholder-user.jpg' alt='Dr. Smith' />
                  <AvatarFallback>DS</AvatarFallback>
                </Avatar>
                <span>Dr. Smith</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href='/logout'>
                  <LogOut className='h-4 w-4' />
                  <span>Odhlásit se</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6'>
          <SidebarTrigger />
          <Separator orientation='vertical' className='h-6' />
          <div className='font-semibold'>Nemocniční informační systém</div>
        </header>
        <main className='flex-1 space-y-4 p-4 md:p-8 pt-6'>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
