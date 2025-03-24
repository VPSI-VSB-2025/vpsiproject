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
          title='Kardiologie'
          description='Komplexní péče o srdce s pokročilými možnostmi diagnostiky a léčby'
        />
        <ServiceCard
          icon={<Activity className='h-6 w-6 text-primary' />}
          title='Tísňová péče'
          description='Nepřetržitá pohotovostní služba s rychlou reakcí a odbornou péčí.'
        />
        <ServiceCard
          icon={<Stethoscope className='h-6 w-6 text-primary' />}
          title='Primární péče'
          description='Běžné prohlídky, preventivní péče a léčba chronických onemocnění.'
        />
        <ServiceCard
          icon={<Users className='h-6 w-6 text-primary' />}
          title='Pediatrie'
          description='Specializovaná péče o kojence, děti a dospívající.'
        />
        <ServiceCard
          icon={<Laptop className='h-6 w-6 text-primary' />}
          title='Telemedicína'
          description='Virtuální konzultace s našimi zdravotníky z vašeho domova.'
        />
        <ServiceCard
          icon={<HelpCircle className='h-6 w-6 text-primary' />}
          title='Duševní zdraví'
          description='Komplexní služby v oblasti duševního zdraví pro všechny věkové kategorie.'
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
