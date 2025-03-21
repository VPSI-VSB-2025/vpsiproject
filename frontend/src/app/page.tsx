import Navbar from "@/components/custom/navbar-section"
import CalendarSection from "@/components/custom/calendar-section"
import HeroSection from "@/components/custom/hero-section"
import ServiceSection from "@/components/custom/service-section"
import FooterSection from "@/components/custom/footer-section"

export default function HospitalLandingPage() {
  return (
    <div className='flex min-h-screen flex-col'>
      <main className='flex-1'>
        <HeroSection />
        <ServiceSection />
        <CalendarSection />
      </main>
    </div>
  )
}
