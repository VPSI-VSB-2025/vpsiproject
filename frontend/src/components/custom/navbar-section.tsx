"use client"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { Heart, Menu, Phone, X } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import React from "react"
import useNavbarStore from "@/store/navbarStore"

const Navbar = () => {
  return (
    <header className='fixed top-16 left-1/2 z-[999] bg-background/97 w-[80%] mx-auto rounded-lg px-8 -translate-x-1/2 -translate-y-1/2'>
      <div className='container flex h-16 items-center justify-between mx-auto'>
        <div className='flex items-center gap-2'>
          <Heart className='h-6 w-6 text-primary' />
          <span className='text-xl font-bold'>MediSys</span>
        </div>

        <MobileMenu />

        <nav className='hidden lg:flex items-center gap-6'>
          <Link href='#home' className='text-sm font-medium hover:text-primary'>
            Home
          </Link>
          <Link href='#services' className='text-sm font-medium hover:text-primary'>
            Services
          </Link>
          <Link href='#doctors' className='text-sm font-medium hover:text-primary'>
            Doctors
          </Link>
          <Link href='#appointments' className='text-sm font-medium hover:text-primary'>
            Appointments
          </Link>
          <Link href='#contact' className='text-sm font-medium hover:text-primary'>
            Contact
          </Link>
        </nav>

        <div className='hidden lg:flex items-center gap-4'>
          <SignedOut>
            <SignInButton>
              <Button className='cursor-pointer' variant='default'>
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className='cursor-pointer' variant='default'>
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}

const MobileMenu = () => {
  const { isOpen, toggleNavbar } = useNavbarStore() as {
    isOpen: boolean
    toggleNavbar: () => void
  }

  return (
    <div className='lg:hidden'>
      <Button variant='ghost' size='icon' onClick={toggleNavbar}>
        <Menu className='h-5 w-5' />
      </Button>
      {isOpen && (
        <div className='fixed inset-0 z-50 bg-background/80 backdrop-blur-sm rounded-lg'>
          <div className='sticky inset-y-0  w-full border-l bg-background p-6 shadow-lg h-[95vh] rounded-lg'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Heart className='h-6 w-6 text-primary' />
                <span className='text-xl font-bold'>MediCare</span>
              </div>
              <Button variant='ghost' size='icon' onClick={toggleNavbar}>
                <X className='h-5 w-5' />
                <span className='sr-only'>Close menu</span>
              </Button>
            </div>
            <nav className='mt-8 flex flex-col gap-6'>
              <Link href='#home' className='text-lg font-medium' onClick={toggleNavbar}>
                Home
              </Link>
              <Link href='#service' className='text-lg font-medium' onClick={toggleNavbar}>
                Services
              </Link>
              <Link href='#doctors' className='text-lg font-medium' onClick={toggleNavbar}>
                Doctors
              </Link>
              <Link href='#appointments' className='text-lg font-medium' onClick={toggleNavbar}>
                Appointments
              </Link>
              <Link href='#contact' className='text-lg font-medium' onClick={toggleNavbar}>
                Contact
              </Link>
            </nav>
            <div className='mt-8 space-y-4'>
              <div className='flex items-center gap-2'>
                <Phone className='h-4 w-4 text-primary' />
                <span className='text-sm font-medium'>Emergency: 911</span>
              </div>
              <Button className='w-full' onClick={toggleNavbar}>
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar
