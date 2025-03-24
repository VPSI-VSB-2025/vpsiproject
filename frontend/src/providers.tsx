"use client"

import { ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ClerkProvider } from "@clerk/nextjs"

interface Props {
  children?: ReactNode
  session?: any
}

export default function Providers({ children, session }: Props) {
  const queryClient = new QueryClient()

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ClerkProvider>
  )
}
