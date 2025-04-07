import CalendarSection from "@/components/custom/calendar-section"
import FooterSection from "@/components/custom/footer-section"
import HeroSection from "@/components/custom/hero-section"
import Navbar from "@/components/custom/navbar-section"
import ServiceSection from "@/components/custom/service-section"

const links = [
  { name: "Úvod", href: "#home" },
  { name: "Služby", href: "#service" },
  { name: "Kalendář", href: "#calendar" },
  { name: "Kontakt", href: "#contact" },
]

export default function HospitalLandingPage() {
  return (
    <div className='flex min-h-screen flex-col'>
      <main className='flex-1'>
        <Navbar links={links} />
        <HeroSection />
        <ServiceSection />
        <CalendarSection />
        <FooterSection links={links} />
      </main>
    </div>
  )
}
