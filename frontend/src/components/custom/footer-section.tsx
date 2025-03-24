import { Heart } from "lucide-react"
import Link from "next/link"
import ContainerSection from "./container-section"

interface Footerprops {
  links: { name: string; href: string }[]
}

const FooterSection: React.FC<Footerprops> = ({ links }) => {
  return (
    <ContainerSection id='contact' className='py-12 md:py-24 lg:py-32'>
      <div className='grid gap-8 grid-cols-2 border-t py-4 border-slate-300'>
        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Heart className='h-6 w-6 text-primary' />
            <span className='text-xl font-bold'>Budulinci systems</span>
          </div>
          <p className='text-sm text-muted-foreground'>Systémy pro nemocnice</p>
        </div>
        <div className='space-y-4'>
          <h3 className='text-lg font-medium'>Rychlé menu</h3>
          <nav className='space-y-2 text-sm flex flex-col'>
            {links.map((link) => (
              <Link href={link.href} key={link.name} className='hover:text-primary text-black'>
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className='mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row'>
        <p className='text-sm text-muted-foreground'>
          © {new Date().getFullYear()} Budulinci Systems. All rights reserved.
        </p>
        <div className='flex items-center gap-4'>
          <Link href='#' className='text-xs text-muted-foreground hover:text-foreground'>
            Zásady ochrany osobních údajů
          </Link>
          <Link href='#' className='text-xs text-muted-foreground hover:text-foreground'>
            Podmínky služby
          </Link>
          <Link href='#' className='text-xs text-muted-foreground hover:text-foreground'>
            Přístupnost
          </Link>
        </div>
      </div>
    </ContainerSection>
  )
}

export default FooterSection
