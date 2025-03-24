import RoleSelectionForm from "@/components/custom/role-selection"

export default function RoleSelectionPage() {
  return (
    <main className='container mx-auto py-10'>
      <div className='flex w-full h-screen items-center justify-center flex-col'>
        <h1 className='text-3xl font-bold mb-6 text-center'>
          Dobrý den, <br /> jste doktor, či sestra?
        </h1>
        <RoleSelectionForm />
      </div>
    </main>
  )
}
