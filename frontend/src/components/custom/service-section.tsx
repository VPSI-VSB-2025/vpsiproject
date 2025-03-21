import { Activity, Heart, Stethoscope, Users, Laptop, HelpCircle } from "lucide-react"
import ContainerSection from "./container-section"

const ServiceSection = () => {
  return (
    <ContainerSection id='service' className='py-12 md:py-24 lg:py-32'>
      <div className='flex flex-col items-center justify-center space-y-4 text-center'>
        <div className='space-y-2'>
          <div className='inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground'>
            Naše služby
          </div>
          <h2 className='text-3xl font-bold tracking-tighter md:text-4xl/tight'>
            Služby v nemocnici
          </h2>
          <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
            Nabízí vše od kardiologie až po psychické zdraví.
          </p>
        </div>
      </div>
      <div className='mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-12'>
        <ServiceCard
          icon={<Heart className='h-6 w-6 text-primary' />}
          title='Cardiology'
          description='Comprehensive heart care with advanced diagnostic and treatment options.'
        />
        <ServiceCard
          icon={<Activity className='h-6 w-6 text-primary' />}
          title='Emergency Care'
          description='24/7 emergency services with rapid response and expert care.'
        />
        <ServiceCard
          icon={<Stethoscope className='h-6 w-6 text-primary' />}
          title='Primary Care'
          description='Routine check-ups, preventive care, and management of chronic conditions.'
        />
        <ServiceCard
          icon={<Users className='h-6 w-6 text-primary' />}
          title='Pediatrics'
          description='Specialized care for infants, children, and adolescents.'
        />
        <ServiceCard
          icon={<Laptop className='h-6 w-6 text-primary' />}
          title='Telemedicine'
          description='Virtual consultations with our healthcare professionals from your home.'
        />
        <ServiceCard
          icon={<HelpCircle className='h-6 w-6 text-primary' />}
          title='Mental Health'
          description='Comprehensive mental health services for all ages.'
        />
      </div>
    </ContainerSection>
  )
}

export default ServiceSection

interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => {
  return (
    <div className='flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm'>
      <div className='rounded-full bg-primary/10 p-3'>{icon}</div>
      <h3 className='text-xl font-bold'>{title}</h3>
      <p className='text-center text-muted-foreground'>{description}</p>
    </div>
  )
}
