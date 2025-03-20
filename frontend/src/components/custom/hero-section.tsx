import { Clock, Users } from "lucide-react"
import { Button } from "../ui/button"
import Image from "next/image"

const HeroSection = () => {
  return (
    <section
      id='home'
      className='h-[100vh] flex justify-center items-center bg-gradient-to-b from-slate-100 to-slate-200 mx-auto'
    >
      <div className='w-[80%] '>
        <div className='grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2'>
          <div className='flex flex-col justify-center space-y-4'>
            <div className='space-y-2'>
              <h1 className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none'>
                Your Health Is Our Priority
              </h1>
              <p className='relative w-full text-muted-foreground md:text-xl break-words'>
                Providing exceptional healthcare services with compassion and expertise. Our team of
                specialists is dedicated to your well-being.
              </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
              <Button size='lg' className='px-8'>
                Book Appointment
              </Button>
              <Button size='lg' variant='outline' className='px-8'>
                Virtual Consultation
              </Button>
            </div>
            <div className='flex items-center gap-4 text-sm text-muted-foreground'>
              <div className='flex items-center gap-1'>
                <Clock className='h-4 w-4 text-primary' />
                <span>24/7 Emergency Care</span>
              </div>
              <div className='flex items-center gap-1'>
                <Users className='h-4 w-4 text-primary' />
                <span>Expert Specialists</span>
              </div>
            </div>
          </div>
          <div className='flex items-center justify-center relative'>
            <img
              src='https://png.pngtree.com/png-vector/20230214/ourmid/pngtree-stethoscope-with-diagnosis-medical-report-cartoon-clipart-on-transparent-background-png-image_6594830.png'
              // width={450}
              // height={550}
              alt='Hospital building'
              className='rounded-lg object-cover shadow-xl 
              lg:w-full'
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
